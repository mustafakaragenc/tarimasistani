const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getFields,
  getField,
  createField,
  updateField,
  deleteField
} = require('../controllers/fieldController');

// Tüm rotalar korumalı
router.use(protect);

router.get('/', getFields);
router.post('/', createField);
router.get('/:id', getField);
router.put('/:id', updateField);
router.delete('/:id', deleteField);

module.exports = router;
