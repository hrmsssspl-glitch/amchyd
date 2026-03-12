const express = require('express');
const router = express.Router();
const JobOpening = require('../../models/hrms/JobOpening');
const Candidate = require('../../models/hrms/Candidate');
const Interview = require('../../models/hrms/Interview');
const OfferLetter = require('../../models/hrms/OfferLetter');
const Onboarding = require('../../models/hrms/Onboarding');

// --- JOB OPENINGS ---

// @route   GET /api/recruitment/jobs
// @desc    Get all Job Openings
router.get('/jobs', async (req, res) => {
    try {
        const jobs = await JobOpening.find().sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/recruitment/jobs
// @desc    Create a new Job Posting
router.post('/jobs', async (req, res) => {
    try {
        const job = new JobOpening(req.body);
        await job.save();
        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// --- CANDIDATES ---

// @route   GET /api/recruitment/candidates
// @desc    Get All Candidates
router.get('/candidates', async (req, res) => {
    const { status, jobCode } = req.query;
    let query = {};
    if (status) query.status = status;
    if (jobCode) query.jobCode = jobCode;

    try {
        const candidates = await Candidate.find(query).sort({ createdAt: -1 });
        res.json(candidates);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/recruitment/candidates
// @desc    Add a Candidate
router.post('/candidates', async (req, res) => {
    try {
        const candidate = new Candidate(req.body);
        await candidate.save();
        res.json(candidate);
    } catch (err) {
        if (err.code === 11000) return res.status(400).json({ msg: 'Candidate ID must be unique' });
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/recruitment/candidates/:id
// @desc    Update Candidate Status / Profile
router.put('/candidates/:id', async (req, res) => {
    try {
        const candidate = await Candidate.findOneAndUpdate(
            { id: req.params.id }, // Use custom 'id' field
            req.body,
            { new: true }
        );
        res.json(candidate);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});


// --- INTERVIEWS ---

// @route   GET /api/recruitment/interviews
// @desc    Get Interviews (Optional filter by candidate or date)
router.get('/interviews', async (req, res) => {
    try {
        const interviews = await Interview.find().sort({ date: 1 });
        res.json(interviews);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/recruitment/interviews
// @desc    Schedule New Interview
router.post('/interviews', async (req, res) => {
    try {
        const interview = new Interview(req.body);
        await interview.save();

        // Update Candidate Status automatically?
        await Candidate.findOneAndUpdate({ id: req.body.candidateId }, { status: 'Interview Scheduled' });

        res.json(interview);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/recruitment/interviews/:id/feedback
// @desc    Update Interview Outcome/Feedback
router.put('/interviews/:id/feedback', async (req, res) => {
    const { outcome, feedback, rating } = req.body;
    try {
        const interview = await Interview.findOneAndUpdate(
            { id: req.params.id },
            { outcome, feedback, rating, status: 'Completed' },
            { new: true }
        );

        // If outcome is 'Select', update candidate?
        if (outcome === 'Select') {
            await Candidate.findOneAndUpdate({ id: interview.candidateId }, { status: 'Selected' });
        } else if (outcome === 'Reject') {
            await Candidate.findOneAndUpdate({ id: interview.candidateId }, { status: 'Rejected' });
        }

        res.json(interview);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});


// --- OFFERS ---

// @route   POST /api/recruitment/offers
// @desc    Generate Offer
router.post('/offers', async (req, res) => {
    try {
        const offer = new OfferLetter(req.body);
        await offer.save();

        // Update Candidate
        await Candidate.findOneAndUpdate(
            { id: req.body.candidateId },
            { status: 'Offer Released' }
        );

        res.json(offer);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});


// --- ONBOARDING ---

// @route   GET /api/recruitment/onboarding
// @desc    Get Onboarding Status
router.get('/onboarding', async (req, res) => {
    try {
        const list = await Onboarding.find().sort({ joiningDate: 1 });
        res.json(list);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/recruitment/onboarding/start
// @desc    Initiate Onboarding for a Candidate
router.post('/onboarding/start', async (req, res) => {
    try {
        // Typically triggered after Offer Accepted
        const { candidateId, joiningDate, name, jobCode } = req.body;

        // Default Checklist
        const defaultChecklist = [
            { step: 'Document Submission', status: 'Pending', assignedTo: 'HR' },
            { step: 'IT Asset Allocation', status: 'Pending', assignedTo: 'IT' },
            { step: 'Email Creation', status: 'Pending', assignedTo: 'IT' },
            { step: 'Introduction Session', status: 'Pending', assignedTo: 'HR' },
            { step: 'Badge Issue', status: 'Pending', assignedTo: 'Admin' }
        ];

        const onboarding = new Onboarding({
            id: `ONB-${Date.now()}`,
            candidateId,
            name,
            jobCode,
            joiningDate,
            checklist: defaultChecklist,
            overallStatus: 'In Progress'
        });

        await onboarding.save();
        res.json(onboarding);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// --- ANALYTICS ---

// @route   GET /api/recruitment/stats
// @desc    Get Recruitment Dashboard Stats
router.get('/stats', async (req, res) => {
    try {
        const totalOpenings = await JobOpening.countDocuments({ status: 'Open' });
        const totalCandidates = await Candidate.countDocuments();
        const activeInterviews = await Interview.countDocuments({ status: 'Scheduled' });
        const pendingOffers = await OfferLetter.countDocuments({ status: 'Issued' });

        // Pipeline Breakdown
        const pipeline = await Candidate.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        res.json({
            totalOpenings,
            totalCandidates,
            activeInterviews,
            pendingOffers,
            pipeline
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
