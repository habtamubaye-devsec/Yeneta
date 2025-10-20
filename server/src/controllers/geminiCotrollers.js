import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY, // Make sure your API key is in .env
});

export const askAssistant = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) return res.status(400).json({ message: "Prompt is required" });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      maxOutputTokens: 20,
    });

    res.json({ answer: response.text });
  } catch (error) {
    console.error("Gemini AI error:", error);
    res.status(500).json({ message: "Failed to get response from Gemini AI" });
  }
};
