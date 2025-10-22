import Viewer, { IViewer } from '../models/Viewer';
import ViewingSession, { IViewingSession } from '../models/ViewingSession';
import SlideView from '../models/SlideView';
import { v4 as uuidv4 } from 'uuid';

export interface SubmitEmailData {
  deckId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
}

export interface CreateSessionData {
  viewerId: string;
  deckId: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface TrackSlideData {
  sessionId: string;
  viewerId: string;
  deckId: string;
  slideNumber: number;
  timeSpent: number;
}

export interface EndSessionData {
  sessionId: string;
  duration: number;
}

class ViewerService {
  async submitEmail(data: SubmitEmailData): Promise<{ viewer: IViewer; isNewViewer: boolean }> {
    console.log(`[ViewerService] Submitting email for deck: ${data.deckId}`);
    const { deckId, email, firstName, lastName, company } = data;

    let viewer = await Viewer.findOne({ deckId, email });
    let isNewViewer = false;

    if (viewer) {
      viewer.lastViewedAt = new Date();
      viewer.totalOpens += 1;
      if (firstName) viewer.firstName = firstName;
      if (lastName) viewer.lastName = lastName;
      if (company) viewer.company = company;
      await viewer.save();
      console.log(`[ViewerService] Updated existing viewer: ${viewer._id}`);
    } else {
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

  async createSession(data: CreateSessionData): Promise<IViewingSession> {
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

  async getSessionByToken(sessionToken: string): Promise<IViewingSession | null> {
    const session = await ViewingSession.findOne({ sessionToken });
    return session;
  }

  async trackSlide(data: TrackSlideData): Promise<void> {
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

  async endSession(data: EndSessionData): Promise<void> {
    console.log(`[ViewerService] Ending session: ${data.sessionId}`);
    const { sessionId, duration } = data;

    await ViewingSession.findByIdAndUpdate(sessionId, {
      endedAt: new Date(),
      duration,
    });

    console.log(`[ViewerService] Session ended: ${sessionId}`);
  }

  async getViewerById(viewerId: string): Promise<IViewer | null> {
    const viewer = await Viewer.findById(viewerId);
    return viewer;
  }

  async getViewerByEmailAndDeck(email: string, deckId: string): Promise<IViewer | null> {
    const viewer = await Viewer.findOne({ email, deckId });
    return viewer;
  }
}

export default new ViewerService();
