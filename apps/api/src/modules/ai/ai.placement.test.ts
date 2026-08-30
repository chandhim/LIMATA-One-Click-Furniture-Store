import { describe, it, mock } from "node:test";
import assert from "node:assert";

// Mock Prisma by setting global.__prisma before importing
const mockPrismaClient = {
  product: {
    findUnique: async () => null,
  },
};
(global as any).__prisma = mockPrismaClient;

import { proxyPlacement } from "./ai.service";
import { aiClient } from "@/lib/ai-client";
import { ApiError } from "@/shared/errors/api-error";

describe("Express AI Placement Integration", () => {
  it("should return 404 if product is missing", async () => {
    // Override prisma mock for this test
    mockPrismaClient.product.findUnique = async () => null;

    const mockFile = {
      buffer: Buffer.from("mock image"),
      originalname: "test.jpg",
      mimetype: "image/jpeg",
    } as Express.Multer.File;

    try {
      await proxyPlacement("missing-id", mockFile);
      assert.fail("Should have thrown 404 ApiError");
    } catch (e: any) {
      assert.strictEqual(e instanceof ApiError, true);
      assert.strictEqual(e.statusCode, 404);
    }
  });

  it("should construct FormData with normalized fallback dimensions and proxy to FastAPI", async () => {
    // Mock the product service
    mockPrismaClient.product.findUnique = async () => ({
      productId: "prod-1",
      category: "Sofa",
    }) as any;

    // Mock the AI client to return a mock response
    const mockPost = mock.method(aiClient, "post", async (url: string, formData: unknown, config?: import("axios").AxiosRequestConfig) => {
      assert.strictEqual(url, "/placement");
      assert.strictEqual(config?.headers?.["Content-Type"], "multipart/form-data");
      
      return {
        data: {
          suitable: true,
          warnings: ["DIMENSIONS_UNAVAILABLE: Real dimensions were not provided. Using normalized dimensions. Results are heuristic and not metric-accurate."]
        }
      };
    });

    const mockFile = {
      buffer: Buffer.from("mock image"),
      originalname: "test.jpg",
      mimetype: "image/jpeg",
    } as Express.Multer.File;

    const result = await proxyPlacement("prod-1", mockFile);

    assert.strictEqual(result.suitable, true);
    assert.strictEqual(
      result.warnings.includes("DIMENSIONS_UNAVAILABLE: Real dimensions were not provided. Using normalized dimensions. Results are heuristic and not metric-accurate."),
      true
    );

    mock.restoreAll();
  });
});
