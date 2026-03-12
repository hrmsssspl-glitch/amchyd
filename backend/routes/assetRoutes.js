const express = require('express');
const router = express.Router();
const {
    getAssets,
    createAsset,
    updateAsset,
    deleteAsset,
    bulkDeleteAssets,
    exportAssets,
    importAssets,
    downloadAssetTemplate,
    getAssetStats,
    addInactiveFollowup,
    getFollowupReports,
    exportFollowupReports,
    previewFollowup,
    deleteFollowup
} = require('../controllers/assetController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getAssets)
    .post(protect, adminOnly, createAsset);

router.get('/stats', protect, getAssetStats);
router.get('/export', protect, exportAssets);
router.get('/template', protect, downloadAssetTemplate);
router.post('/import', protect, adminOnly, importAssets);
router.post('/bulk-delete', protect, adminOnly, bulkDeleteAssets);
router.get('/followups/reports', protect, getFollowupReports);
router.get('/followups/export', protect, exportFollowupReports);
router.get('/followups/:id/preview', protect, previewFollowup);
router.delete('/followups/:id', protect, adminOnly, deleteFollowup);
router.route('/:id')
    .put(protect, updateAsset)
    .delete(protect, adminOnly, deleteAsset);

router.post('/:id/followups', protect, addInactiveFollowup);

module.exports = router;
