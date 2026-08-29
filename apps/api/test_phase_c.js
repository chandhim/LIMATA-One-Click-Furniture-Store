const axios = require('axios');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: './apps/api/.env' });

const prisma = new PrismaClient();
const API_URL = 'http://localhost:4000/api';
const JWT_SECRET = process.env.JWT_SECRET || 'limata_super_secret_2026_secure_key'; // Default from .env

function makeToken(userId, role = 'CUSTOMER') {
  return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '30d' });
}

async function runTests() {
  console.log('==================================================');
  console.log('1. REGISTERED USER TEST');
  console.log('==================================================');

  // Create a test user
  const userA = await prisma.user.create({
    data: {
      name: 'Test User A',
      email: `testA_${Date.now()}@example.com`,
      password: 'password123',
    }
  });

  const tokenA = makeToken(userA.userId);
  let conversationId = null;

  try {
    const resA = await axios.post(`${API_URL}/ai/chat`, {
      message: "I need a modern sofa under Rs. 150,000."
    }, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });

    console.log('[Registered User Test] Response Status:', resA.status);
    console.log('[Registered User Test] conversationId returned:', resA.data.data.conversationId);
    
    conversationId = resA.data.data.conversationId;
    
    const dbConv = await prisma.aiConversation.findUnique({
      where: { aiConversationId: conversationId },
      include: { messages: true }
    });
    
    console.log('[Registered User Test] AiConversation exists in DB:', !!dbConv);
    console.log('[Registered User Test] Messages count:', dbConv?.messages?.length);
    console.log('[Registered User Test] Has USER message:', dbConv?.messages?.some(m => m.role === 'USER'));
    console.log('[Registered User Test] Has ASSISTANT message:', dbConv?.messages?.some(m => m.role === 'ASSISTANT'));

  } catch(e) {
    console.error('Test 1 Failed:', e.response?.data || e.message);
  }

  console.log('\n==================================================');
  console.log('2. MULTI-TURN + PERSISTENCE');
  console.log('==================================================');
  try {
    const resB = await axios.post(`${API_URL}/ai/chat`, {
      message: "I prefer something comfortable for a modern living room.",
      conversationId: conversationId
    }, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });

    const dbConvTurn2 = await prisma.aiConversation.findUnique({
      where: { aiConversationId: conversationId },
      include: { messages: { orderBy: { createdAt: 'asc' } } }
    });
    console.log('[Multi-turn] Total messages after 2 turns:', dbConvTurn2.messages.length); // Should be 4
  } catch(e) {
    console.error('Test 2 Failed:', e.response?.data || e.message);
  }

  console.log('\n==================================================');
  console.log('3. CONVERSATION APIs');
  console.log('==================================================');
  try {
    const resC = await axios.get(`${API_URL}/ai/chat/conversations`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    console.log('[Conversations API] GET /conversations count:', resC.data.data.conversations.length);

    const resD = await axios.get(`${API_URL}/ai/chat/conversations/${conversationId}`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    console.log('[Conversations API] GET /conversations/:id status:', resD.status);
  } catch(e) {
    console.error('Test 3 Failed:', e.response?.data || e.message);
  }

  console.log('\n==================================================');
  console.log('4. GUEST TEST');
  console.log('==================================================');
  try {
    const initialConvCount = await prisma.aiConversation.count();
    const resGuest = await axios.post(`${API_URL}/ai/chat`, {
      message: "I need a small wooden table."
    });
    const finalConvCount = await prisma.aiConversation.count();
    console.log('[Guest Test] Response Status:', resGuest.status);
    console.log('[Guest Test] conversationId returned:', resGuest.data.data.conversationId || 'NONE');
    console.log('[Guest Test] DB Conversations created:', finalConvCount - initialConvCount);
  } catch(e) {
    console.error('Test 4 Failed:', e.response?.data || e.message);
  }

  console.log('\n==================================================');
  console.log('5. INVALID JWT');
  console.log('==================================================');
  try {
    await axios.post(`${API_URL}/ai/chat`, { message: "Test" }, {
      headers: { Authorization: 'Bearer invalid-token' }
    });
    console.log('[Invalid JWT] ERROR: Request succeeded when it should have failed!');
  } catch(e) {
    console.log('[Invalid JWT] Response Status:', e.response?.status); // Should be 401
  }

  console.log('\n==================================================');
  console.log('6. OWNERSHIP SECURITY');
  console.log('==================================================');
  const userB = await prisma.user.create({
    data: { name: 'Test User B', email: `testB_${Date.now()}@example.com`, password: 'password123' }
  });
  const tokenB = makeToken(userB.userId);
  try {
    await axios.get(`${API_URL}/ai/chat/conversations/${conversationId}`, {
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    console.log('[Ownership] ERROR: User B successfully accessed User A conversation!');
  } catch(e) {
    console.log('[Ownership] GET Response Status for User B:', e.response?.status); // Should be 404
  }

  console.log('\n==================================================');
  console.log('7. REGRESSION (GET /health)');
  console.log('==================================================');
  try {
    const resHealth = await axios.get(`${API_URL}/ai/health`);
    console.log('[Health] Response Status:', resHealth.status);
  } catch(e) {
    console.error('Test 7 Failed:', e.response?.data || e.message);
  }

  // Cleanup
  await prisma.user.delete({ where: { userId: userA.userId } });
  await prisma.user.delete({ where: { userId: userB.userId } });
  
  process.exit(0);
}

runTests();
