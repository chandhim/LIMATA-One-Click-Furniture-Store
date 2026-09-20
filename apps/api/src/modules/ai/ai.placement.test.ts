import { describe, it, mock, afterEach } from "node:test";
import assert from "node:assert";

// Mock Prisma by setting global.__prisma before importing
const mockPrismaClient = {
  product: {
    findUnique: async () => null,
    findMany: async (): Promise<import("@prisma/client").Product[]> => [],
  },
};
(global as any).__prisma = mockPrismaClient;

import { proxyPlacement } from "./ai.service";
import { aiClient } from "@/lib/ai-client";
import { ApiError } from "@/shared/errors/api-error";

describe("Express AI Placement Integration", () => {
  afterEach(() => {
    mock.restoreAll();
  });

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

  it("should send null (not a fabricated 1.0 fallback) for missing dimensions, and forward the response", async () => {
    // Mock the product service — this product has no recorded dimensions.
    mockPrismaClient.product.findUnique = async () => ({
      productId: "prod-1",
      category: "Sofa",
      width: null,
      depth: null,
      height: null,
    }) as any;
    mockPrismaClient.product.findMany = async () => [];

    // Mock the AI client to return a mock response
    const mockPost = mock.method(aiClient, "post", async (url: string, formData: unknown) => {
      assert.strictEqual(url, "/placement");

      const sentMetadata = JSON.parse((formData as FormData).get("furniture_metadata") as string);
      assert.strictEqual(sentMetadata.width, null);
      assert.strictEqual(sentMetadata.depth, null);
      assert.strictEqual(sentMetadata.height, null);

      const sentCandidates = JSON.parse((formData as FormData).get("available_products") as string);
      assert.strictEqual(Array.isArray(sentCandidates), true);

      return {
        data: {
          suitable: true,
          warnings: ["DIMENSIONS_UNAVAILABLE: This product's width/depth are not recorded, so furniture-fit could not be checked against the estimated space."],
          dimensional_fit: "DIMENSIONS_UNAVAILABLE",
          movement_space: "MOVEMENT_SPACE_OK",
          alternative_recommendations: [],
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
    assert.strictEqual(result.dimensional_fit, "DIMENSIONS_UNAVAILABLE");
    assert.strictEqual(
      result.warnings.includes("DIMENSIONS_UNAVAILABLE: This product's width/depth are not recorded, so furniture-fit could not be checked against the estimated space."),
      true
    );
    assert.strictEqual(mockPost.mock.callCount(), 1);
  });

  it("should re-hydrate alternative_recommendations with full product details from the catalog", async () => {
    mockPrismaClient.product.findUnique = async () => ({
      productId: "prod-1",
      category: "Living Room",
      width: 220,
      depth: 90,
      height: 85,
    }) as any;

    const candidateProduct = {
      productId: "prod-2",
      name: "Compact Sofa",
      price: 25000,
      category: "Living Room",
      images: ["/images/compact-sofa.png"],
      stock: 3,
      description: "A smaller sofa",
      material: "Fabric",
      width: 140,
      depth: 90,
      height: 85,
    };
    mockPrismaClient.product.findMany = async () => [candidateProduct] as any;

    mock.method(aiClient, "post", async () => ({
      data: {
        suitable: false,
        warnings: [],
        dimensional_fit: "DOES_NOT_FIT_WIDTH",
        movement_space: "MOVEMENT_SPACE_OK",
        alternative_recommendations: [
          { productId: "prod-2", reason: "Estimated to fit.", orientation: "0°", footprint_cm2: 12600 },
        ],
      },
    }));

    const mockFile = {
      buffer: Buffer.from("mock image"),
      originalname: "test.jpg",
      mimetype: "image/jpeg",
    } as Express.Multer.File;

    const result = await proxyPlacement("prod-1", mockFile);

    assert.strictEqual(result.alternative_recommendations.length, 1);
    assert.strictEqual(result.alternative_recommendations[0].productId, "prod-2");
    assert.strictEqual(result.alternative_recommendations[0].product.name, "Compact Sofa");
    assert.strictEqual(result.alternative_recommendations[0].product.price, 25000);
  });
});
