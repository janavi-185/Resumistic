import { NextResponse } from "next/server";
import { extractTextFromPDF } from "@/lib/resumeParser";
import { analyzeResume, roastResume, getATSScore } from "@/lib/gemini";
import { auth } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("resume") as File | null;
    const jdText = formData.get("jdText") as string || "";
    const mode = formData.get("mode") as string || "full"; // "ats", "full", "roast"

    if (!file) {
      return NextResponse.json(
        { error: "Resume file is required" },
        { status: 400 }
      );
    }

    const resumeText = await extractTextFromPDF(file);
    let analysis;
    let analysisType;

    if (mode === "ats") {
      analysis = await getATSScore(resumeText, jdText);
      analysisType = "ats";
    } else if (mode === "roast") {
      analysis = await roastResume(resumeText, jdText);
      analysisType = "roast";
    } else {
      analysis = await analyzeResume(resumeText, jdText);
      analysisType = "full";
    }

    // Save to history
    const { data: insertedAnalysis, error: dbError } = await supabase
      .from("resume_analyses")
      .insert({
        user_id: session.user.id,
        title: file.name,
        analysis_type: analysisType,
        result: analysis
      })
      .select('id')
      .single();

    if (dbError) {
      console.error("Failed to save analysis to history:", dbError);
      // We don't throw here, just log, so user still gets analysis back
    }

    return NextResponse.json({
      success: true,
      analysis,
      id: insertedAnalysis?.id
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Resume analysis failed" },
      { status: 500 }
    );
  }
}
