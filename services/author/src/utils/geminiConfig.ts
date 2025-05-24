import { GoogleGenAI } from "@google/genai";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const geminiConfig = new GoogleGenAI({
                  apiKey: process.env.GEMINI_API_KEY
            })
export const oldGeminiConfig = new GoogleGenerativeAI(process.env.Gemini_Api_Key as string);