import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import DashboardData from './models/DashboardData.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io setup for Live Classroom
const io = new Server(server, {
  cors: {
    origin: '*', // For development, allow all origins
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Attach Socket.io to request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Basic Route
app.get('/', (req, res) => {
  res.send('R.K. W🌎RLD API is running...');
});

// Import API Routes (We will create these next)
import dashboardRoutes from './routes/dashboardRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import mockTestRoutes from './routes/mockTestRoutes.js';
import doubtRoutes from './routes/doubtRoutes.js';
import libraryRoutes from './routes/libraryRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import liveRoutes from './routes/liveRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import Message from './models/Message.js';

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/tests', mockTestRoutes);
app.use('/api/doubts', doubtRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/live', liveRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);

// Socket.io Logic
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join a specific class room
  socket.on('join-class', (classId) => {
    socket.join(classId);
    console.log(`User ${socket.id} joined class ${classId}`);
  });

  // Handle incoming chat messages
  socket.on('send-message', (data) => {
    // data should contain { classId, sender, text, isTeacher }
    console.log('Message received:', data);
    
    // Broadcast to everyone in the room
    io.to(data.classId).emit('receive-message', {
      id: Date.now(),
      sender: data.sender,
      text: data.text,
      isTeacher: data.isTeacher
    });
  });

  // Community Chat Logic
  socket.on('join-community', () => {
    socket.join('community-chat');
    console.log(`User ${socket.id} joined community chat`);
  });

  socket.on('send-community-message', async (data) => {
    try {
      // Save message to MongoDB
      const newMessage = new Message({
        senderName: data.senderName,
        senderRole: data.senderRole,
        text: data.text
      });
      const savedMessage = await newMessage.save();

      // Broadcast to everyone in the community room
      io.to('community-chat').emit('receive-community-message', savedMessage);
    } catch (error) {
      console.error('Error saving community message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
