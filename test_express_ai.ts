import { proxyVisualRecommendation } from './apps/api/src/modules/ai/ai.service';
import fs from 'fs';

async function test() {
  const buffer = fs.readFileSync('evaluation/images/01_living_sofa.jpg');
  const file = {
    buffer,
    mimetype: 'image/jpeg',
    originalname: '01_living_sofa.jpg',
  } as any;
  try {
    const res = await proxyVisualRecommendation(file);
    console.log(res);
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
