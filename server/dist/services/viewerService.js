import Viewer from '../models/Viewer';
import ViewingSession from '../models/ViewingSession';
import SlideView from '../models/SlideView';
import { v4 as uuidv4 } from 'uuid';
class ViewerService {
    async submitEmail(data) {
        console.log(`[ViewerService] Submitting email for deck: ${data.deckId}`);
        const { deckId, email, firstName, lastName, company } = data;
        let viewer = await Viewer.findOne({ deckId, email });
        let isNewViewer = false;
        if (viewer) {
            viewer.lastViewedAt = new Date();
            viewer.totalOpens += 1;
            if (firstName)
                viewer.firstName = firstName;
            if (lastName)
                viewer.lastName = lastName;
            if (company)
                viewer.company = company;
            await viewer.save();
            console.log(`[ViewerService] Updated existing viewer: ${viewer._id}`);
        }
        else {
            viewer = new Viewer({
                deckId,
                email,
                firstName,
                lastName,
                company,
                firstViewedAt: new Date(),
                lastViewedAt: new Date(),
                totalOpens: 1,
                totalTimeSpent: 0,
            });
            await viewer.save();
            isNewViewer = true;
            console.log(`[ViewerService] Created new viewer: ${viewer._id}`);
        }
        return { viewer, isNewViewer };
    }
    async createSession(data) {
        console.log(`[ViewerService] Creating session for viewer: ${data.viewerId}`);
        const { viewerId, deckId, userAgent, ipAddress } = data;
        const session = new ViewingSession({
            viewerId,
            deckId,
            sessionToken: uuidv4(),
            startedAt: new Date(),
            duration: 0,
            completedPages: [],
            userAgent,
            ipAddress,
        });
        await session.save();
        console.log(`[ViewerService] Created session: ${session._id}`);
        return session;
    }
    async getSessionByToken(sessionToken) {
        const session = await ViewingSession.findOne({ sessionToken });
        return session;
    }
    async trackSlide(data) {
        console.log(`[ViewerService] Tracking slide ${data.slideNumber} for session: ${data.sessionId}`);
        const { sessionId, viewerId, deckId, slideNumber, timeSpent } = data;
        const slideView = new SlideView({
            sessionId,
            viewerId,
            deckId,
            slideNumber,
            viewedAt: new Date(),
            timeSpent,
        });
        await slideView.save();
        await ViewingSession.findByIdAndUpdate(sessionId, {
            $addToSet: { completedPages: slideNumber },
        });
        await Viewer.findByIdAndUpdate(viewerId, {
            $inc: { totalTimeSpent: timeSpent },
        });
        console.log(`[ViewerService] Tracked slide view: ${slideView._id}`);
    }
    async endSession(data) {
        console.log(`[ViewerService] Ending session: ${data.sessionId}`);
        const { sessionId, duration } = data;
        await ViewingSession.findByIdAndUpdate(sessionId, {
            endedAt: new Date(),
            duration,
        });
        console.log(`[ViewerService] Session ended: ${sessionId}`);
    }
    async getViewerById(viewerId) {
        const viewer = await Viewer.findById(viewerId);
        return viewer;
    }
    async getViewerByEmailAndDeck(email, deckId) {
        const viewer = await Viewer.findOne({ email, deckId });
        return viewer;
    }
}
export default new ViewerService();
//# sourceMappingURL=viewerService.js.map