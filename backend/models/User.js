const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

// Kullanıcı Modeli - Çiftçiler
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Lütfen adınızı girin'],
      trim: true,
      maxlength: 50
    },
    email: {
      type: String,
      required: [true, 'Lütfen e-mail adresinizi girin'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Lütfen geçerli bir e-mail adresi girin'
      ]
    },
    password: {
      type: String,
      required: [true, 'Lütfen şifre girin'],
      minlength: 6,
      select: false
    },
    phone: {
      type: String,
      trim: true
    },
    location: {
      type: String,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Şifre hashleme - kaydetmeden önce
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Şifre karşılaştırma metodu
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
