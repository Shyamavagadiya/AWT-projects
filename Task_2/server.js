// Import required core modules
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Define server port
const PORT = process.env.PORT || 3000;

// Create HTML content for the pages
const dashboardHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            line-height: 1.6;
        }
        header {
            background-color: #4CAF50;
            color: white;
            padding: 1rem;
            text-align: center;
        }
        nav {
            background-color: #333;
            color: white;
            padding: 0.5rem;
            text-align: center;
        }
        nav a {
            color: white;
            margin: 0 10px;
            text-decoration: none;
        }
        nav a:hover {
            text-decoration: underline;
        }
        .container {
            width: 80%;
            margin: 2rem auto;
        }
        .dashboard-item {
            background-color: #f4f4f4;
            margin-bottom: 1rem;
            padding: 1rem;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <header>
        <h1>My Application</h1>
    </header>
    <nav>
        <a href="/">Dashboard</a>
        <a href="/about">About Us</a>
    </nav>
    <div class="container">
        <h2>Dashboard</h2>
        <div class="dashboard-item">
            <h3>Overview</h3>
            <p>Welcome to your dashboard. Here you can monitor key metrics and statistics.</p>
        </div>
        <div class="dashboard-item">
            <h3>Recent Activity</h3>
            <p>You have no recent activities to display.</p>
        </div>
        <div class="dashboard-item">
            <h3>Quick Stats</h3>
            <ul>
                <li>Users: 150</li>
                <li>Active Sessions: 24</li>
                <li>Total Visits: 1,345</li>
            </ul>
        </div>
    </div>
</body>
</html>
`;

const aboutHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About Us</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            line-height: 1.6;
        }
        header {
            background-color: #4CAF50;
            color: white;
            padding: 1rem;
            text-align: center;
        }
        nav {
            background-color: #333;
            color: white;
            padding: 0.5rem;
            text-align: center;
        }
        nav a {
            color: white;
            margin: 0 10px;
            text-decoration: none;
        }
        nav a:hover {
            text-decoration: underline;
        }
        .container {
            width: 80%;
            margin: 2rem auto;
        }
        .team-member {
            background-color: #f4f4f4;
            margin-bottom: 1rem;
            padding: 1rem;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <header>
        <h1>My Application</h1>
    </header>
    <nav>
        <a href="/">Dashboard</a>
        <a href="/about">About Us</a>
    </nav>
    <div class="container">
        <h2>About Us</h2>
        <p>We are a dedicated team passionate about creating innovative solutions for our users.</p>
        
        <h3>Our Mission</h3>
        <p>To provide high-quality, user-friendly applications that solve real-world problems.</p>
        
        <h3>Our Team</h3>
        <div class="team-member">
            <h4>John Doe</h4>
            <p>Founder & CEO</p>
            <p>John has over 15 years of experience in software development.</p>
        </div>
        <div class="team-member">
            <h4>Jane Smith</h4>
            <p>Lead Developer</p>
            <p>Jane specializes in backend development and database optimization.</p>
        </div>
        <div class="team-member">
            <h4>Bob Johnson</h4>
            <p>UX Designer</p>
            <p>Bob focuses on creating intuitive and engaging user experiences.</p>
        </div>
    </div>
</body>
</html>
`;

// Create 404 page
const notFoundHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - Page Not Found</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            line-height: 1.6;
            text-align: center;
        }
        .container {
            width: 80%;
            margin: 5rem auto;
        }
        h1 {
            font-size: 3rem;
            color: #E74C3C;
        }
        a {
            color: #3498DB;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>404 - Page Not Found</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
        <p><a href="/">Go back to Dashboard</a></p>
    </div>
</body>
</html>
`;

// Create the HTTP server
const server = http.createServer((req, res) => {
    // Parse the URL
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    console.log(`Request received for: ${pathname}`);

    // Set content type
    res.setHeader('Content-Type', 'text/html');

    // Route handling
    switch(pathname) {
        // Dashboard route (home page)
        case '/':
            res.statusCode = 200;
            res.end(dashboardHTML);
            break;
        
        // About us route
        case '/about':
            res.statusCode = 200;
            res.end(aboutHTML);
            break;
        
        // 404 for all other routes
        default:
            res.statusCode = 404;
            res.end(notFoundHTML);
            break;
    }
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log(`Available routes:`);
    console.log(`- Dashboard: http://localhost:${PORT}/`);
    console.log(`- About Us: http://localhost:${PORT}/about`);
});
