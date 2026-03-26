import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Layer 2: Secondary Response Layer (AI Integration using Gemini)
 * Routes generic or complex queries to Gemini with full user context.
 */

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const getAIResponse = async (query, farmerData) => {
  if (!API_KEY || API_KEY === 'your_gemini_api_key_here') {
    throw new Error("Gemini API Key missing or invalid.");
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `
      You are an expert AI agricultural assistant for "KrishiManas", a mental health and financial support platform for farmers.
      Your primary goal is to provide concise, context-aware, and actionable suggestions.
      
      USER CONTEXT:
      - Name: ${farmerData.name}
      - Taluk: ${farmerData.taluk}
      - Crop: ${farmerData.crop}
      - Distress Score: ${farmerData.score} (Higher is more critical)
      - Loan Overdue: ${farmerData.loanDaysOverdue} days
      - Assigned Mitra: ${farmerData.assignedMitraName || 'None'}
      
      GUIDELINES:
      - Keep responses VERY short (max 3 sentences).
      - Be empathetic but professional.
      - If the user is in distress (Score > 65), encourage them to use the SOS button or talk to their Mitra.
      - Provide specific advice related to their crop (${farmerData.crop}) or location (${farmerData.taluk}) when relevant.
      - Avoid generic statements. Provide actionable steps.
    `;

    const result = await model.generateContent([systemPrompt, query]);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw error; // Handled by Fallback Layer
  }
};
