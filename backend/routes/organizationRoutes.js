const express = require('express');
const router = express.Router();
const {
    getOrganizations,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    exportOrganizations,
    importOrganizations,
} = require('../controllers/organizationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, adminOnly, getOrganizations)
    .post(protect, adminOnly, createOrganization);

router.get('/export', protect, adminOnly, exportOrganizations);
router.post('/import', protect, adminOnly, importOrganizations);

router.route('/:id')
    .put(protect, adminOnly, updateOrganization)
    .delete(protect, adminOnly, deleteOrganization);

module.exports = router;
