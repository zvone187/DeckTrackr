import mongoose, { Document } from 'mongoose';
export interface IViewingSession extends Document {
    _id: mongoose.Types.ObjectId;
    viewerId: mongoose.Types.ObjectId;
    deckId: mongoose.Types.ObjectId;
    sessionToken: string;
    startedAt: Date;
    endedAt?: Date;
    duration: number;
    completedPages: number[];
    userAgent?: string;
    ipAddress?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IViewingSession, {}, {}, {}, mongoose.Document<unknown, {}, IViewingSession, {}, {}> & IViewingSession & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=ViewingSession.d.ts.map