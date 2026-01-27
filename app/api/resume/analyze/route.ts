import { NextResponse } from "next/server";
import { extractTextFromPDF } from "@/lib/resumeParser";
import { analyzeResume } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Resume file is required" },
        { status: 400 }
      );
    }

    const resumeText = await extractTextFromPDF(file);
    const analysis = await analyzeResume(resumeText);

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Resume analysis failed" },
      { status: 500 }
    );
  }
}
