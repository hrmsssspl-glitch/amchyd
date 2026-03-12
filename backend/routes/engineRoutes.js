const express = require('express');
const router = express.Router();
const {
    getEngines,
    getAllEngines,
    getEngineByAssetNumber,
    createEngine,
    updateEngine,
    deleteEngine,
    bulkDeleteEngines,
    exportEngines,
    importEngines,
    downloadEngineTemplate,
    getEngineStats,
    addInactiveFollowup,
    getFollowupReports,
    exportFollowupReports,
    previewFollowup,
    deleteFollowup
} = require('../controllers/engineController');
const { protect, adminOnly, superAdminOnly } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getEngines)
    .post(protect, adminOnly, createEngine);

router.get('/all', protect, getAllEngines);
router.get('/asset/:assetNumber', protect, getEngineByAssetNumber);
router.get('/stats', protect, getEngineStats);
router.get('/export', protect, exportEngines);
router.get('/template', protect, downloadEngineTemplate);
router.post('/import', protect, adminOnly, importEngines);
router.post('/bulk-delete', protect, adminOnly, bulkDeleteEngines);
router.get('/followups/reports', protect, getFollowupReports);
router.get('/followups/export', protect, exportFollowupReports);
router.get('/followups/:id/preview', protect, previewFollowup);
router.delete('/followups/:id', protect, adminOnly, deleteFollowup);

router.route('/:id')
    .put(protect, adminOnly, updateEngine)
    .delete(protect, adminOnly, deleteEngine);

router.put('/update/:id', protect, adminOnly, updateEngine);
router.post('/followup/:id', protect, addInactiveFollowup);
router.post('/:id/followups', protect, addInactiveFollowup);

module.exports = router;
