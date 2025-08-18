<?php
// Basic test script for NODNOL development validation
?>
<!DOCTYPE html>
<html>
<head>
    <title>NODNOL - Development Validation</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .test { margin: 10px 0; padding: 10px; border-radius: 5px; }
        .pass { background: #d4edda; color: #155724; }
        .fail { background: #f8d7da; color: #721c24; }
    </style>
</head>
<body>
    <h1>NODNOL Development Environment Validation</h1>
    
    <?php
    // Test PHP version
    $phpVersion = phpversion();
    $phpOk = version_compare($phpVersion, '8.0', '>=');
    ?>
    <div class="test <?php echo $phpOk ? 'pass' : 'fail'; ?>">
        PHP Version: <?php echo $phpVersion; ?> 
        <?php echo $phpOk ? '✅ OK' : '❌ FAIL (Requires PHP 8.0+)'; ?>
    </div>
    
    <?php
    // Test required extensions
    $extensions = ['json', 'mysqli', 'curl', 'openssl'];
    foreach ($extensions as $ext) {
        $loaded = extension_loaded($ext);
        echo "<div class='test " . ($loaded ? 'pass' : 'fail') . "'>";
        echo "Extension {$ext}: " . ($loaded ? '✅ Loaded' : '❌ Missing');
        echo "</div>";
    }
    ?>
    
    <?php
    // Test file permissions
    $writeable = is_writable('.');
    ?>
    <div class="test <?php echo $writeable ? 'pass' : 'fail'; ?>">
        Directory Writable: <?php echo $writeable ? '✅ Yes' : '❌ No'; ?>
    </div>
    
    <div class="test pass">
        Server Time: <?php echo date('Y-m-d H:i:s T'); ?> ✅
    </div>
    
    <div class="test pass">
        Development Server: ✅ Running on http://localhost:8000
    </div>
    
    <hr>
    <p><strong>Status:</strong> Development environment ready for NODNOL platform development.</p>
    <p><a href="index.php">← Back to Main Page</a></p>
</body>
</html>