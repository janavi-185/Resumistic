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
      return JSON.parse(text);
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
