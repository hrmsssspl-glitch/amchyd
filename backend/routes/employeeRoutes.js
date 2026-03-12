const express = require('express');
const router = express.Router();
const {
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    exportEmployees,
    importEmployees,
    getNextEmployeeId
} = require('../controllers/employeeController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getEmployees)
    .post(protect, adminOnly, createEmployee);

router.get('/next-id', protect, getNextEmployeeId);
router.get('/export', protect, exportEmployees);
router.post('/import', protect, adminOnly, importEmployees);

router.route('/:id')
    .put(protect, adminOnly, updateEmployee)
    .delete(protect, adminOnly, deleteEmployee);

module.exports = router;
