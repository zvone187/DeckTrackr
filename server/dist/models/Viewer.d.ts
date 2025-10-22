import mongoose, { Document } from 'mongoose';
export interface IViewer extends Document {
    _id: mongoose.Types.ObjectId;
    deckId: mongoose.Types.ObjectId;
    email: string;
    firstName?: string;
    lastName?: string;
    company?: string;
    firstViewedAt: Date;
    lastViewedAt: Date;
    totalOpens: number;
    totalTimeSpent: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IViewer, {}, {}, {}, mongoose.Document<unknown, {}, IViewer, {}, {}> & IViewer & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Viewer.d.ts.map