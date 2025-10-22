import mongoose, { Schema, Document } from 'mongoose';

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

const ViewingSessionSchema: Schema = new Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

ViewingSessionSchema.index({ viewerId: 1, startedAt: -1 });
ViewingSessionSchema.index({ deckId: 1, startedAt: -1 });

export default mongoose.model<IViewingSession>('ViewingSession', ViewingSessionSchema);
