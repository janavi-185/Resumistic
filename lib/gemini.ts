import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Analyzes a resume using Google's Gemini AI
 * @param resumeText - The extracted text from the resume
 * @returns Analysis results from Gemini
 */
export async function analyzeResume(resumeText: string) {
  try {
    // Get the generative model (using gemini-1.5-flash as gemini-pro is deprecated)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Create a prompt for resume analysis
    const prompt = `
      Analyze the following resume and provide a detailed assessment:

      ${resumeText}

      Please provide:
      1. Overall summary of the candidate's profile
      2. Key strengths and skills
      3. Areas for improvement
      4. Suggestions for enhancing the resume
      5. A rating out of 10 for the resume quality

      Format your response as a structured JSON object with the following keys:
      - summary: string
      - strengths: string[]
      - improvements: string[]
      - suggestions: string[]
      - rating: number
    `;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse as JSON, fallback to raw text if parsing fails
    try {
      // Remove potential markdown formatting (```json ... ```)
      const cleanText = text.replace(/```json\n?|\n?```/gi, '').trim();
      const parsed = JSON.parse(cleanText);
      
      // Enforce the schema types to prevent frontend mapping errors
      return {
        summary: parsed.summary || "",
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
        suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
        rating: typeof parsed.rating === 'number' ? parsed.rating : parseInt(parsed.rating) || 0,
      };
    } catch {
      return {
        summary: text,
        strengths: [],
        improvements: [],
        suggestions: [],
        rating: 0,
      };
    }
  } catch (error) {
    console.error("Error analyzing resume with Gemini:", error);
    throw new Error("Failed to analyze resume");
  }
}

/**
 * Roasts a resume using Google's Gemini AI
 * @param resumeText - The extracted text from the resume
 * @returns Roast results from Gemini
 */
export async function roastResume(resumeText: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are a brutally honest, sarcastic, and funny tech recruiter. 
      Roast the following resume. Don't hold back, but keep it professional enough to not be offensive (no swearing).
      Point out clichés, bad formatting choices, weak bullet points, and funny exaggerations.

      ${resumeText}

      Format your response as a structured JSON object with the following keys:
      - roast: string (The main brutal roast paragraph)
      - redFlags: string[] (Bullet points of funny/brutal observations)
      - harshTruth: string (One sentence harsh truth summary)
      - score: number (A brutally low score out of 10)
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const cleanText = text.replace(/```json\n?|\n?```/gi, '').trim();
      const parsed = JSON.parse(cleanText);
      
      return {
        roast: parsed.roast || "",
        redFlags: Array.isArray(parsed.redFlags) ? parsed.redFlags : [],
        harshTruth: parsed.harshTruth || "",
        score: typeof parsed.score === 'number' ? parsed.score : parseInt(parsed.score) || 0,
      };
    } catch {
      return {
        roast: text,
        redFlags: [],
        harshTruth: "You couldn't even format your resume well enough for me to roast it properly.",
        score: 0,
      };
    }
  } catch (error) {
    console.error("Error roasting resume with Gemini:", error);
    throw new Error("Failed to roast resume");
  }
}
