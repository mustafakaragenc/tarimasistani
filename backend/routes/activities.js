const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getActivities,
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity
} = require('../controllers/activityController');

// Tüm rotalar korumalı
router.use(protect);

router.get('/', getActivities);
router.post('/', createActivity);
router.get('/:id', getActivity);
router.put('/:id', updateActivity);
router.delete('/:id', deleteActivity);

module.exports = router;
