import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";
import PDFParser from "pdf2json";

export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    // Generate unique filename for temporary storage
    const os = await import("os");
    const path = await import("path");
    const fileName = uuidv4();
    const tempFilePath = path.join(os.tmpdir(), `${fileName}.pdf`);

    // Convert File to Buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Write to temporary file (pdf2json requires file path)
    await fs.writeFile(tempFilePath, fileBuffer);

    // Initialize PDF parser
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfParser = new (PDFParser as any)(null, 1);

    // Parse PDF and extract text
    const parsedText = await new Promise<string>((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pdfParser.on("pdfParser_dataError", (errData: any) => {
        console.error("PDF Parser Error:", errData.parserError);
        reject(new Error(errData.parserError));
      });

      pdfParser.on("pdfParser_dataReady", () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const text = (pdfParser as any).getRawTextContent();
        resolve(text);
      });

      pdfParser.loadPDF(tempFilePath);
    });

    // Clean up temporary file
    try {
      await fs.unlink(tempFilePath);
    } catch (unlinkError) {
      console.warn("Failed to delete temporary file:", unlinkError);
    }

    return parsedText;
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw new Error("Failed to extract text from PDF");
  }
}
