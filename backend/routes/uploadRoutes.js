const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

router.post('/', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const file = req.files.file;
    const uploadDir = path.join(__dirname, '../uploads');

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }

    const fileName = `${Date.now()}_${file.name}`;
    const uploadPath = path.join(uploadDir, fileName);

    file.mv(uploadPath, (err) => {
        if (err) return res.status(500).send(err);
        res.json({ filePath: `/uploads/${fileName}` });
    });
});

module.exports = router;
