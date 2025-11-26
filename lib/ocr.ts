import { createWorker } from "tesseract.js";
import fs from "fs";
import path from "path";

/**
 * Fetches image buffer from a URL or reads it from a local file path.
 * @param src The URL or local path to the image.
 * @returns A Buffer containing the image data.
 */
async function bufferFromUrlOrPath(src: string): Promise<Buffer> {
 if (src.startsWith("http")) {

 const res = await fetch(src);
 if (!res.ok) throw new Error(`Failed to fetch image from URL: ${src}`);
 return Buffer.from(await res.arrayBuffer());
 }
 // Read from local file system
 return fs.readFileSync(path.resolve(src));
}

/**
 * Executes OCR on an image source (URL or local path) and returns the extracted text.
 * @param src The source of the image.
 * @returns The recognized text from the image.
 */
export async function runOcrOnImage(src: string): Promise<string> {
 // Logger setup: In tesseract.js v5+, logging is often attached to the worker during creation.
 // We'll create the worker, but for detailed progress, you would attach an event listener to the job object.
 const worker = await createWorker("eng");

 // Reinitialize is typically only needed if you change languages, but including it is safe.
 await worker.reinitialize("eng");

 const buffer = await bufferFromUrlOrPath(src);

 // FIX: Removed the unsupported 'logger' property from the recognize options object.
 const { data } = await worker.recognize(buffer);

 await worker.terminate();
 return data.text;
}

/**
 * Parses a candidate ID (6-12 digits) and a potential name (Title Case sequence) from text.
 * @param text The OCR output text.
 * @returns An object containing the cleaned text, candidate ID, and candidate Name.
 */
export function parseIdAndNameFromText(text: string): { text: string; candidateId: string | null; candidateName: string | null } {
 // Clean up line breaks and replace with spaces
 const cleaned = text.replace(/\r/g, " ").replace(/\n/g, " ");

 // Match 6 to 12 consecutive digits (common for IDs)
 const idMatch = cleaned.match(/\b\d{6,12}\b/);
 const candidateId = idMatch ? idMatch[0] : null;

 // Match a sequence of 2 or 3 capitalized words (e.g., First Name Middle Name Last Name)
 const nameMatch = cleaned.match(
 /([A-Z][a-zA-Z]{1,}\s+[A-Z][a-zA-Z]{1,}(\s+[A-Z][a-zA-Z]{1,})?)/
 );
 const candidateName = nameMatch ? nameMatch[0] : null;

 return { text: cleaned, candidateId, candidateName };
}