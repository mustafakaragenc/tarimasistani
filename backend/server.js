const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const errorHandler = require('./middleware/errorHandler');

// Routes import
const authRoutes = require('./routes/auth');
const fieldRoutes = require('./routes/fields');
const activityRoutes = require('./routes/activities');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// MongoDB Bağlantısı - Hata toleranslı
let mongoConnected = false;
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 5000
  })
  .then(() => {
    console.log('✅ MongoDB Bağlantısı başarılı');
    mongoConnected = true;
  })
  .catch((err) => {
    console.log('⚠️  MongoDB Bağlantı Hatası. Demo modu etkinleştirildi:', err.message);
    console.log('💾 Veriler hafızada tutulacaktır (test amaçlı)');
  });

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/fields', fieldRoutes);
app.use('/api/activities', activityRoutes);

// Sağlık kontrolü
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API Çalışıyor ✅',
    timestamp: new Date()
  });
});

// 404 Endpoint
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint bulunamadı'
  });
});

// Hata Handler Middleware (en sonda)
app.use(errorHandler);

// Server Başlat
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});
