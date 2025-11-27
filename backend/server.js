const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http'); 
const { Server } = require('socket.io');
const connectDB = require('./config/db');

// ---> BỔ SUNG DÒNG NÀY <---
const pollRoutes = require('./routes/pollRoutes'); 

// 1. Cấu hình môi trường
dotenv.config();

// 2. Kết nối Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// 3. Middleware
app.use(cors()); 
app.use(express.json()); 

// 4. Routes
// ---> DÒNG GÂY LỖI CỦA BẠN ĐÃ ĐƯỢC SỬA <---
app.use('/api/polls', pollRoutes);

// 5. Tạo HTTP Server & Tích hợp Socket.io
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://pollingapp12.netlify.app", // Thay bằng URL Frontend của bạn
    methods: ["GET", "POST"]
  }
});

// 6. Lắng nghe kết nối Real-time
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Gắn io vào req để dùng trong Controller
app.use((req, res, next) => {
  req.io = io;
  next();
});

// 7. Khởi chạy Server
server.listen(PORT, () => {
  console.log(`Server đang chạy tại cổng ${PORT}`);
});