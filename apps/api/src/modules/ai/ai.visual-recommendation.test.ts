import { describe, it, mock, afterEach } from "node:test";
import assert from "node:assert";

// Mock Prisma by setting global.__prisma before importing
const mockPrismaClient = {
  product: {
    findMany: async () => [],
  },
};
(global as any).__prisma = mockPrismaClient;

import { proxyVisualRecommendation } from "./ai.service";
import { aiClient } from "@/lib/ai-client";
import { ApiError } from "@/shared/errors/api-error";
import { AxiosError } from "axios";

describe("Express AI Visual Recommendation Integration", () => {
  afterEach(() => {
    mock.restoreAll();
  });

  it("should retrieve products, construct FormData, and proxy to FastAPI", async () => {
    // Mock the product service
    const mockProducts = [
      {
        productId: "prod-1",
        name: "Test Sofa",
        description: "A nice sofa",
        category: "Living Room",
        material: "Leather",
        price: 100,
        stock: 5,
        width: 200, // Should be ignored in available_products mapping
        depth: 100,
        height: 100
      }
    ];
    mockPrismaClient.product.findMany = async () => mockProducts;

    // Mock the AI client to return a mock response
    const mockPost = mock.method(aiClient, "post", async (url: string, formData: any, config: any) => {
      assert.strictEqual(url, "/visual-recommend");
      assert.strictEqual(config?.headers?.["Content-Type"], "multipart/form-data");
      
      return {
        data: {
          recommended_product_ids: ["prod-1"],
          visual_context: {
            detected_class: "couch",
            mapped_category: "Living Room",
            search_query: "tv stand table"
          }
        }
      };
    });

    const mockFile = {
      buffer: Buffer.from("mock image"),
      originalname: "test.jpg",
      mimetype: "image/jpeg",
    } as Express.Multer.File;

    const result = await proxyVisualRecommendation(mockFile);

    assert.strictEqual(result.recommended_product_ids[0], "prod-1");
    assert.strictEqual(result.visual_context.detected_class, "couch");
    
    // Verify AI client was called
    assert.strictEqual(mockPost.mock.callCount(), 1);
  });

  it("should handle empty catalog safely", async () => {
    mockPrismaClient.product.findMany = async () => [];

    const mockPost = mock.method(aiClient, "post", async (url: string, formData: any, config: any) => {
      return {
        data: {
          recommended_product_ids: [],
          visual_context: {}
        }
      };
    });

    const mockFile = {
      buffer: Buffer.from("mock image"),
      originalname: "test.jpg",
      mimetype: "image/jpeg",
    } as Express.Multer.File;

    const result = await proxyVisualRecommendation(mockFile);
    assert.strictEqual(result.recommended_product_ids.length, 0);
  });

  it("should propagate FastAPI errors correctly", async () => {
    mockPrismaClient.product.findMany = async () => [];

    // Mock a 504 Gateway Timeout error
    mock.method(aiClient, "post", async () => {
      const error = new AxiosError("Timeout", "ETIMEDOUT");
      throw error;
    });

    const mockFile = {
      buffer: Buffer.from("mock image"),
      originalname: "test.jpg",
      mimetype: "image/jpeg",
    } as Express.Multer.File;

    try {
      await proxyVisualRecommendation(mockFile);
      assert.fail("Should have thrown ApiError");
    } catch (e: any) {
      assert.strictEqual(e instanceof ApiError, true);
      assert.strictEqual(e.statusCode, 504);
    }
  });
});
