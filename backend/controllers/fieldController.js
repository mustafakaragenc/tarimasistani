const Field = require('../models/Field');

// @desc    Tüm tarlaları getir (çiftçiye ait)
// @route   GET /api/fields
// @access  Korumalı
exports.getFields = async (req, res, next) => {
  try {
    const fields = await Field.find({ userId: req.user.id }).populate('userId', 'name email');

    res.status(200).json({
      success: true,
      count: fields.length,
      fields
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Tek bir tarla bilgisini getir
// @route   GET /api/fields/:id
// @access  Korumalı
exports.getField = async (req, res, next) => {
  try {
    const field = await Field.findById(req.params.id).populate('userId', 'name email');

    if (!field) {
      return res.status(404).json({
        success: false,
        message: 'Tarla bulunamadı'
      });
    }

    // Kendi tarlaları kontrol et
    if (field.userId._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Bu tarlaya erişim hakkınız yok'
      });
    }

    res.status(200).json({
      success: true,
      field
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Yeni tarla oluştur
// @route   POST /api/fields
// @access  Korumalı
exports.createField = async (req, res, next) => {
  try {
    // Kullanıcı ID'sini ekle
    req.body.userId = req.user.id;

    const field = await Field.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Tarla başarıyla oluşturuldu',
      field
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Tarla güncelle
// @route   PUT /api/fields/:id
// @access  Korumalı
exports.updateField = async (req, res, next) => {
  try {
    let field = await Field.findById(req.params.id);

    if (!field) {
      return res.status(404).json({
        success: false,
        message: 'Tarla bulunamadı'
      });
    }

    // Kendi tarlaları kontrol et
    if (field.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Bu tarlaya erişim hakkınız yok'
      });
    }

    field = await Field.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Tarla başarıyla güncellendi',
      field
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Tarla sil
// @route   DELETE /api/fields/:id
// @access  Korumalı
exports.deleteField = async (req, res, next) => {
  try {
    const field = await Field.findById(req.params.id);

    if (!field) {
      return res.status(404).json({
        success: false,
        message: 'Tarla bulunamadı'
      });
    }

    // Kendi tarlaları kontrol et
    if (field.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Bu tarlaya erişim hakkınız yok'
      });
    }

    await Field.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Tarla başarıyla silindi'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
