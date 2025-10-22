import mongoose, { Schema } from 'mongoose';
const SlideViewSchema = new Schema({
    sessionId: {
        type: Schema.Types.ObjectId,
        ref: 'ViewingSession',
        required: true,
        index: true,
    },
    viewerId: {
        type: Schema.Types.ObjectId,
        ref: 'Viewer',
        required: true,
        index: true,
    },
    deckId: {
        type: Schema.Types.ObjectId,
        ref: 'Deck',
        required: true,
        index: true,
    },
    slideNumber: {
        type: Number,
        required: true,
    },
    viewedAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    timeSpent: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
SlideViewSchema.index({ sessionId: 1, slideNumber: 1 });
SlideViewSchema.index({ deckId: 1, slideNumber: 1 });
SlideViewSchema.index({ viewerId: 1, viewedAt: -1 });
export default mongoose.model('SlideView', SlideViewSchema);
//# sourceMappingURL=SlideView.js.map