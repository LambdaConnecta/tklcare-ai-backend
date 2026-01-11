import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

app.post("/chat", async (req, res) => {
  const message = req.body.message;

  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a polite UK care receptionist for TKLCARE LIMITED." },
        { role: "user", content: message }
      ]
    })
  });

  const d = await r.json();
  res.json({ reply: d.choices[0].message.content });
});

app.listen(3000, () => console.log("AI server running"));
