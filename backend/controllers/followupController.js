const Followup = require('../models/followupModel');
const asyncHandler = require('express-async-handler');
const XLSX = require('xlsx');

// @desc Get all followups with optional filters
// @route GET /api/followups
// @access Private (admin)
const getFollowups = asyncHandler(async (req, res) => {
    const { employeeId, assetId, search } = req.query;
    let query = {};
    if (employeeId) query.employeeId = employeeId;
    if (assetId) query.assetId = assetId;
    if (search) {
        query.$or = [
            { customerName: { $regex: search, $options: 'i' } },
            { remarks: { $regex: search, $options: 'i' } },
        ];
    }
    const followups = await Followup.find(query).populate('employeeId', 'employeeName');
    res.json({ followups });
});

// @desc Export followups to Excel
// @route GET /api/followups/export
// @access Private (admin)
const exportFollowups = asyncHandler(async (req, res) => {
    const followups = await Followup.find().populate('employeeId', 'employeeName');
    const data = followups.map(f => ({
        AssetId: f.assetId,
        EmployeeId: f.employeeId._id,
        EmployeeName: f.employeeId.employeeName,
        FollowupDate: f.followupDate,
        CustomerName: f.customerName,
        CustomerContactNumber: f.customerContactNumber,
        CustomerContactEmail: f.customerContactEmail,
        Remarks: f.remarks,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Followups');
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Disposition', 'attachment; filename="followups.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buf);
});

// @desc Preview a single followup (JSON)
// @route GET /api/followups/:id/preview
// @access Private (admin)
const previewFollowup = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const followup = await Followup.findById(id).populate('employeeId', 'employeeName');
    if (!followup) {
        res.status(404);
        throw new Error('Followup not found');
    }
    res.json({ followup });
});

// @desc Delete a followup (used when asset becomes active)
// @route DELETE /api/followups/:id
// @access Private (admin)
const deleteFollowup = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const followup = await Followup.findByIdAndDelete(id);
    if (!followup) {
        res.status(404);
        throw new Error('Followup not found');
    }
    res.json({ message: 'Followup deleted' });
});

module.exports = {
    getFollowups,
    exportFollowups,
    previewFollowup,
    deleteFollowup,
};
