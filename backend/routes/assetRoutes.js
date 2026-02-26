const express = require('express');
const router = express.Router();
const {
    getAssets,
    createAsset,
    updateAsset,
    deleteAsset,
    exportAssets,
    importAssets,
    downloadAssetTemplate
} = require('../controllers/assetController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getAssets)
    .post(protect, adminOnly, createAsset);

router.get('/export', protect, exportAssets);
router.get('/template', protect, downloadAssetTemplate);
router.post('/import', protect, adminOnly, importAssets);

router.route('/:id')
    .put(protect, adminOnly, updateAsset)
    .delete(protect, adminOnly, deleteAsset);

module.exports = router;
