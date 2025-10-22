import mongoose, { Document } from 'mongoose';
export interface IDeck extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    title: string;
    fileName: string;
    filePath: string;
    fileSize: number;
    totalPages: number;
    pages: Array<{
        pageNumber: number;
        imagePath: string;
        thumbnailPath: string;
    }>;
    isActive: boolean;
    publicToken: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IDeck, {}, {}, {}, mongoose.Document<unknown, {}, IDeck, {}, {}> & IDeck & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Deck.d.ts.map