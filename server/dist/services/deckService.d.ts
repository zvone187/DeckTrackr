import { IDeck } from '../models/Deck';
export interface CreateDeckData {
    userId: string;
    title: string;
    file: Express.Multer.File;
}
export interface UpdateDeckData {
    title?: string;
    isActive?: boolean;
}
declare class DeckService {
    getUserDecks(userId: string): Promise<IDeck[]>;
    getDeckById(deckId: string, userId?: string): Promise<IDeck | null>;
    getDeckByToken(token: string): Promise<IDeck | null>;
    createDeck(data: CreateDeckData): Promise<IDeck>;
    updateDeck(deckId: string, userId: string, data: UpdateDeckData): Promise<IDeck | null>;
    deleteDeck(deckId: string, userId: string): Promise<boolean>;
    getDeckAnalytics(deckId: string, userId: string): Promise<any>;
    getViewerDetails(deckId: string, viewerId: string, userId: string): Promise<any>;
}
declare const _default: DeckService;
export default _default;
//# sourceMappingURL=deckService.d.ts.map