const Activity = require('../models/Activity');
const Field = require('../models/Field');

// @desc    Belirli bir tarla için tüm aktiviteleri getir
// @route   GET /api/activities?fieldId=:fieldId
// @access  Korumalı
exports.getActivities = async (req, res, next) => {
  try {
    const { fieldId, activityType, sortBy } = req.query;

    let filter = { userId: req.user.id };

    if (fieldId) {
      // Tarlanın sahibi olup olmadığını kontrol et
      const field = await Field.findById(fieldId);
      if (!field || field.userId.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Bu tarlayla ilgili aktiviteleri görüntüleme hakkınız yok'
        });
      }
      filter.fieldId = fieldId;
    }

    if (activityType) {
      filter.activityType = activityType;
    }

    // Sıralama (tarih: en yeni ilk)
    let sortOption = { date: -1 };
    if (sortBy === 'oldest') {
      sortOption = { date: 1 };
    } else if (sortBy === 'cost') {
      sortOption = { cost: -1 };
    }

    const activities = await Activity.find(filter)
      .populate('fieldId', 'cropName area areaUnit')
      .populate('userId', 'name email')
      .sort(sortOption);

    res.status(200).json({
      success: true,
      count: activities.length,
      activities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Tek bir aktivite getir
// @route   GET /api/activities/:id
// @access  Korumalı
exports.getActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id)
      .populate('fieldId', 'cropName area areaUnit')
      .populate('userId', 'name email');

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Aktivite bulunamadı'
      });
    }

    // Kendi aktivitesi mi kontrol et
    if (activity.userId._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Bu aktiviteye erişim hakkınız yok'
      });
    }

    res.status(200).json({
      success: true,
      activity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Yeni aktivite oluştur
// @route   POST /api/activities
// @access  Korumalı
exports.createActivity = async (req, res, next) => {
  try {
    const { fieldId } = req.body;

    // Tarla kontrol
    const field = await Field.findById(fieldId);
    if (!field || field.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Bu tarlayla işlem yapma hakkınız yok'
      });
    }

    // Kullanıcı ID'sini ekle
    req.body.userId = req.user.id;

    const activity = await Activity.create(req.body);

    const populatedActivity = await Activity.findById(activity._id)
      .populate('fieldId', 'cropName area areaUnit')
      .populate('userId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Aktivite başarıyla oluşturuldu',
      activity: populatedActivity
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Aktivite güncelle
// @route   PUT /api/activities/:id
// @access  Korumalı
exports.updateActivity = async (req, res, next) => {
  try {
    let activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Aktivite bulunamadı'
      });
    }

    // Kendi aktivitesi mi kontrol et
    if (activity.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Bu aktiviteyi güncelleme hakkınız yok'
      });
    }

    activity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('fieldId').populate('userId');

    res.status(200).json({
      success: true,
      message: 'Aktivite başarıyla güncellendi',
      activity
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Aktivite sil
// @route   DELETE /api/activities/:id
// @access  Korumalı
exports.deleteActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Aktivite bulunamadı'
      });
    }

    // Kendi aktivitesi mi kontrol et
    if (activity.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Bu aktiviteyi silme hakkınız yok'
      });
    }

    await Activity.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Aktivite başarıyla silindi'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
