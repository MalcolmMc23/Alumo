import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SYSTEM_PROMPT = `You are an experienced career coach and guidance counselor with expertise in resume analysis, career planning, and professional development. Your role is to:

1. Analyze resumes and provide detailed feedback on:
   - Content and formatting
   - Areas for improvement
   - Skills alignment with career goals
   - Industry-specific recommendations
2. Offer career guidance by:
   - Suggesting career paths based on skills and experience
   - Providing interview preparation advice
   - Recommending skill development opportunities
3. Answer questions about:
   - Career transitions
   - Professional development
   - Job search strategies
   - Industry trends

Be supportive, professional, and provide actionable advice.`;

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, resumeContent } = req.body;

    const chatMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...(resumeContent ? [{ role: "user", content: `Context - Resume content:\n${resumeContent}` }] : []),
      ...messages
    ];

    const completion = await openai.chat.completions.create({
      messages: chatMessages,
      model: "gpt-3.5-turbo",
    });

    res.json({ 
      message: completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response."
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: "An error occurred while processing your request." 
    });
  }
});

app.post('/api/analyze-resume', async (req, res) => {
  try {
    const { content } = req.body;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Please analyze this resume and provide detailed feedback:\n\n${content}` }
      ],
      model: "gpt-3.5-turbo",
    });

    res.json({ 
      message: completion.choices[0]?.message?.content || "I apologize, but I couldn't analyze the resume."
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: "An error occurred while analyzing the resume." 
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});