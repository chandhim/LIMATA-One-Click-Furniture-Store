import { aiClient } from "@/lib/ai-client";
import { ApiError } from "@/shared/errors/api-error";
import { AxiosError } from "axios";

function handleAxiosError(error: unknown) {
  if (error instanceof AxiosError) {
    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      throw new ApiError(504, "Gateway Timeout: AI Service took too long to respond.");
    }
    if (!error.response) {
      throw new ApiError(503, "Service Unavailable: AI Service is unreachable.");
    }
    
    // Forward the standard error payload from FastAPI
    const message = error.response.data?.detail || "AI Service Error";
    throw new ApiError(error.response.status, message);
  }
  
  throw error; // Let the global error handler catch unexpected internal errors
}

export async function getHealth() {
  try {
    const response = await aiClient.get("/health");
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function proxyDetect(payload: Record<string, unknown>) {
  try {
    const response = await aiClient.post("/detect", payload);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function proxyDepth(payload: Record<string, unknown>) {
  try {
    const response = await aiClient.post("/depth", payload);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function proxyAnalyze(payload: Record<string, unknown>) {
  try {
    const response = await aiClient.post("/analyze", payload);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

import { getProducts, getProductById } from "../products/product.service";
import {
  createAiConversation,
  getAiConversationById,
  getUserAiConversations,
  createAiMessage
} from "./ai.repository";

export async function proxyRecommend(payload: Record<string, unknown>) {
  try {
    const products = await getProducts({ includeDetails: true });

    // Map strictly to the fields expected by the Python RecommendationService
    const available_products = products.map((p: any) => ({
      productId: p.productId,
      name: p.name,
      description: p.description,
      category: p.category,
      material: p.material,
      price: p.price,
      stock: p.stock
    }));

    const aiPayload = {
      preferences: payload.preferences,
      available_products
    };

    const response = await aiClient.post("/recommend", aiPayload);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function getUserConversations(userId: string) {
  const conversations = await getUserAiConversations(userId);
  return conversations.map(c => ({
    id: c.aiConversationId,
    title: c.title,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt
  }));
}

export async function getConversation(conversationId: string, userId: string) {
  const conversation = await getAiConversationById(conversationId, userId);
  if (!conversation) {
    throw new ApiError(404, "Conversation not found or access denied.");
  }

  const products = await getProducts({ includeDetails: true });
  
  const formattedMessages = conversation.messages.map(m => {
    let recommendedProducts = undefined;
    if (m.recommendedProducts && Array.isArray(m.recommendedProducts)) {
      recommendedProducts = (m.recommendedProducts as string[])
        .map((id: string) => products.find((p: any) => p.productId === id))
        .filter(Boolean);
    }
    
    return {
      id: m.aiMessageId,
      role: m.role.toLowerCase(),
      content: m.content,
      recommendedProducts,
      createdAt: m.createdAt
    };
  });

  return {
    id: conversation.aiConversationId,
    title: conversation.title,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
    messages: formattedMessages
  };
}

export async function proxyChat(payload: Record<string, any>, user?: any) {
  try {
    let aiConversationId = payload.conversationId || payload.context?.conversationId;
    let history = payload.history || [];
    const message = payload.message || "";
    
    // For authenticated users, handle database persistence
    if (user) {
      if (aiConversationId) {
        // Verify ownership and load history
        const conv = await getAiConversationById(aiConversationId, user.id);
        if (!conv) {
          throw new ApiError(404, "Conversation not found or access denied.");
        }
        
        // Rebuild history from database
        history = conv.messages.map(m => ({
          role: m.role === "USER" ? "user" : "assistant",
          content: m.content
        }));
      } else {
        // Create new conversation
        const title = message.substring(0, 50) || "New Conversation";
        const newConv = await createAiConversation(user.id, title);
        aiConversationId = newConv.aiConversationId;
      }
      
      // Store user message
      await createAiMessage(aiConversationId, "USER", message);
    }
    
    const products = await getProducts({ includeDetails: true });

    const available_products = products.map((p: any) => ({
      productId: p.productId,
      name: p.name,
      description: p.description,
      category: p.category,
      material: p.material,
      price: p.price,
      stock: p.stock
    }));

    const enrichedPayload = {
      message: message,
      history: history,
      context: {
        ...(payload.context as Record<string, unknown> || {}),
        available_products
      }
    };

    const response = await aiClient.post("/chat", enrichedPayload);
    const data = response.data;
    
    // Persist assistant message if authenticated
    if (user && aiConversationId) {
      await createAiMessage(
        aiConversationId, 
        "ASSISTANT", 
        data.reply || "", 
        data.recommended_product_ids || null
      );
      data.conversationId = aiConversationId;
    }
    
    if (data.recommended_product_ids && Array.isArray(data.recommended_product_ids)) {
      data.recommendedProducts = data.recommended_product_ids
        .map((id: string) => products.find((p: any) => p.productId === id))
        .filter(Boolean);
    }
    
    return data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function proxyPlacement(productId: string, file: Express.Multer.File) {
  try {
    const product = await getProductById(productId);
    if (!product) {
      throw new ApiError(404, `Product with ID ${productId} not found.`);
    }

    const furnitureMetadata = {
      width: product.width ?? 1.0,
      depth: product.depth ?? 1.0,
      height: product.height ?? 1.0,
      category: product.category,
      rotatable: true
    };

    const formData = new FormData();
    // Use Blob or Buffer. Axios supports native FormData in Node 18+, but standard way with Multer is appending Buffer.
    // If native FormData is used, we might need a Blob. 
    // Using standard Blob for native FormData (if axios > 1.x) or just pass buffer if using form-data package.
    // We will append a Blob constructed from the buffer.
    const blob = new Blob([file.buffer], { type: file.mimetype });
    formData.append("image", blob, file.originalname);
    formData.append("furniture_metadata", JSON.stringify(furnitureMetadata));

    const response = await aiClient.post("/placement", formData);
    
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function proxyVisualRecommendation(file: Express.Multer.File) {
  try {
    const products = await getProducts({ includeDetails: true });

    // Map strictly to the fields expected by the Python RecommendationService
    const available_products = products.map((p: any) => ({
      productId: p.productId,
      name: p.name,
      description: p.description,
      category: p.category,
      material: p.material,
      price: p.price,
      stock: p.stock
    }));

    const formData = new FormData();
    const blob = new Blob([file.buffer], { type: file.mimetype });
    formData.append("image", blob, file.originalname);
    formData.append("available_products", JSON.stringify(available_products));

    const response = await aiClient.post("/visual-recommend", formData);
    
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}
