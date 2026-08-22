import { describe, it, mock } from "node:test";
import assert from "node:assert";

// 1. Mock Prisma by setting global.__prisma before importing
const mockPrismaClient = {
  product: {
    findMany: async () => [],
  },
};
(global as any).__prisma = mockPrismaClient;

import { proxyRecommend } from "./ai.service";
import { aiClient } from "@/lib/ai-client";
import { ApiError } from "@/shared/errors/api-error";
import { AxiosError } from "axios";

describe("Express AI Recommendation Integration", () => {
  it("should successfully retrieve products, map fields exactly, and proxy to FastAPI", async () => {
    // Override prisma mock for this test
    const mockProducts = [
      {
        productId: "p1",
        name: "Mock Table",
        description: "A nice table",
        category: "Tables",
        material: "Wood",
        price: 100,
        stock: 5,
        images: ["img.png"], // Should be stripped
        model3dUrl: "model.glb", // Should be stripped
        createdAt: new Date(), // Should be stripped
        updatedAt: new Date(), // Should be stripped
      },
    ];
    mockPrismaClient.product.findMany = async () => mockProducts as any;

    // Mock aiClient
    const mockAiResponse = {
      data: {
        recommended_product_ids: ["p1"],
        matching_info: { p1: { score: 100, reasons: [] } },
        metadata: { total_evaluated: 1, execution_time_ms: 5.0 },
      },
    };
    const postMock = mock.method(aiClient, "post", async () => mockAiResponse);

    const payload = {
      preferences: {
        query: "table",
        max_price: 200,
      },
    };

    const result = await proxyRecommend(payload);

    assert.deepStrictEqual(result, mockAiResponse.data);

    // Verify aiClient payload format
    assert.strictEqual(postMock.mock.calls.length, 1);
    const callArgs = postMock.mock.calls[0].arguments;
    assert.strictEqual(callArgs[0], "/recommend");
    
    const sentPayload = callArgs[1];
    assert.deepStrictEqual(sentPayload.preferences, payload.preferences);
    
    // Verify mapped available_products
    assert.strictEqual(sentPayload.available_products.length, 1);
    const sentProduct = sentPayload.available_products[0];
    
    // Check included fields
    assert.strictEqual(sentProduct.productId, "p1");
    assert.strictEqual(sentProduct.name, "Mock Table");
    assert.strictEqual(sentProduct.description, "A nice table");
    assert.strictEqual(sentProduct.category, "Tables");
    assert.strictEqual(sentProduct.material, "Wood");
    assert.strictEqual(sentProduct.price, 100);
    assert.strictEqual(sentProduct.stock, 5);
    
    // Check excluded fields
    assert.strictEqual((sentProduct as any).images, undefined);
    assert.strictEqual((sentProduct as any).model3dUrl, undefined);
    assert.strictEqual((sentProduct as any).createdAt, undefined);
    assert.strictEqual((sentProduct as any).updatedAt, undefined);

    mock.restoreAll();
  });

  it("should handle empty catalog correctly", async () => {
    mockPrismaClient.product.findMany = async () => [];
    
    const mockAiResponse = {
      data: {
        recommended_product_ids: [],
        matching_info: {},
        metadata: { total_evaluated: 0, execution_time_ms: 1.0 },
      },
    };
    const postMock = mock.method(aiClient, "post", async () => mockAiResponse);

    const payload = { preferences: {} };
    const result = await proxyRecommend(payload);

    assert.deepStrictEqual(result, mockAiResponse.data);
    
    const callArgs = postMock.mock.calls[0].arguments;
    assert.strictEqual(callArgs[1].available_products.length, 0);

    mock.restoreAll();
  });

  it("should throw ApiError if FastAPI times out", async () => {
    mockPrismaClient.product.findMany = async () => [];
    
    const timeoutError = new AxiosError("Timeout", "ECONNABORTED");
    mock.method(aiClient, "post", async () => {
      throw timeoutError;
    });

    const payload = { preferences: {} };
    
    await assert.rejects(
      async () => {
        await proxyRecommend(payload);
      },
      (err: any) => {
        return err instanceof ApiError && err.statusCode === 504;
      }
    );

    mock.restoreAll();
  });

  it("should forward FastAPI detail error messages", async () => {
    mockPrismaClient.product.findMany = async () => [];
    
    const fastapiError = new AxiosError("Bad Request");
    fastapiError.response = {
      status: 422,
      data: { detail: "Validation Error from FastAPI" },
    } as any;
    
    mock.method(aiClient, "post", async () => {
      throw fastapiError;
    });

    const payload = { preferences: {} };
    
    await assert.rejects(
      async () => {
        await proxyRecommend(payload);
      },
      (err: any) => {
        return err instanceof ApiError && err.statusCode === 422 && err.message === "Validation Error from FastAPI";
      }
    );

    mock.restoreAll();
  });
});
