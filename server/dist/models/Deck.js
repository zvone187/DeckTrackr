import mongoose, { Schema } from 'mongoose';
const DeckSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    fileName: {
        type: String,
        required: true,
    },
    filePath: {
        type: String,
        required: true,
    },
    fileSize: {
        type: Number,
        required: true,
    },
    totalPages: {
        type: Number,
        required: true,
    },
    pages: [
        {
            pageNumber: {
                type: Number,
                required: true,
            },
            imagePath: {
                type: String,
                required: true,
            },
            thumbnailPath: {
                type: String,
                required: true,
            },
        },
    ],
    isActive: {
        type: Boolean,
        default: true,
        index: true,
    },
    publicToken: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
}, {
    timestamps: true,
});
DeckSchema.index({ userId: 1, createdAt: -1 });
DeckSchema.index({ publicToken: 1, isActive: 1 });
export default mongoose.model('Deck', DeckSchema);
//# sourceMappingURL=Deck.js.map