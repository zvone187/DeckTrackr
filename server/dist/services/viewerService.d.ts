import { IViewer } from '../models/Viewer';
import { IViewingSession } from '../models/ViewingSession';
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
declare class ViewerService {
    submitEmail(data: SubmitEmailData): Promise<{
        viewer: IViewer;
        isNewViewer: boolean;
    }>;
    createSession(data: CreateSessionData): Promise<IViewingSession>;
    getSessionByToken(sessionToken: string): Promise<IViewingSession | null>;
    trackSlide(data: TrackSlideData): Promise<void>;
    endSession(data: EndSessionData): Promise<void>;
    getViewerById(viewerId: string): Promise<IViewer | null>;
    getViewerByEmailAndDeck(email: string, deckId: string): Promise<IViewer | null>;
}
declare const _default: ViewerService;
export default _default;
//# sourceMappingURL=viewerService.d.ts.map