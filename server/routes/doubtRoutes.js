import express from 'express';
import Doubt from '../models/Doubt.js';

const router = express.Router();

// Get trending doubts
router.get('/trending', async (req, res) => {
  try {
    const doubts = await Doubt.find().sort({ likes: -1 }).limit(10);
    res.json(doubts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

import { GoogleGenAI } from '@google/genai';

// Initialize Gemini API if key is present
const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

// Create a new doubt
router.post('/', async (req, res) => {
  try {
    const newDoubt = new Doubt(req.body);
    await newDoubt.save();
    res.status(201).json(newDoubt);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// AI Solve Endpoint
router.post('/solve', async (req, res) => {
  try {
    const { text, imageBase64 } = req.body;
    
    const apiKey = process.env.GEMINI_API_KEY;
    const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;
    
    if (!ai) {
      // Simulate AI response if no key is provided
      setTimeout(() => {
        res.json({ 
          solution: `**Simulated AI Response**\n\nI received your query: "${text || 'Image only'}"\n\nTo get real AI answers, please add \`GEMINI_API_KEY\` to the server's \`.env\` file.\n\n### Steps to Solve (Mock)\n1. Read the question carefully.\n2. Apply the relevant formula.\n3. Calculate the final result.` 
        });
      }, 2000);
      return;
    }

    // Prepare content for Gemini API
    const contents = [];
    if (imageBase64) {
      // Remove data URL prefix if present (e.g., "data:image/png;base64,")
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      contents.push({
        inlineData: {
          data: base64Data,
          mimeType: imageBase64.match(/data:(.*?);base64/)?.[1] || "image/jpeg"
        }
      });
    }
    
    if (text) {
      contents.push(text);
    } else {
      contents.push("Please solve the question in this image step-by-step.");
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: "You are a helpful and expert teacher. Provide clear, step-by-step solutions to students' doubts. If an image contains a math or science problem, solve it completely.",
      }
    });

    res.json({ solution: response.text });
  } catch (error) {
    console.error('AI API Error:', error);
    res.status(500).json({ message: 'Failed to generate solution', error: error.message });
  }
});

export default router;
