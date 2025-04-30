const mongoose = require('mongoose');
const Job = require('./models/Job');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/jobsearchdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected for seeding'))
.catch(err => console.log('MongoDB connection error:', err));

// Sample job data
const jobData = [
    {
        title: 'Frontend Developer',
        company: 'TechCorp',
        location: 'New York, NY',
        description: 'We are looking for a skilled frontend developer to join our team.',
        requirements: ['React', 'JavaScript', 'HTML', 'CSS'],
        salary: 85000,
        jobType: 'Full-time'
    },
    {
        title: 'Backend Developer',
        company: 'DataSystems',
        location: 'San Francisco, CA',
        description: 'Experienced backend developer needed for our growing team.',
        requirements: ['Node.js', 'Express', 'MongoDB', 'API Development'],
        salary: 95000,
        jobType: 'Full-time'
    },
    {
        title: 'UI/UX Designer',
        company: 'CreativeMinds',
        location: 'Chicago, IL',
        description: 'Looking for a creative UI/UX designer to improve our product experience.',
        requirements: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
        salary: 80000,
        jobType: 'Full-time'
    },
    {
        title: 'Data Scientist Intern',
        company: 'AnalyticsPro',
        location: 'Remote',
        description: 'Internship opportunity for aspiring data scientists.',
        requirements: ['Python', 'Statistics', 'Machine Learning basics'],
        salary: 45000,
        jobType: 'Internship'
    },
    {
        title: 'DevOps Engineer',
        company: 'CloudTech',
        location: 'Austin, TX',
        description: 'Join our DevOps team to improve our infrastructure and deployment processes.',
        requirements: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
        salary: 110000,
        jobType: 'Full-time'
    },
    {
        title: 'Part-time Web Developer',
        company: 'SmallBiz Solutions',
        location: 'Boston, MA',
        description: 'Part-time role for an experienced web developer.',
        requirements: ['JavaScript', 'React', 'Responsive Design'],
        salary: 40000,
        jobType: 'Part-time'
    }
];

// Seed the database
const seedDB = async () => {
    try {
        // Clear existing data
        await Job.deleteMany({});
        
        // Insert new data
        await Job.insertMany(jobData);
        
        console.log('Database seeded successfully');
        mongoose.connection.close();
    } catch (err) {
        console.error('Error seeding database:', err);
        mongoose.connection.close();
    }
};

seedDB();