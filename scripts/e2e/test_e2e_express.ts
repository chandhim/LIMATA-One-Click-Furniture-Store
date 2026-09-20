import jwt from 'jsonwebtoken';
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';

async function runTest() {
    const secret = "limata_super_secret_2026_secure_key";
    const token = jwt.sign({ id: "test", role: "USER" }, secret, { expiresIn: "30d" });

    const form = new FormData();
    form.append('image', fs.createReadStream('../../evaluation/images/01_living_sofa.jpg'));

    try {
        const res = await axios.post('http://localhost:4000/api/ai/visual-recommend', form, {
            headers: {
                'Authorization': `Bearer ${token}`,
                ...form.getHeaders()
            }
        });
        console.log("Status:", res.status);
        console.log("Response:", res.data);
    } catch (e: any) {
        console.error("Error:", e.response ? e.response.data : e.message);
    }
}
runTest();
