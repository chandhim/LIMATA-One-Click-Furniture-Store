import { mock } from "node:test";
import { aiClient } from "@/lib/ai-client";
import * as productService from "@/modules/products/product.service";

console.log("aiClient.post type:", typeof aiClient.post);
console.log("productService.getProducts type:", typeof productService.getProducts);

try {
  mock.method(aiClient, "post", async () => ({ data: "mock" }));
  console.log("Mocked aiClient.post successfully");
} catch (e: any) {
  console.error("Failed to mock aiClient:", e.message);
}

try {
  mock.method(productService, "getProducts", async () => []);
  console.log("Mocked productService.getProducts successfully");
} catch (e: any) {
  console.error("Failed to mock productService:", e.message);
}
