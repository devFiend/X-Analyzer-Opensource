"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, helmet_1.default)()); // Security headers
app.use((0, cors_1.default)({ origin: 'http://localhost:5173', credentials: true })); // Allow Vite frontend
app.use((0, morgan_1.default)('dev')); // Logging
app.use(express_1.default.json()); // Parse JSON bodies
// Routes
app.use('/api/auth', authRoutes_1.default);
// Health Check Route
app.get('/', (req, res) => {
    res.send('X-Analyzer Backend API is running!');
});
app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
});
// Trigger nodemon restart
