import express from "express";
import OpenAI from "openai";

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/chat", async (req, res) => {
    try {
        const { message, conversation, userInfo } = req.body;

        const systemPrompt = `
You are Andrew, the official virtual receptionist for TKLCARE LIMITED, a UK healthcare and social care provider.
You are polite, professional, and speak clear UK English.
You assist care workers, service users, councils, NHS/private hospitals, and job applicants.
You can handle bookings, staffing requests, enquiries, and collect user details.
Always act as a real receptionist, never mention AI.
Official contact: Phone: +44 7378 842557, Email: info@tklcare.co.uk
`;

        const messages = [
            {
