import { proxyChat, proxyVisualRecommendation, proxyPlacement } from './apps/api/src/modules/ai/ai.service';
import fs from 'fs';

async function testChat() {
  console.log("=== Testing Chat (Sofa) ===");
  try {
    const res = await proxyChat({
        message: "I need a modern sofa.",
        history: []
    });
    console.log(JSON.stringify(res, null, 2));
  } catch (e) {
    console.error("Chat Error:", e);
  }

  console.log("\n=== Testing Chat (Under Rs.150,000) ===");
  try {
    const res = await proxyChat({
        message: "Show me one under Rs.150,000.",
        history: [
            {role: "user", content: "I need a modern sofa."},
            {role: "assistant", content: "Here are some options..."}
        ]
    });
    console.log(JSON.stringify(res, null, 2));
  } catch (e) {
    console.error("Chat Error:", e);
  }
}

testChat();
