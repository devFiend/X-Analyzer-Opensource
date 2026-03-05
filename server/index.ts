import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes';
import syncRoutes from './routes/syncRoutes';


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // Allow Vite frontend
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sync', syncRoutes);

// Health Check Route
app.get('/', (req, res) => {
    res.send('X-Analyzer Backend API is running!');
});

app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
});
// Trigger nodemon restart