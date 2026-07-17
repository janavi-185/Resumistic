import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function analyzeResume(resumeText: string, jdText?: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
      Analyze the following resume and provide a detailed assessment.
      ${jdText ? `Also, evaluate how well this resume matches the following Job Description (JD):\nJob Description:\n${jdText}\n` : ''}

      Resume Text:
      ${resumeText}

      Please provide:
      1. Overall summary of the candidate's profile${jdText ? ' and their fit for the JD' : ''}
      2. Key strengths and skills
      3. Areas for improvement${jdText ? ' to better match the JD' : ''}
      4. Suggestions for enhancing the resume
      5. A rating out of 10 for the resume quality${jdText ? ' and fit for the role' : ''}

      Format your response as a structured JSON object with the following keys:
      - summary: string
      - strengths: string[]
      - improvements: string[]
      - suggestions: string[]
      - rating: number
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const cleanText = text.replace(/```json\n?|\n?```/gi, '').trim();
      const parsed = JSON.parse(cleanText);
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

export async function roastResume(resumeText: string, jdText?: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
      You are a brutally honest, sarcastic, and funny tech recruiter. 
      Roast the following resume. Don't hold back, but keep it professional enough to not be offensive (no swearing).
      Point out clichés, bad formatting choices, weak bullet points, and funny exaggerations.
      ${jdText ? `Also roast them on how badly they fit this Job Description:\nJob Description:\n${jdText}\n` : ''}

      Resume Text:
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

export async function getATSScore(resumeText: string, jdText?: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
      You are an strict ATS (Applicant Tracking System).
      Calculate an ATS compatibility score (0-100) for the following resume.
      ${jdText ? `Compare the resume specifically against this Job Description:\nJob Description:\n${jdText}\n` : 'Evaluate the resume based on general industry standards, keyword optimization, and formatting clarity.'}

      Resume Text:
      ${resumeText}

      Format your response as a structured JSON object with the following keys:
      - atsScore: number (0-100)
      - feedback: string (A concise explanation of the score and what the ATS found or missed)
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const cleanText = text.replace(/```json\n?|\n?```/gi, '').trim();
      const parsed = JSON.parse(cleanText);
      
      return {
        atsScore: typeof parsed.atsScore === 'number' ? parsed.atsScore : parseInt(parsed.atsScore) || 0,
        feedback: parsed.feedback || "",
      };
    } catch {
      return {
        atsScore: 0,
        feedback: "Failed to parse ATS score. Resume format might be completely unreadable to an ATS.",
      };
    }
  } catch (error) {
    console.error("Error calculating ATS score with Gemini:", error);
    throw new Error("Failed to calculate ATS score");
  }
}
