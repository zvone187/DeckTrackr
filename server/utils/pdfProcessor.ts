import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

export interface ProcessedPage {
  pageNumber: number;
  imagePath: string;
  thumbnailPath: string;
}

export interface PDFProcessResult {
  totalPages: number;
  pages: ProcessedPage[];
}

/**
 * Process a PDF file and extract pages as images
 */
export async function processPDF(
  pdfPath: string,
  outputDir: string
): Promise<PDFProcessResult> {
  console.log(`[PDFProcessor] Starting to process PDF: ${pdfPath}`);

  try {
    await fs.mkdir(path.join(outputDir, 'pages'), { recursive: true });
    await fs.mkdir(path.join(outputDir, 'thumbnails'), { recursive: true });

    const pdfBuffer = await fs.readFile(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const totalPages = pdfDoc.getPageCount();

    console.log(`[PDFProcessor] PDF has ${totalPages} pages`);

    const pages: ProcessedPage[] = [];

    for (let i = 0; i < totalPages; i++) {
      const pageNumber = i + 1;
      console.log(`[PDFProcessor] Processing page ${pageNumber}/${totalPages}`);

      const imagePath = `pages/page_${pageNumber}.png`;
      const thumbnailPath = `thumbnails/thumb_${pageNumber}.png`;

      // Create placeholder images (for demo - in production use pdf-poppler or similar)
      await createPlaceholderImage(
        path.join(outputDir, imagePath),
        pageNumber,
        1200,
        1600
      );
      await createPlaceholderImage(
        path.join(outputDir, thumbnailPath),
        pageNumber,
        300,
        400
      );

      pages.push({
        pageNumber,
        imagePath,
        thumbnailPath,
      });
    }

    console.log(`[PDFProcessor] Successfully processed ${totalPages} pages`);

    return {
      totalPages,
      pages,
    };
  } catch (error) {
    console.error(`[PDFProcessor] Error processing PDF: ${error}`);
    throw new Error(`Failed to process PDF: ${error.message}`);
  }
}

/**
 * Create a placeholder image with page number
 */
async function createPlaceholderImage(
  outputPath: string,
  pageNumber: number,
  width: number,
  height: number
): Promise<void> {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="white"/>
      <rect width="100%" height="100%" fill="none" stroke="#e5e7eb" stroke-width="2"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="48"
            fill="#9ca3af" text-anchor="middle" dominant-baseline="middle">
        Page ${pageNumber}
      </text>
    </svg>
  `;

  await sharp(Buffer.from(svg)).png().toFile(outputPath);
}

/**
 * Delete all files associated with a deck
 */
export async function deleteDeckFiles(deckDir: string): Promise<void> {
  console.log(`[PDFProcessor] Deleting deck files: ${deckDir}`);

  try {
    await fs.rm(deckDir, { recursive: true, force: true });
    console.log(`[PDFProcessor] Successfully deleted deck files`);
  } catch (error) {
    console.error(`[PDFProcessor] Error deleting deck files: ${error}`);
    throw new Error(`Failed to delete deck files: ${error.message}`);
  }
}
