import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { createCanvas, Canvas } from 'canvas';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

// Get __dirname in ES module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import pdfjs-dist for Node.js using require in ES module
const require = createRequire(import.meta.url);
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

export interface ProcessedPage {
  pageNumber: number;
  imagePath: string;
  thumbnailPath: string;
}

export interface PDFProcessResult {
  totalPages: number;
  pages: ProcessedPage[];
}

// Custom Canvas Factory for pdfjs-dist
class NodeCanvasFactory {
  create(width: number, height: number): { canvas: Canvas; context: any } {
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');
    return {
      canvas,
      context,
    };
  }

  reset(canvasAndContext: { canvas: Canvas; context: any }, width: number, height: number): void {
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  }

  destroy(canvasAndContext: { canvas: Canvas; context: any }): void {
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
  }
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

    // Read PDF file
    const pdfBuffer = await fs.readFile(pdfPath);

    // Load PDF with pdfjs-dist
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(pdfBuffer),
      useSystemFonts: false,
      standardFontDataUrl: path.join(__dirname, '..', 'node_modules', 'pdfjs-dist', 'standard_fonts'),
      cMapUrl: path.join(__dirname, '..', 'node_modules', 'pdfjs-dist', 'cmaps'),
      cMapPacked: true,
    });

    const pdfDoc = await loadingTask.promise;
    const totalPages = pdfDoc.numPages;

    console.log(`[PDFProcessor] PDF has ${totalPages} pages`);

    const pages: ProcessedPage[] = [];
    const canvasFactory = new NodeCanvasFactory();

    for (let i = 1; i <= totalPages; i++) {
      console.log(`[PDFProcessor] Processing page ${i}/${totalPages}`);

      const page = await pdfDoc.getPage(i);

      // Use a higher scale for better quality
      const viewport = page.getViewport({ scale: 2.5 });

      const canvasAndContext = canvasFactory.create(
        Math.floor(viewport.width),
        Math.floor(viewport.height)
      );

      // Render with white background
      const context = canvasAndContext.context;
      context.fillStyle = 'white';
      context.fillRect(0, 0, canvasAndContext.canvas.width, canvasAndContext.canvas.height);

      // Render PDF page to canvas with proper settings
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
        background: 'white',
        enableWebGL: false,
      };

      await page.render(renderContext).promise;

      // Convert canvas to PNG buffer
      const imageBuffer = canvasAndContext.canvas.toBuffer('image/png');

      // Save full-size image
      const imagePath = `pages/page_${i}.png`;
      const fullImagePath = path.join(outputDir, imagePath);
      await fs.writeFile(fullImagePath, imageBuffer);

      console.log(`[PDFProcessor] Saved page ${i} (${imageBuffer.length} bytes)`);

      // Create and save thumbnail
      const thumbnailPath = `thumbnails/thumb_${i}.png`;
      const fullThumbnailPath = path.join(outputDir, thumbnailPath);
      await sharp(imageBuffer)
        .resize(400, 300, { fit: 'inside', withoutEnlargement: true })
        .png()
        .toFile(fullThumbnailPath);

      pages.push({
        pageNumber: i,
        imagePath,
        thumbnailPath,
      });

      // Clean up canvas
      canvasFactory.destroy(canvasAndContext);
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
