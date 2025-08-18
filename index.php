<?php
// Simple index page for NODNOL
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NODNOL - Addiction Recovery Support Platform</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            text-align: center; 
            padding: 50px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: rgba(255,255,255,0.1);
            padding: 40px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
        }
        h1 { font-size: 3em; margin-bottom: 20px; }
        .status { 
            background: rgba(0,255,0,0.2); 
            padding: 20px; 
            border-radius: 10px; 
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌟 NODNOL</h1>
        <h2>Addiction Recovery Support Platform</h2>
        <div class="status">
            <h3>✅ Development Server Running</h3>
            <p>PHP Version: <?php echo phpversion(); ?></p>
            <p>Server Time: <?php echo date('Y-m-d H:i:s'); ?></p>
            <p>Status: Early Development Phase</p>
        </div>
        <p>A comprehensive web application supporting individuals recovering from crystal methamphetamine addiction, along with powerful tools for healthcare professionals and case workers.</p>
        <div style="margin-top: 30px; font-size: 0.9em; opacity: 0.8;">
            <p>🚧 This is a development environment. The full application is under construction.</p>
        </div>
    </div>
</body>
</html>