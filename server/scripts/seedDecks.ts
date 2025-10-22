import dotenv from 'dotenv';
import { connectDB } from '../config/database.js';
import User from '../models/User.js';
import Deck from '../models/Deck.js';
import Viewer from '../models/Viewer.js';
import ViewingSession from '../models/ViewingSession.js';
import SlideView from '../models/SlideView.js';
import { v4 as uuidv4 } from 'uuid';
import { generatePasswordHash } from '../utils/password.js';
import path from 'path';
import fs from 'fs/promises';
import { processPDF } from '../utils/pdfProcessor.js';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

async function seedDatabase() {
  console.log('[Seed] Starting database seed...');

  try {
    await connectDB();

    console.log('[Seed] Cleaning existing data...');
    await SlideView.deleteMany({});
    await ViewingSession.deleteMany({});
    await Viewer.deleteMany({});
    await Deck.deleteMany({});

    console.log('[Seed] Creating test user...');
    let user = await User.findOne({ email: 'test@example.com' });

    if (!user) {
      const hashedPassword = await generatePasswordHash('password123');
      user = new User({
        email: 'test@example.com',
        password: hashedPassword,
        roles: ['user'],
      });
      await user.save();
      console.log('[Seed] Test user created: test@example.com / password123');
    } else {
      console.log('[Seed] Test user already exists');
    }

    console.log('[Seed] Database seeded successfully!');
    console.log('\n=================================');
    console.log('Test User Credentials:');
    console.log('Email: test@example.com');
    console.log('Password: password123');
    console.log('=================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
