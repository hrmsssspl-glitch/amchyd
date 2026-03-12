const express = require('express');
const router = express.Router();
const Asset = require('../models/assetModel');
const Engine = require('../models/engineModel');
const { protect } = require('../middleware/authMiddleware');

// @desc    Check if asset number already exists in Asset Master or Engine Master
// @route   GET /api/check-duplicate/:assetNumber
// @access  Private
router.get('/:assetNumber', protect, async (req, res) => {
    try {
        const { assetNumber } = req.params;

        if (!assetNumber) {
            return res.status(400).json({ message: 'Asset number is required' });
        }

        const [existingAsset, existingEngine] = await Promise.all([
            Asset.findOne({ assetNumber: assetNumber.trim() }),
            Engine.findOne({ assetNumber: assetNumber.trim() })
        ]);

        if (existingAsset) {
            return res.json({
                exists: true,
                module: 'Asset Master',
                customerName: existingAsset.customerName
            });
        }

        if (existingEngine) {
            return res.json({
                exists: true,
                module: 'Engine Master',
                customerName: existingEngine.customerName
            });
        }

        res.json({ exists: false });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
