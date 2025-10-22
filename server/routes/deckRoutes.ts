import express, { Request, Response } from 'express';
import { requireUser } from './middlewares/auth';
import { upload } from '../utils/fileUpload';
import deckService from '../services/deckService';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Description: Get all decks for the authenticated user
// Endpoint: GET /api/decks
// Request: {}
// Response: { decks: Array<Deck> }
router.get('/', requireUser, async (req: Request, res: Response) => {
  try {
    const userId = req.user._id.toString();
    const decks = await deckService.getUserDecks(userId);
    res.status(200).json({ decks });
  } catch (error) {
    console.error(`[DeckRoutes] Error fetching decks: ${error}`);
    res.status(500).json({ error: error.message });
  }
});

// Description: Upload a new deck
// Endpoint: POST /api/decks
// Request: FormData { title: string, file: File }
// Response: { deck: Deck }
router.post('/', requireUser, upload.single('file'), async (req: Request, res: Response) => {
  try {
    const userId = req.user._id.toString();
    const { title } = req.body;
    const file = req.file;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    if (!file) {
      return res.status(400).json({ error: 'PDF file is required' });
    }

    const deck = await deckService.createDeck({ userId, title, file });
    res.status(201).json({ deck });
  } catch (error) {
    console.error(`[DeckRoutes] Error uploading deck: ${error}`);
    res.status(500).json({ error: error.message });
  }
});

// Description: Get deck by ID
// Endpoint: GET /api/decks/:id
// Request: {}
// Response: { deck: Deck }
router.get('/:id', requireUser, async (req: Request, res: Response) => {
  try {
    const userId = req.user._id.toString();
    const deckId = req.params.id;
    const deck = await deckService.getDeckById(deckId, userId);

    if (!deck) {
      return res.status(404).json({ error: 'Deck not found' });
    }

    res.status(200).json({ deck });
  } catch (error) {
    console.error(`[DeckRoutes] Error fetching deck: ${error}`);
    res.status(500).json({ error: error.message });
  }
});

// Description: Update deck
// Endpoint: PUT /api/decks/:id
// Request: { title?: string, isActive?: boolean }
// Response: { deck: Deck }
router.put('/:id', requireUser, async (req: Request, res: Response) => {
  try {
    const userId = req.user._id.toString();
    const deckId = req.params.id;
    const { title, isActive } = req.body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (isActive !== undefined) updateData.isActive = isActive;

    const deck = await deckService.updateDeck(deckId, userId, updateData);

    if (!deck) {
      return res.status(404).json({ error: 'Deck not found' });
    }

    res.status(200).json({ deck });
  } catch (error) {
    console.error(`[DeckRoutes] Error updating deck: ${error}`);
    res.status(500).json({ error: error.message });
  }
});

// Description: Delete deck
// Endpoint: DELETE /api/decks/:id
// Request: {}
// Response: { message: string }
router.delete('/:id', requireUser, async (req: Request, res: Response) => {
  try {
    const userId = req.user._id.toString();
    const deckId = req.params.id;
    const deleted = await deckService.deleteDeck(deckId, userId);

    if (!deleted) {
      return res.status(404).json({ error: 'Deck not found' });
    }

    res.status(200).json({ message: 'Deck deleted successfully' });
  } catch (error) {
    console.error(`[DeckRoutes] Error deleting deck: ${error}`);
    res.status(500).json({ error: error.message });
  }
});

// Description: Get deck analytics
// Endpoint: GET /api/decks/:id/analytics
// Request: {}
// Response: { analytics: DeckAnalytics }
router.get('/:id/analytics', requireUser, async (req: Request, res: Response) => {
  try {
    const userId = req.user._id.toString();
    const deckId = req.params.id;
    const analytics = await deckService.getDeckAnalytics(deckId, userId);

    if (!analytics) {
      return res.status(404).json({ error: 'Deck not found' });
    }

    res.status(200).json({ analytics });
  } catch (error) {
    console.error(`[DeckRoutes] Error fetching analytics: ${error}`);
    res.status(500).json({ error: error.message });
  }
});

// Description: Get viewer details
// Endpoint: GET /api/decks/:id/viewers/:viewerId
// Request: {}
// Response: { viewer: ViewerDetail }
router.get('/:id/viewers/:viewerId', requireUser, async (req: Request, res: Response) => {
  try {
    const userId = req.user._id.toString();
    const deckId = req.params.id;
    const viewerId = req.params.viewerId;
    const viewerDetails = await deckService.getViewerDetails(deckId, viewerId, userId);

    if (!viewerDetails) {
      return res.status(404).json({ error: 'Viewer not found' });
    }

    res.status(200).json({ viewer: viewerDetails });
  } catch (error) {
    console.error(`[DeckRoutes] Error fetching viewer details: ${error}`);
    res.status(500).json({ error: error.message });
  }
});

// Description: Serve deck page image
// Endpoint: GET /api/decks/:id/pages/:pageNumber
// Request: {}
// Response: Image file
router.get('/:id/pages/:pageNumber', async (req: Request, res: Response) => {
  try {
    const deckId = req.params.id;
    const pageNumber = req.params.pageNumber;
    const deck = await deckService.getDeckById(deckId);

    if (!deck) {
      return res.status(404).json({ error: 'Deck not found' });
    }

    const deckDir = path.dirname(deck.filePath);
    const imagePath = path.join(deckDir, 'pages', `page_${pageNumber}.png`);

    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.sendFile(imagePath);
  } catch (error) {
    console.error(`[DeckRoutes] Error serving page image: ${error}`);
    res.status(500).json({ error: error.message });
  }
});

// Description: Serve deck page thumbnail
// Endpoint: GET /api/decks/:id/thumbnails/:pageNumber
// Request: {}
// Response: Image file
router.get('/:id/thumbnails/:pageNumber', async (req: Request, res: Response) => {
  try {
    const deckId = req.params.id;
    const pageNumber = req.params.pageNumber;
    const deck = await deckService.getDeckById(deckId);

    if (!deck) {
      return res.status(404).json({ error: 'Deck not found' });
    }

    const deckDir = path.dirname(deck.filePath);
    const thumbnailPath = path.join(deckDir, 'thumbnails', `thumb_${pageNumber}.png`);

    if (!fs.existsSync(thumbnailPath)) {
      return res.status(404).json({ error: 'Thumbnail not found' });
    }

    res.sendFile(thumbnailPath);
  } catch (error) {
    console.error(`[DeckRoutes] Error serving thumbnail: ${error}`);
    res.status(500).json({ error: error.message });
  }
});

export default router;
