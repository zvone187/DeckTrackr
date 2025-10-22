import mongoose, { Schema, Document } from 'mongoose';

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

const DeckSchema: Schema = new Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

DeckSchema.index({ userId: 1, createdAt: -1 });
DeckSchema.index({ publicToken: 1, isActive: 1 });

export default mongoose.model<IDeck>('Deck', DeckSchema);
