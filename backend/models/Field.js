const mongoose = require('mongoose');

// Tarla/Ürün Modeli
const fieldSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    cropName: {
      type: String,
      required: [true, 'Ürün adı zorunludur'],
      trim: true,
      enum: ['Buğday', 'Arpa', 'Mısır', 'Pamuk', 'Domates', 'Biber', 'Patlıcan', 'Soğan', 'Patates', 'Diğer']
    },
    area: {
      type: Number,
      required: [true, 'Tarlı alanı zorunludur'],
      min: 0.1
    },
    areaUnit: {
      type: String,
      default: 'dönüm',
      enum: ['dönüm', 'hektar', 'm²']
    },
    plantingDate: {
      type: Date,
      required: true
    },
    expectedHarvestDate: {
      type: Date,
      required: true
    },
    soilType: {
      type: String,
      enum: ['Killi', 'Kumlu', 'Tınlı', 'Organik'],
      default: 'Tınlı'
    },
    waterRequirement: {
      type: String,
      default: 'Normal'
    },
    status: {
      type: String,
      enum: ['Hazırlık', 'Ekim', 'Büyüme', 'Olgunlaşma', 'Hasat', 'Tamamlandı'],
      default: 'Ekim'
    },
    description: {
      type: String,
      maxlength: 500
    },
    notes: [{
      date: Date,
      content: String
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Tarla silindi zaman Activity kayıtlarını sil
fieldSchema.pre('deleteOne', async function(next) {
  await mongoose.model('Activity').deleteMany({ fieldId: this._id });
  next();
});

module.exports = mongoose.model('Field', fieldSchema);
