const mongoose = require('mongoose');

// İşlem Kaydı Modeli - Ekim, Sulama, Hasat vb. işlemler
const activitySchema = new mongoose.Schema(
  {
    fieldId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Field',
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    activityType: {
      type: String,
      required: true,
      enum: ['Ekim', 'Sulama', 'GübreLeme', 'İlaçlama', 'Çapalama', 'Hasat', 'Depolama', 'Diğer']
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    duration: {
      type: Number,
      description: 'Faaliyet süresi (saat cinsinden)'
    },
    quantity: {
      type: Number,
      description: 'Miktar (su litri, gübre kg, vs.)'
    },
    unit: {
      type: String,
      default: 'kg'
    },
    weatherCondition: {
      type: String,
      enum: ['Güneşli', 'Bulutlu', 'Yağmurlu', 'Kar', 'Dolu', 'Rüzgârlı'],
      description: 'İşlem sırasındaki hava koşulu'
    },
    temperature: {
      type: Number,
      description: 'Sıcaklık (°C)'
    },
    humidity: {
      type: Number,
      description: 'Nemlilik oranı (%)',
      min: 0,
      max: 100
    },
    notes: {
      type: String,
      maxlength: 1000
    },
    images: [
      {
        type: String,
        description: 'Görsel URL'
      }
    ],
    cost: {
      type: Number,
      default: 0,
      description: 'İşlem maliyeti (₺)'
    },
    result: {
      type: String,
      maxlength: 500,
      description: 'İşlem sonucu'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// İndeks oluştur - performans için
activitySchema.index({ fieldId: 1, date: -1 });
activitySchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Activity', activitySchema);
