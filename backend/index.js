import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import startupRoutes from './routes/startups.js';
import studentRoutes from './routes/students.js';
import hackathonRoutes from './routes/hackathons.js';
import opportunityRoutes from './routes/opportunities.js';
import categoryRoutes from './routes/categories.js';
import serviceRoutes from './routes/services.js';
import adminRoutes from './routes/admin.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/startups', startupRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/hackathons', hackathonRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'LaunchNexus API running' }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
