"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const mongodb_1 = require("mongodb");
const multer_1 = __importDefault(require("multer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, helmet_1.default)()); // Security headers
app.use((0, cors_1.default)()); // Enable CORS for React app
app.use((0, morgan_1.default)('combined')); // Logging
app.use(express_1.default.json({ limit: '50mb' })); // Parse JSON bodies with increased limit
app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' })); // Parse URL-encoded bodies
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
const mongoOptions = {
    serverApi: {
        version: mongodb_1.ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
};
const client = new mongodb_1.MongoClient(process.env.MONGODB_URI, mongoOptions);
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        console.log(`MongoDB Connected: ${client.db().databaseName}`);
    }
    catch (error) {
        console.error('Database connection error:', error.message);
        process.exit(1);
    }
});
app.get('/weddings', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        const db = client.db('sitting-arrangement');
        const weddings = yield db.collection('sittingData').find({}).toArray();
        res.status(200).json(weddings);
    }
    catch (error) {
        console.error('Error fetching weddings:', error);
        res.status(500).json({ success: false, message: 'Error fetching weddings', error: error.message });
    }
}));
connectDB();
app.post('/api/upload', upload.single('jsonFile'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    try {
        const jsonString = req.file.buffer.toString('utf-8');
        const jsonData = JSON.parse(jsonString);
        yield client.connect();
        const db = client.db('sitting-arrangement');
        const collection = db.collection('sittingData');
        const result = yield collection.insertOne(jsonData);
        res.status(201).json({
            success: true,
            message: 'Data uploaded successfully',
            insertedId: result.insertedId,
            data: jsonData
        });
    }
    catch (error) {
        console.error('Error uploading data:', error);
        res.status(500).json({ success: false, message: 'Error uploading data', error: error.message });
    }
    finally {
        yield client.close();
    }
}));
app.get('/wedding-names', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        const db = client.db('sitting-arrangement');
        const weddingNames = yield db.collection('sittingData')
            .find({}, { projection: { weddingName: 1, _id: 0 } })
            .toArray();
        res.status(200).json(weddingNames);
    }
    catch (error) {
        console.error('Error fetching wedding names:', error);
        res.status(500).json({ success: false, message: 'Error fetching wedding names', error: error.message });
    }
}));
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map