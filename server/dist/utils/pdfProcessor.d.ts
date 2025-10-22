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
export declare function processPDF(pdfPath: string, outputDir: string): Promise<PDFProcessResult>;
/**
 * Delete all files associated with a deck
 */
export declare function deleteDeckFiles(deckDir: string): Promise<void>;
//# sourceMappingURL=pdfProcessor.d.ts.map