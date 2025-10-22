# DeckTrackr

A modern pitch deck tracking and analytics platform that helps you understand how investors engage with your presentations. Upload your pitch decks, share them with investors, and gain valuable insights into viewing behavior.

## Features

### 📊 Comprehensive Analytics
- Track unique viewers and total opens
- Monitor time spent on each slide
- Identify most viewed and drop-off slides
- View detailed session timelines
- Per-slide engagement metrics

### 🎯 Investor Tracking
- Email capture for viewer identification
- Session-based viewing tracking
- Individual viewer analytics
- First and last viewed timestamps
- Total viewing time per investor

### 📄 Smart PDF Processing
- Automatic PDF to image conversion
- High-quality slide rendering
- Thumbnail generation
- Support for multi-page decks

### 🔗 Easy Sharing
- Generate shareable public links
- Toggle deck active/inactive status
- No login required for viewers
- Professional deck viewer interface

### 🎨 Modern UI
- Clean, intuitive dashboard
- Dark mode support
- Responsive design
- Interactive slide navigation
- Real-time analytics updates

## Tech Stack

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Shadcn/ui** - Component library
- **React Router** - Navigation
- **Axios** - API client
- **date-fns** - Date formatting

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **pdfjs-dist** - PDF processing
- **Sharp** - Image processing
- **Multer** - File uploads

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **MongoDB** (v5.0 or higher)
- **npm** or **yarn**

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/decktrackr.git
cd decktrackr
```

### 2. Install Dependencies

Install root dependencies:
```bash
npm install
```

Install client dependencies:
```bash
cd client
npm install
cd ..
```

Install server dependencies:
```bash
cd server
npm install
cd ..
```

Install shared dependencies:
```bash
cd shared
npm install
cd ..
```

### 3. Configure Environment Variables

Create a `.env` file in the `server` directory:

```bash
cd server
cp .env.example .env
```

Edit `server/.env` and configure the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/decktrackr

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# CORS Configuration (optional)
CLIENT_URL=http://localhost:5173
```

**Important:** Change `JWT_SECRET` to a strong random string in production!

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Using MongoDB service (Linux/Mac)
sudo systemctl start mongod

# Using MongoDB directly
mongod --dbpath /path/to/your/data/directory

# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 5. Build Shared Module

The shared module contains types used by both client and server:

```bash
cd shared
npm run build
cd ..
```

### 6. Start the Application

From the root directory, start both the client and server:

```bash
npm start
```

This will start:
- **Frontend** at `http://localhost:5173`
- **Backend** at `http://localhost:3000`

Alternatively, you can run them separately:

```bash
# Terminal 1 - Start the server
cd server
npm run dev

# Terminal 2 - Start the client
cd client
npm run dev
```

## Usage

### For Deck Owners

1. **Register/Login**
   - Create an account or login at `http://localhost:5173`

2. **Upload a Deck**
   - Click "Upload Deck" button
   - Select a PDF file (max 10MB)
   - Enter a deck name
   - Wait for PDF processing

3. **Share Your Deck**
   - Click the "Share" button on any deck
   - Copy the generated public link
   - Share it with investors via email

4. **View Analytics**
   - Click "Analytics" on any deck
   - View total viewers, opens, and engagement
   - Check per-slide metrics
   - Click on any viewer for detailed session history

### For Investors/Viewers

1. **Access Deck**
   - Click on the shared link received from the deck owner

2. **Enter Email**
   - Provide your email address to view the deck

3. **View Presentation**
   - Navigate slides using arrow keys or buttons
   - View thumbnails for quick navigation
   - Close the viewer when done

## Project Structure

```
decktrackr/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/           # API client functions
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   ├── pages/         # Page components
│   │   └── types/         # TypeScript types
│   └── package.json
├── server/                # Express backend
│   ├── config/           # Configuration files
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── utils/            # Utility functions
│   ├── uploads/          # Uploaded files
│   └── package.json
├── shared/               # Shared types/configs
│   ├── config/
│   ├── types/
│   └── package.json
└── package.json          # Root package
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

### Decks (Authenticated)
- `GET /api/decks` - Get user's decks
- `POST /api/decks` - Create new deck (upload PDF)
- `GET /api/decks/:id` - Get deck details
- `PATCH /api/decks/:id` - Update deck
- `DELETE /api/decks/:id` - Delete deck
- `GET /api/decks/:id/analytics` - Get deck analytics
- `GET /api/decks/:deckId/viewer/:viewerId` - Get viewer details

### Viewer (Public)
- `POST /api/viewer/access` - Submit email for deck access
- `GET /api/viewer/deck/:deckId` - Get public deck
- `POST /api/viewer/session/start` - Start viewing session
- `POST /api/viewer/track` - Track slide navigation
- `POST /api/viewer/session/end` - End viewing session

## Development

### Running Tests

```bash
# Run server tests
cd server
npm test

# Run client tests
cd client
npm test
```

### Code Formatting

```bash
# Format all code
npm run format

# Lint code
npm run lint
```

### Database Seeding

Create a test user and sample data:

```bash
cd server
npm run seed
```

Default test user:
- Email: `test@example.com`
- Password: `password123`

## Production Deployment

### Environment Variables

Update production environment variables:
```env
NODE_ENV=production
MONGODB_URI=mongodb://your-production-db
JWT_SECRET=very-strong-random-production-secret
CLIENT_URL=https://yourdomain.com
```

### Build for Production

```bash
# Build client
cd client
npm run build

# Build server
cd ../server
npm run build

# Build shared
cd ../shared
npm run build
```

### Deployment Options

**Option 1: Traditional Hosting**
- Deploy backend to services like Heroku, AWS, DigitalOcean
- Deploy frontend to Vercel, Netlify, or AWS S3
- Use MongoDB Atlas for database

**Option 2: Docker**
```bash
# Build and run with Docker Compose
docker-compose up -d
```

## Security Considerations

- Change `JWT_SECRET` in production
- Use HTTPS in production
- Enable CORS only for trusted domains
- Set appropriate MongoDB access controls
- Regular security updates
- Input validation on all endpoints
- Rate limiting on public endpoints

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongo --eval "db.version()"

# Check MongoDB logs
tail -f /var/log/mongodb/mongod.log
```

### PDF Processing Issues
- Ensure sufficient disk space for uploads
- Check file permissions on `server/uploads/`
- Verify PDF is not corrupted or password-protected

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [React](https://reactjs.org/)
- UI components from [Shadcn/ui](https://ui.shadcn.com/)
- PDF processing with [PDF.js](https://mozilla.github.io/pdf.js/)
- Icons from [Lucide](https://lucide.dev/)

## Support

For issues, questions, or contributions, please open an issue on GitHub.

---

**Made with ❤️ by the DeckTrackr Team**
