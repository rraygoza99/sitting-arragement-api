const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { MongoClient, ServerApiVersion } = require('mongodb');
const multer = require('multer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS for React app
app.use(morgan('combined')); // Logging
app.use(express.json({ limit: '50mb' })); // Parse JSON bodies with increased limit
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // Parse URL-encoded bodies

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const mongoOptions = {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
};

const client = new MongoClient(process.env.MONGODB_URI, mongoOptions);

const connectDB = async () => {
  try {
    await client.connect();
    console.log(`MongoDB Connected: ${client.db().databaseName}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    throw error;
  }
};

// Add health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/weddings', async (req, res) => {
    try {
        // Check if MONGODB_URI exists
        if (!process.env.MONGODB_URI) {
            return res.status(500).json({ 
                success: false, 
                message: 'Database configuration error: MONGODB_URI not found' 
            });
        }

        await client.connect();
        const db = client.db('sitting-arrangement');
        const weddings = await db.collection('sittingData').find({}).toArray();
        res.status(200).json(weddings);
    } catch (error) {
        console.error('Error fetching weddings:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching weddings', 
            error: error.message 
        });
    }
});

app.post('/api/upload', upload.single('jsonFile'), async (req, res) => {
    if(!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    try{
        if (!process.env.MONGODB_URI) {
            return res.status(500).json({ 
                success: false, 
                message: 'Database configuration error: MONGODB_URI not found' 
            });
        }

        const jsonString = req.file.buffer.toString('utf-8');
        const jsonData = JSON.parse(jsonString);

        await client.connect();
        const db = client.db('sitting-arrangement');
        const collection = db.collection('sittingData');
        const result = await collection.insertOne(jsonData);

        res.status(201).json({
            success: true,
            message: 'Data uploaded successfully',
            insertedId: result.insertedId,
            data: jsonData
        });
    } catch (error) {
        console.error('Error uploading data:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error uploading data', 
            error: error.message 
        });
    }
});

app.get('/wedding-names', async (req, res) => {
    try {
        if (!process.env.MONGODB_URI) {
            return res.status(500).json({ 
                success: false, 
                message: 'Database configuration error: MONGODB_URI not found' 
            });
        }

        await client.connect();
        const db = client.db('sitting-arrangement');
        const weddingNames = await db.collection('sittingData')
            .find({}, { projection: { weddingName: 1, _id: 0 } })
            .toArray();
        res.status(200).json(weddingNames);
    } catch (error) {
        console.error('Error fetching wedding names:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching wedding names', 
            error: error.message 
        });
    }
});

// Initialize database connection
connectDB().catch(error => {
    console.error('Initial database connection failed:', error);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
