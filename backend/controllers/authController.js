const User = require('../models/User');
const jwt = require('jsonwebtoken');

// @desc    Kayıt ol
// @route   POST /api/auth/register
// @access  Herkese Açık
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validasyon
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Lütfen tüm alanları doldurun'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Şifreler eşleşmiyor'
      });
    }

    // Kullanıcı zaten var mı kontrol et
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'Bu e-mail adresi zaten kullanılıyor'
      });
    }

    // Yeni kullanıcı oluştur
    user = await User.create({
      name,
      email,
      password
    });

    // Token oluştur
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Kayıt başarılı',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Giriş yap
// @route   POST /api/auth/login
// @access  Herkese Açık
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validasyon
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Lütfen e-mail ve şifre girin'
      });
    }

    // Kullanıcı kontrol et (şifre select: false olduğu için +password ile seç)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz kimlik bilgileri'
      });
    }

    // Şifre karşılaştır
    const isPasswordCorrect = await user.matchPassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz kimlik bilgileri'
      });
    }

    // Token oluştur
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Giriş başarılı',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mevcut kullanıcı bilgisini al
// @route   GET /api/auth/me
// @access  Korumalı
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
