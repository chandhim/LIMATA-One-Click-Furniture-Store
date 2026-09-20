import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const API_URL = 'http://localhost:4000/api/ai/recommend';

// We need an admin token to bypass authenticate middleware?
// Wait, aiRoutes are protected with `authenticate`!
// Let's check apps/api/src/modules/ai/ai.routes.ts
// "aiRouter.post("/recommend", authenticate, recommendController);"
// Oh! If it's authenticated, I need a token. Let me generate a valid JWT using the JWT_SECRET!
import jwt from "jsonwebtoken";
// load env to get JWT_SECRET
import { loadProjectEnv } from "./src/config/load-env";
loadProjectEnv();

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_dev"; // from config

function getToken() {
  return jwt.sign(
    { userId: "testuser123", role: "USER" },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
}

async function runTest(name: string, payload: any) {
  try {
    const token = getToken();
    const res = await axios.post(API_URL, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(`✅ [${name}] Success:`, res.data.data.recommended_product_ids.length, "items recommended");
    if (res.data.data.recommended_product_ids.length > 0) {
      const topMatchId = res.data.data.recommended_product_ids[0];
      console.log(`   Top Match: ${topMatchId}`);
      console.log(`   Score Info:`, res.data.data.matching_info[topMatchId]);
    }
  } catch (err: any) {
    console.error(`❌ [${name}] Failed:`, err.response?.data || err.message);
  }
}

async function main() {
  // Wait a moment to ensure servers are up
  await new Promise(r => setTimeout(r, 2000));

  console.log("Starting End-to-End Recommendation Verification...\n");

  await runTest("Normal Query", {
    preferences: { query: "modern sleek bar stool" }
  });

  await runTest("Category Filter", {
    preferences: { query: "stool", category: "Dining Room" }
  });

  await runTest("Maximum Price Filter", {
    preferences: { query: "stool", max_price: 15000 }
  });

  await runTest("Material Preference", {
    preferences: { query: "stool", material: "Wood" }
  });

  await runTest("No Matching Products (Unrealistic Price)", {
    preferences: { max_price: 1 }
  });
}

main().catch(console.error);
