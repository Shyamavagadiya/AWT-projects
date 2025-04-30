const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

// Get all jobs with optional filtering
router.get('/', async (req, res) => {
    try {
        const { title, location, jobType, minSalary, maxSalary } = req.query;
        
        // Build filter object
        const filter = {};
        
        if (title) {
            filter.title = { $regex: title, $options: 'i' };
        }
        
        if (location) {
            filter.location = { $regex: location, $options: 'i' };
        }
        
        if (jobType) {
            filter.jobType = jobType;
        }
        
        // Salary range filter
        if (minSalary || maxSalary) {
            filter.salary = {};
            
            if (minSalary) {
                filter.salary.$gte = parseInt(minSalary);
            }
            
            if (maxSalary) {
                filter.salary.$lte = parseInt(maxSalary);
            }
        }
        
        const jobs = await Job.find(filter);
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a specific job
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json(job);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new job
router.post('/', async (req, res) => {
    const job = new Job(req.body);
    
    try {
        const newJob = await job.save();
        res.status(201).json(newJob);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a job
router.put('/:id', async (req, res) => {
    try {
        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        
        if (!updatedJob) {
            return res.status(404).json({ message: 'Job not found' });
        }
        
        res.json(updatedJob);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a job
router.delete('/:id', async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        
        res.json({ message: 'Job deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;