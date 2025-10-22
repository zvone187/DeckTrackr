import express, { Request, Response } from 'express';
import deckService from '../services/deckService';
import viewerService from '../services/viewerService';

const router = express.Router();

// Description: Submit viewer email and get access to deck
// Endpoint: POST /api/viewer/email
// Request: { deckToken: string, email: string, firstName?: string, lastName?: string, company?: string }
// Response: { viewer: Viewer, sessionToken: string }
router.post('/email', async (req: Request, res: Response) => {
  try {
    const { deckToken, email, firstName, lastName, company } = req.body;

    if (!deckToken || !email) {
      return res.status(400).json({ error: 'Deck token and email are required' });
    }

    const deck = await deckService.getDeckByToken(deckToken);
    if (!deck) {
      return res.status(404).json({ error: 'Deck not found or inactive' });
    }

    const { viewer } = await viewerService.submitEmail({
      deckId: deck._id.toString(),
      email,
      firstName,
      lastName,
      company,
    });

    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip || req.socket.remoteAddress;

    const session = await viewerService.createSession({
      viewerId: viewer._id.toString(),
      deckId: deck._id.toString(),
      userAgent,
      ipAddress,
    });

    res.status(200).json({
      viewer,
      sessionToken: session.sessionToken,
    });
  } catch (error) {
    console.error(`[ViewerRoutes] Error submitting email: ${error}`);
    res.status(500).json({ error: error.message });
  }
});

// Description: Get public deck by token
// Endpoint: GET /api/viewer/deck/:token
// Request: {}
// Response: { deck: Deck }
router.get('/deck/:token', async (req: Request, res: Response) => {
  try {
    const token = req.params.token;
    const deck = await deckService.getDeckByToken(token);

    if (!deck) {
      return res.status(404).json({ error: 'Deck not found or inactive' });
    }

    res.status(200).json({ deck });
  } catch (error) {
    console.error(`[ViewerRoutes] Error fetching public deck: ${error}`);
    res.status(500).json({ error: error.message });
  }
});

// Description: Track slide view
// Endpoint: POST /api/viewer/track
// Request: { sessionToken: string, slideNumber: number, timeSpent: number }
// Response: { success: boolean }
router.post('/track', async (req: Request, res: Response) => {
  try {
    const { sessionToken, slideNumber, timeSpent } = req.body;

    if (!sessionToken || slideNumber === undefined || timeSpent === undefined) {
      return res.status(400).json({ error: 'Session token, slide number, and time spent are required' });
    }

    const session = await viewerService.getSessionByToken(sessionToken);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    await viewerService.trackSlide({
      sessionId: session._id.toString(),
      viewerId: session.viewerId.toString(),
      deckId: session.deckId.toString(),
      slideNumber,
      timeSpent,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(`[ViewerRoutes] Error tracking slide: ${error}`);
    res.status(500).json({ error: error.message });
  }
});

// Description: End viewing session
// Endpoint: POST /api/viewer/session/end
// Request: { sessionToken: string, duration: number }
// Response: { success: boolean }
router.post('/session/end', async (req: Request, res: Response) => {
  try {
    const { sessionToken, duration } = req.body;

    if (!sessionToken || duration === undefined) {
      return res.status(400).json({ error: 'Session token and duration are required' });
    }

    const session = await viewerService.getSessionByToken(sessionToken);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    await viewerService.endSession({
      sessionId: session._id.toString(),
      duration,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(`[ViewerRoutes] Error ending session: ${error}`);
    res.status(500).json({ error: error.message });
  }
});

export default router;
