const express = require('express');
const router = express.Router();
const {
  getProperties,
  getPropertyById,
  getMyProperties,
  createProperty,
  updateProperty,
  deleteProperty,
} = require('../controllers/propertyController');
const { protect } = require('../middleware/authMiddleware');

router.get('/',       getProperties);
router.get('/my',     protect, getMyProperties);
router.get('/:id',    getPropertyById);
router.post('/',      protect, createProperty);
router.put('/:id',    protect, updateProperty);
router.delete('/:id', protect, deleteProperty);

module.exports = router;