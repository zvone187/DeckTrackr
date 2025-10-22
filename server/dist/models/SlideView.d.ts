import mongoose, { Document } from 'mongoose';
export interface ISlideView extends Document {
    _id: mongoose.Types.ObjectId;
    sessionId: mongoose.Types.ObjectId;
    viewerId: mongoose.Types.ObjectId;
    deckId: mongoose.Types.ObjectId;
    slideNumber: number;
    viewedAt: Date;
    timeSpent: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<ISlideView, {}, {}, {}, mongoose.Document<unknown, {}, ISlideView, {}, {}> & ISlideView & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=SlideView.d.ts.map