const express = require('express');
const router = express.Router();
const {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    exportUsers,
    importUsers,
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, adminOnly, getUsers)
    .post(protect, adminOnly, createUser);

router.get('/export', protect, adminOnly, exportUsers);
router.post('/import', protect, adminOnly, importUsers);

router.route('/:id')
    .put(protect, adminOnly, updateUser)
    .delete(protect, adminOnly, deleteUser);

module.exports = router;
