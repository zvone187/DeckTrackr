import express from 'express';
import mongoose from 'mongoose';
import deckService from '../services/deckService';
import viewerService from '../services/viewerService';
const router = express.Router();
// Helper function to check if a string is a valid MongoDB ObjectId
const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id) && /^[0-9a-fA-F]{24}$/.test(id);
};
// Description: Submit viewer email and get access to deck
// Endpoint: POST /api/viewer/access
// Request: { deckId: string, email: string }
// Response: { success: boolean, viewerId: string }
router.post('/access', async (req, res) => {
    try {
        const { deckId, email } = req.body;
        if (!deckId || !email) {
            return res.status(400).json({ error: 'Deck ID and email are required' });
        }
        // Try to get deck by ID if valid ObjectId, otherwise try token
        let deck;
        if (isValidObjectId(deckId)) {
            deck = await deckService.getDeckById(deckId);
        }
        if (!deck) {
            deck = await deckService.getDeckByToken(deckId);
        }
        if (!deck || !deck.isActive) {
            return res.status(404).json({ error: 'Deck not found or inactive' });
        }
        const { viewer } = await viewerService.submitEmail({
            deckId: deck._id.toString(),
            email,
        });
        res.status(200).json({
            success: true,
            viewerId: viewer._id.toString(),
        });
    }
    catch (error) {
        console.error(`[ViewerRoutes] Error submitting email: ${error}`);
        res.status(500).json({ error: error.message });
    }
});
// Description: Get public deck by ID or token
// Endpoint: GET /api/viewer/deck/:deckId
// Request: {}
// Response: { deck: { name: string, pageCount: number, fileUrl: string, isActive: boolean } }
router.get('/deck/:deckId', async (req, res) => {
    try {
        const deckId = req.params.deckId;
        // Try to get deck by ID if valid ObjectId, otherwise try token
        let deck;
        if (isValidObjectId(deckId)) {
            deck = await deckService.getDeckById(deckId);
        }
        if (!deck) {
            deck = await deckService.getDeckByToken(deckId);
        }
        if (!deck) {
            return res.status(404).json({ error: 'Deck not found or inactive' });
        }
        res.status(200).json({
            deck: {
                name: deck.title,
                pageCount: deck.totalPages,
                fileUrl: deck.filePath,
                isActive: deck.isActive,
            },
        });
    }
    catch (error) {
        console.error(`[ViewerRoutes] Error fetching public deck: ${error}`);
        res.status(500).json({ error: error.message });
    }
});
// Description: Start viewing session
// Endpoint: POST /api/viewer/session/start
// Request: { deckId: string, viewerId: string }
// Response: { sessionId: string }
router.post('/session/start', async (req, res) => {
    try {
        const { deckId, viewerId } = req.body;
        if (!deckId || !viewerId) {
            return res.status(400).json({ error: 'Deck ID and viewer ID are required' });
        }
        const userAgent = req.headers['user-agent'];
        const ipAddress = req.ip || req.socket.remoteAddress;
        const session = await viewerService.createSession({
            viewerId,
            deckId,
            userAgent,
            ipAddress,
        });
        console.log(`[ViewerRoutes] Started session: ${session._id}`);
        res.status(200).json({ sessionId: session._id.toString() });
    }
    catch (error) {
        console.error(`[ViewerRoutes] Error starting session: ${error}`);
        res.status(500).json({ error: error.message });
    }
});
// Description: Track slide navigation
// Endpoint: POST /api/viewer/track
// Request: { deckId: string, viewerId: string, slideNumber: number, fromSlide?: number, sessionId: string }
// Response: { success: boolean }
router.post('/track', async (req, res) => {
    try {
        const { deckId, viewerId, slideNumber, fromSlide, sessionId } = req.body;
        if (!deckId || !viewerId || slideNumber === undefined) {
            return res.status(400).json({ error: 'Deck ID, viewer ID, and slide number are required' });
        }
        // Track the slide view
        await viewerService.trackSlide({
            sessionId: sessionId || '', // Use provided sessionId or empty string
            viewerId,
            deckId,
            slideNumber,
            timeSpent: 0, // Will be calculated on the next navigation
        });
        console.log(`[ViewerRoutes] Tracked slide navigation: viewer ${viewerId}, slide ${slideNumber}`);
        res.status(200).json({ success: true });
    }
    catch (error) {
        console.error(`[ViewerRoutes] Error tracking slide: ${error}`);
        res.status(500).json({ error: error.message });
    }
});
// Description: End viewing session
// Endpoint: POST /api/viewer/session/end
// Request: { sessionId: string }
// Response: { success: boolean }
router.post('/session/end', async (req, res) => {
    try {
        const { sessionId } = req.body;
        if (!sessionId) {
            return res.status(400).json({ error: 'Session ID is required' });
        }
        // Calculate duration and end the session
        await viewerService.endSession({
            sessionId,
            duration: 0, // Will be calculated by the service
        });
        console.log(`[ViewerRoutes] Ended session: ${sessionId}`);
        res.status(200).json({ success: true });
    }
    catch (error) {
        console.error(`[ViewerRoutes] Error ending session: ${error}`);
        res.status(500).json({ error: error.message });
    }
});
export default router;
//# sourceMappingURL=viewerRoutes.js.map