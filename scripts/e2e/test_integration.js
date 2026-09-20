const fs = require('fs');
const path = require('path');

const API_BASE = "http://localhost:4000/api";
const FASTAPI_BASE = "http://localhost:8000";

async function runTests() {
  console.log("1. Testing FastAPI Health...");
  const healthRes = await fetch(`${FASTAPI_BASE}/health`);
  const healthData = await healthRes.json();
  console.log("FastAPI Health:", healthData);

  console.log("\n2. Getting Auth Token...");
  const user = {
    email: `test_${Date.now()}@example.com`,
    password: "password123",
    name: "Test User"
  };
  
  // Register
  await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  });

  // Login
  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: user.email, password: user.password })
  });
  const loginData = await loginRes.json();
  const token = loginData.data?.token;
  if (!token) throw new Error("Failed to get token");

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };

  const chatMessages = [
    "I need a modern sofa.",
    "My budget is Rs. 150,000.",
    "Which one would you choose?",
    "Tell me more about that one.",
    "How do I fix a Ford engine?"
  ];

  let history = [];

  console.log("\n3. Testing Express Chat (Multi-turn)...");
  for (let i = 0; i < chatMessages.length; i++) {
    const msg = chatMessages[i];
    console.log(`\n--- Message ${i+1}: "${msg}" ---`);
    
    const chatRes = await fetch(`${API_BASE}/ai/chat`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        message: msg,
        history: history
      })
    });
    const chatData = await chatRes.json();
    console.log("Status:", chatRes.status);
    console.log("Response:", chatData.data?.reply);
    
    // Update history
    history.push({ role: "user", content: msg });
    history.push({ role: "assistant", content: chatData.data?.reply || "" });
  }

  // Regression tests
  console.log("\n4. Testing Visual Recommendation (Regression)...");
  const formData = new FormData();
  // using a dummy text file to act as an image, or create an empty buffer if we need a valid image.
  // Actually, visual-recommend expects a valid image. The test_express_ai.ts uses evaluation/images/01_living_sofa.jpg
  try {
      const buffer = fs.readFileSync(path.join(__dirname, 'evaluation', 'images', '01_living_sofa.jpg'));
      const blob = new Blob([buffer], { type: 'image/jpeg' });
      formData.append('image', blob, '01_living_sofa.jpg');
      
      const visRes = await fetch(`${API_BASE}/ai/visual-recommend`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });
      console.log("Visual Recommend Status:", visRes.status);
      const visData = await visRes.json();
      console.log("Visual Recommend Response:", visData.success ? "SUCCESS" : "FAIL");
  } catch (e) {
      console.log("Could not run visual-recommend because image not found or error:", e.message);
  }

  console.log("\n5. Testing Placement (Regression)...");
  try {
      const pFormData = new FormData();
      const buffer = fs.readFileSync(path.join(__dirname, 'evaluation', 'images', '01_living_sofa.jpg'));
      const blob = new Blob([buffer], { type: 'image/jpeg' });
      pFormData.append('image', blob, '01_living_sofa.jpg');
      pFormData.append('productId', 'cmqk2ymnh0001uddwwmngst65'); // Need a real product ID ideally, we will use a dummy one and expect 404 or 500 if invalid. Wait, I can fetch products first.
      
      const prodRes = await fetch(`${API_BASE}/products`);
      const prodData = await prodRes.json();
      const firstProdId = prodData.data?.[0]?.productId || "unknown";
      
      pFormData.set('productId', firstProdId);
      
      const placeRes = await fetch(`${API_BASE}/ai/placement`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: pFormData
      });
      console.log("Placement Status:", placeRes.status);
      const placeData = await placeRes.json();
      console.log("Placement Response:", placeData.success ? "SUCCESS" : "FAIL");
  } catch (e) {
      console.log("Could not run placement because image not found or error:", e.message);
  }
}

runTests().catch(console.error);
