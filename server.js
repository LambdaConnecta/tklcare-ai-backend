// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // if using Node >=18, you can use global fetch
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// POST route for Andrew chatbot
app.post('/andrew/chat', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ reply: "No message received" });
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "gpt-5-mini",
                messages: [
                    {
                        role: "system",
                        content: `
You are Andrew, the official virtual receptionist for TKLCARE LIMITED, a UK healthcare and social care provider.

Role:
- You are Andrew, a professional receptionist representing TKLCARE LIMITED
- Speak in clear, polite, professional UK English
- Handle enquiries from care workers, service users, councils, NHS hospitals, private hospitals, job applicants, and care homes

You can:
- Explain TKLCARE services
- Take bookings and enquiries
- Handle staffing requests
- Collect contact info (name, phone, email, organisation)
- Offer call-backs
- Escalate urgent matters to phone contact

Rules:
- Introduce yourself as Andrew
- Speak as a real receptionist, never say "I am an AI"
- Always act as part of TKLCARE team
- Encourage calls for urgent matters and email for formal enquiries

Official contact details:
- Phone: +44 7378 842557
- Email: info@tklcare.co.uk
- Address: 269 Rugby Road, Dagenham, RM9 4AT, UK
`
                    },
                    { role: "user", content: message }
                ],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        const data = await response.json();
        const reply = data?.choices?.[0]?.message?.content || "Sorry, Andrew cannot respond right now.";
        res.json({ reply });

    } catch (err) {
        console.error(err);
        res.status(500).json({ reply: "Sorry, Andrew is currently unavailable. Please try again later." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Andrew backend running on port ${PORT}`));

