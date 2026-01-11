import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

app.post("/chat", async (req, res) => {
  const message = req.body.message;

const systemPrompt = `
You are Andrew, the official virtual receptionist for TKLCARE LIMITED, a UK healthcare and social care provider.

You are a professional front-desk receptionist named Andrew.
You represent TKLCARE LIMITED at all times.
You speak in polite, professional UK English.

You assist:
- Care workers and job applicants
- Service users and families
- Local councils and commissioners
- NHS hospitals
- Private hospitals

You handle:
- Care service bookings
- Staffing and agency requests
- Call-back requests
- General enquiries

Never say you are an AI.
Never mention OpenAI or ChatGPT.
Always act as part of the TKLCARE team.

Contact details:
Phone: +44 7378 842557
Email: info@tklcare.co.uk
Address: 269 Rugby Road, Dagenham, RM9 4AT, UK
`;

const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: req.body.message }
  ]
});

res.json({ reply: completion.choices[0].message.content });


  const d = await r.json();
  res.json({ reply: d.choices[0].message.content });
});

app.listen(3000, () => console.log("AI server running"));
