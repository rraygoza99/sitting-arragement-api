# Sitting Arrangement API

A simple Node.js Express API for managing wedding seating arrangements with MongoDB integration.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your MongoDB connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   PORT=3000
   NODE_ENV=development
   ```

3. Start the server:
   ```bash
   npm start
   ```

   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /weddings` - Get all wedding data
- `POST /api/upload` - Upload wedding seating data (multipart/form-data with 'jsonFile' field)
- `GET /wedding-names` - Get list of wedding names

## Dependencies

- Express.js - Web framework
- MongoDB - Database driver
- Multer - File upload handling
- CORS - Cross-origin resource sharing
- Helmet - Security headers
- Morgan - HTTP request logging
- dotenv - Environment variable management
