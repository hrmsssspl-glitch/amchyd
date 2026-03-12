const express = require('express');
const router = express.Router();
const Metadata = require('../../models/hrms/Metadata');
const { protect, adminOnly } = require('../../middleware/authMiddleware');

// Get all metadata or filter by type
router.get('/', protect, async (req, res) => {
    try {
        const { type, status } = req.query;
        const query = {};
        if (type) query.type = type;
        if (status) query.status = status;

        const metadata = await Metadata.find(query).sort({ type: 1, name: 1 });
        res.json(metadata);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new metadata
router.post('/', protect, adminOnly, async (req, res) => {
    try {
        const { type, name, code, description, status } = req.body;

        const exists = await Metadata.findOne({ type, name });
        if (exists) {
            return res.status(400).json({ message: 'Metadata with this name already exists for this type' });
        }

        const metadata = await Metadata.create({
            type, name, code, description, status
        });

        res.status(201).json(metadata);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update metadata
router.put('/:id', protect, adminOnly, async (req, res) => {
    try {
        const metadata = await Metadata.findById(req.params.id);
        if (!metadata) {
            return res.status(404).json({ message: 'Metadata not found' });
        }

        metadata.name = req.body.name || metadata.name;
        metadata.code = req.body.code || metadata.code;
        metadata.description = req.body.description || metadata.description;
        metadata.status = req.body.status || metadata.status;

        const updatedMetadata = await metadata.save();
        res.json(updatedMetadata);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete metadata
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const metadata = await Metadata.findById(req.params.id);
        if (!metadata) {
            return res.status(404).json({ message: 'Metadata not found' });
        }
        await metadata.deleteOne();
        res.json({ message: 'Metadata removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
