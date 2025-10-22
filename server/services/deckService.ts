import Deck, { IDeck } from '../models/Deck';
import Viewer from '../models/Viewer';
import ViewingSession from '../models/ViewingSession';
import SlideView from '../models/SlideView';
import { processPDF, deleteDeckFiles } from '../utils/pdfProcessor';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface CreateDeckData {
  userId: string;
  title: string;
  file: Express.Multer.File;
}

export interface UpdateDeckData {
  title?: string;
  isActive?: boolean;
}

class DeckService {
  async getUserDecks(userId: string): Promise<IDeck[]> {
    console.log(`[DeckService] Fetching decks for user: ${userId}`);
    const decks = await Deck.find({ userId }).sort({ createdAt: -1 }).lean();
    return decks;
  }

  async getDeckById(deckId: string, userId?: string): Promise<IDeck | null> {
    console.log(`[DeckService] Fetching deck: ${deckId}`);
    const query: any = { _id: deckId };
    if (userId) query.userId = userId;
    const deck = await Deck.findOne(query).lean();
    return deck;
  }

  async getDeckByToken(token: string): Promise<IDeck | null> {
    console.log(`[DeckService] Fetching deck by token: ${token}`);
    const deck = await Deck.findOne({ publicToken: token, isActive: true }).lean();
    return deck;
  }

  async createDeck(data: CreateDeckData): Promise<IDeck> {
    console.log(`[DeckService] Creating deck: ${data.title}`);
    const { userId, title, file } = data;
    const publicToken = uuidv4();
    const deckId = new mongoose.Types.ObjectId();
    const deckDir = path.join(__dirname, '..', 'uploads', 'decks', deckId.toString());

    await fs.mkdir(deckDir, { recursive: true });
    const newFilePath = path.join(deckDir, file.filename);
    await fs.rename(file.path, newFilePath);

    try {
      const { totalPages, pages } = await processPDF(newFilePath, deckDir);
      const deck = new Deck({
        _id: deckId,
        userId,
        title,
        fileName: file.originalname,
        filePath: newFilePath,
        fileSize: file.size,
        totalPages,
        pages,
        isActive: true,
        publicToken,
      });
      await deck.save();
      console.log(`[DeckService] Deck created successfully: ${deck._id}`);
      return deck;
    } catch (error) {
      console.error(`[DeckService] Error creating deck: ${error}`);
      await deleteDeckFiles(deckDir).catch(() => {});
      throw error;
    }
  }

  async updateDeck(deckId: string, userId: string, data: UpdateDeckData): Promise<IDeck | null> {
    console.log(`[DeckService] Updating deck: ${deckId}`);
    const deck = await Deck.findOneAndUpdate({ _id: deckId, userId }, data, { new: true });
    if (deck) console.log(`[DeckService] Deck updated successfully: ${deckId}`);
    return deck;
  }

  async deleteDeck(deckId: string, userId: string): Promise<boolean> {
    console.log(`[DeckService] Deleting deck: ${deckId}`);
    const deck = await Deck.findOne({ _id: deckId, userId });
    if (!deck) return false;

    await Promise.all([
      Viewer.deleteMany({ deckId }),
      ViewingSession.deleteMany({ deckId }),
      SlideView.deleteMany({ deckId }),
    ]);

    const deckDir = path.dirname(deck.filePath);
    await deleteDeckFiles(deckDir).catch((error) => {
      console.error(`[DeckService] Error deleting files: ${error}`);
    });

    await Deck.deleteOne({ _id: deckId });
    console.log(`[DeckService] Deck deleted successfully: ${deckId}`);
    return true;
  }

  async getDeckAnalytics(deckId: string, userId: string): Promise<any> {
    console.log(`[DeckService] Fetching analytics for deck: ${deckId}`);
    const deck = await Deck.findOne({ _id: deckId, userId });
    if (!deck) return null;

    const viewers = await Viewer.find({ deckId }).lean();
    const totalViewers = viewers.length;
    const totalViews = viewers.reduce((sum, v) => sum + v.totalOpens, 0);
    const totalTimeSpent = viewers.reduce((sum, v) => sum + v.totalTimeSpent, 0);
    const averageTimeSpent = totalViewers > 0 ? totalTimeSpent / totalViewers : 0;

    const slideViewsAgg = await SlideView.aggregate([
      { $match: { deckId: new mongoose.Types.ObjectId(deckId) } },
      {
        $group: {
          _id: '$slideNumber',
          views: { $sum: 1 },
          totalTime: { $sum: '$timeSpent' },
        },
      },
      {
        $project: {
          pageNumber: '$_id',
          views: 1,
          averageTime: { $divide: ['$totalTime', '$views'] },
        },
      },
      { $sort: { pageNumber: 1 } },
    ]);

    const recentViewers = await Viewer.find({ deckId })
      .sort({ lastViewedAt: -1 })
      .limit(10)
      .lean();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const viewsOverTimeAgg = await ViewingSession.aggregate([
      {
        $match: {
          deckId: new mongoose.Types.ObjectId(deckId),
          startedAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$startedAt' } },
          views: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', views: 1, _id: 0 } },
    ]);

    // Find most viewed and drop-off slides
    const mostViewedSlide = slideViewsAgg.length > 0
      ? slideViewsAgg.reduce((max, curr) => curr.views > max.views ? curr : max, slideViewsAgg[0]).pageNumber
      : 1;

    const dropOffSlide = slideViewsAgg.length > 1
      ? slideViewsAgg.reduce((min, curr) => curr.views < min.views ? curr : min, slideViewsAgg[0]).pageNumber
      : deck.totalPages;

    return {
      deck: {
        _id: deck._id.toString(),
        name: deck.title,
        fileName: deck.fileName,
        fileUrl: deck.filePath,
        uploadDate: deck.createdAt?.toISOString(),
        totalViewers,
        totalOpens: totalViews,
        isActive: deck.isActive,
        ownerId: deck.userId.toString(),
        pageCount: deck.totalPages,
      },
      totalViewers,
      totalOpens: totalViews,
      averageTimeSpent: Math.round(averageTimeSpent),
      mostViewedSlide,
      dropOffSlide,
      viewers: viewers.map(v => ({
        _id: v._id.toString(),
        email: v.email,
        deckId: v.deckId.toString(),
        firstOpened: v.createdAt?.toISOString() || new Date().toISOString(),
        lastOpened: v.lastViewedAt?.toISOString() || new Date().toISOString(),
        totalOpens: v.totalOpens,
        totalTimeSpent: v.totalTimeSpent,
      })),
    };
  }

  async getViewerDetails(deckId: string, viewerId: string, userId: string): Promise<any> {
    console.log(`[DeckService] Fetching viewer details: ${viewerId}`);
    const deck = await Deck.findOne({ _id: deckId, userId });
    if (!deck) return null;

    const viewer = await Viewer.findOne({ _id: viewerId, deckId }).lean();
    if (!viewer) return null;

    const sessions = await ViewingSession.find({ viewerId, deckId })
      .sort({ startedAt: -1 })
      .lean();

    const sessionsWithSlides = await Promise.all(
      sessions.map(async (session) => {
        const slides = await SlideView.find({ sessionId: session._id })
          .sort({ viewedAt: 1 })
          .lean();
        return {
          _id: session._id,
          startedAt: session.startedAt,
          endedAt: session.endedAt,
          duration: session.duration,
          slides: slides.map((s) => ({
            slideNumber: s.slideNumber,
            timeSpent: s.timeSpent,
            viewedAt: s.viewedAt,
          })),
        };
      })
    );

    return {
      viewer: {
        _id: viewer._id,
        email: viewer.email,
        firstName: viewer.firstName,
        lastName: viewer.lastName,
        company: viewer.company,
        totalOpens: viewer.totalOpens,
        totalTimeSpent: viewer.totalTimeSpent,
        firstViewedAt: viewer.firstViewedAt,
        lastViewedAt: viewer.lastViewedAt,
      },
      sessions: sessionsWithSlides,
    };
  }
}

export default new DeckService();
