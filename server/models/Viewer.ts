import mongoose, { Schema, Document } from 'mongoose';

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

const ViewerSchema: Schema = new Schema(
  {
    deckId: {
      type: Schema.Types.ObjectId,
      ref: 'Deck',
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    firstViewedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    lastViewedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    totalOpens: {
      type: Number,
      default: 1,
    },
    totalTimeSpent: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

ViewerSchema.index({ deckId: 1, email: 1 }, { unique: true });
ViewerSchema.index({ deckId: 1, lastViewedAt: -1 });

export default mongoose.model<IViewer>('Viewer', ViewerSchema);
