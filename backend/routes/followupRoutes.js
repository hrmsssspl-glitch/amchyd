const express = require('express');
const { getFollowups, exportFollowups, previewFollowup, deleteFollowup } = require('../controllers/followupController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(admin);

router.get('/', getFollowups);
router.get('/export', exportFollowups);
router.get('/:id/preview', previewFollowup);
router.delete('/:id', deleteFollowup);

module.exports = router;
