import mongoose, { Schema } from 'mongoose';
const ViewingSessionSchema = new Schema({
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
    sessionToken: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    startedAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    endedAt: {
        type: Date,
    },
    duration: {
        type: Number,
        default: 0,
    },
    completedPages: {
        type: [Number],
        default: [],
    },
    userAgent: {
        type: String,
    },
    ipAddress: {
        type: String,
    },
}, {
    timestamps: true,
});
ViewingSessionSchema.index({ viewerId: 1, startedAt: -1 });
ViewingSessionSchema.index({ deckId: 1, startedAt: -1 });
export default mongoose.model('ViewingSession', ViewingSessionSchema);
//# sourceMappingURL=ViewingSession.js.map