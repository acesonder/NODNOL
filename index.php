<?php
// NODNOL - Stage 1 Database Initialization & Configuration
session_start();

// Configuration
$default_db_user = 'chance';
$default_db_pass = 'chance';
$default_db_host = 'localhost';
$default_db_name = 'nodnol_db';

// Handle form submissions
$message = '';
$error = '';
$db_connection = null;

if ($_POST) {
    $action = $_POST['action'] ?? '';
    $db_host = $_POST['db_host'] ?? $default_db_host;
    $db_user = $_POST['db_user'] ?? $default_db_user;
    $db_pass = $_POST['db_pass'] ?? $default_db_pass;
    $db_name = $_POST['db_name'] ?? $default_db_name;
    
    switch ($action) {
        case 'test_connection':
            try {
                $db_connection = new mysqli($db_host, $db_user, $db_pass);
                if ($db_connection->connect_error) {
                    throw new Exception("Connection failed: " . $db_connection->connect_error);
                }
                $message = "✅ Database connection successful!";
            } catch (Exception $e) {
                $error = "❌ Database connection failed: " . $e->getMessage();
            }
            break;
            
        case 'create_database':
            try {
                $db_connection = new mysqli($db_host, $db_user, $db_pass);
                if ($db_connection->connect_error) {
                    throw new Exception("Connection failed: " . $db_connection->connect_error);
                }
                
                $sql = "CREATE DATABASE IF NOT EXISTS `" . $db_connection->real_escape_string($db_name) . "`";
                if ($db_connection->query($sql) === TRUE) {
                    $message = "✅ Database '$db_name' created successfully!";
                } else {
                    throw new Exception("Error creating database: " . $db_connection->error);
                }
            } catch (Exception $e) {
                $error = "❌ Database creation failed: " . $e->getMessage();
            }
            break;
            
        case 'initialize_tables':
            try {
                $db_connection = new mysqli($db_host, $db_user, $db_pass, $db_name);
                if ($db_connection->connect_error) {
                    throw new Exception("Connection failed: " . $db_connection->connect_error);
                }
                
                // Create initial tables for NODNOL platform
                $tables = [
                    "CREATE TABLE IF NOT EXISTS users (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        username VARCHAR(50) UNIQUE NOT NULL,
                        email VARCHAR(100) UNIQUE NOT NULL,
                        password_hash VARCHAR(255) NOT NULL,
                        role ENUM('client', 'staff', 'admin', 'provider') NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        is_active BOOLEAN DEFAULT TRUE
                    )",
                    "CREATE TABLE IF NOT EXISTS user_profiles (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        user_id INT NOT NULL,
                        first_name VARCHAR(50),
                        last_name VARCHAR(50),
                        phone VARCHAR(20),
                        emergency_contact VARCHAR(255),
                        accessibility_needs TEXT,
                        privacy_settings JSON,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                    )",
                    "CREATE TABLE IF NOT EXISTS system_config (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        config_key VARCHAR(100) UNIQUE NOT NULL,
                        config_value TEXT,
                        description TEXT,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                    )"
                ];
                
                foreach ($tables as $table_sql) {
                    if (!$db_connection->query($table_sql)) {
                        throw new Exception("Error creating table: " . $db_connection->error);
                    }
                }
                
                $message = "✅ Database tables initialized successfully!";
            } catch (Exception $e) {
                $error = "❌ Table initialization failed: " . $e->getMessage();
            }
            break;
            
        case 'demo_data':
            try {
                $db_connection = new mysqli($db_host, $db_user, $db_pass, $db_name);
                if ($db_connection->connect_error) {
                    throw new Exception("Connection failed: " . $db_connection->connect_error);
                }
                
                // Insert demo admin user
                $demo_password = password_hash('admin123', PASSWORD_DEFAULT);
                $sql = "INSERT IGNORE INTO users (username, email, password_hash, role) VALUES ('admin', 'admin@nodnol.local', '$demo_password', 'admin')";
                
                if ($db_connection->query($sql)) {
                    $message = "✅ Demo data inserted! Admin user: admin / admin123";
                } else {
                    throw new Exception("Error inserting demo data: " . $db_connection->error);
                }
            } catch (Exception $e) {
                $error = "❌ Demo data insertion failed: " . $e->getMessage();
            }
            break;
    }
}

// System status checks
$php_version = phpversion();
$php_ok = version_compare($php_version, '8.0', '>=');
$extensions = ['mysqli', 'json', 'openssl', 'curl'];
$ext_status = [];
foreach ($extensions as $ext) {
    $ext_status[$ext] = extension_loaded($ext);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NODNOL - Database Initialization & Setup</title>
    <style>
        :root {
            --bg: #0b0b0b;
            --surface: #121212;
            --surface-2: #171717;
            --ink: #f2f2f2;
            --muted: #b3b3b3;
            --line: #2a2a2a;
            --cta: #ff5252;
            --cta-2: #ffb020;
            --glow: #00e5ff;
            --positive: #2ecc71;
            --warn: #f1c40f;
            --error: #e74c3c;
            --radius: 16px;
            --shadow: 0 14px 40px rgba(0,0,0,.45);
        }
        
        * { box-sizing: border-box; }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, var(--bg) 0%, var(--surface-2) 100%);
            color: var(--ink);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        
        .header h1 {
            font-size: 3em;
            margin: 0;
            background: linear-gradient(45deg, var(--cta), var(--glow));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-shadow: 0 0 20px rgba(0, 229, 255, 0.3);
        }
        
        .header p {
            color: var(--muted);
            font-size: 1.2em;
            margin: 10px 0;
        }
        
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .card {
            background: var(--surface);
            border: 1px solid var(--line);
            border-radius: var(--radius);
            padding: 25px;
            box-shadow: var(--shadow);
        }
        
        .card h2 {
            margin-top: 0;
            color: var(--glow);
            border-bottom: 2px solid var(--line);
            padding-bottom: 10px;
        }
        
        .status-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        
        .status-item {
            background: var(--surface-2);
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid var(--line);
        }
        
        .status-item.pass {
            border-left-color: var(--positive);
        }
        
        .status-item.fail {
            border-left-color: var(--error);
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 5px;
            color: var(--muted);
        }
        
        .form-group input {
            width: 100%;
            padding: 12px;
            background: var(--surface-2);
            border: 1px solid var(--line);
            border-radius: 8px;
            color: var(--ink);
            font-size: 16px;
        }
        
        .form-group input:focus {
            outline: none;
            border-color: var(--glow);
            box-shadow: 0 0 0 2px rgba(0, 229, 255, 0.2);
        }
        
        .btn {
            background: linear-gradient(45deg, var(--cta), var(--cta-2));
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            margin: 5px;
            transition: all 0.3s ease;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(255, 82, 82, 0.3);
        }
        
        .btn.secondary {
            background: linear-gradient(45deg, var(--surface-2), var(--line));
        }
        
        .message {
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
        }
        
        .message.success {
            background: rgba(46, 204, 113, 0.1);
            color: var(--positive);
            border: 1px solid var(--positive);
        }
        
        .message.error {
            background: rgba(231, 76, 60, 0.1);
            color: var(--error);
            border: 1px solid var(--error);
        }
        
        .troubleshooting {
            background: var(--surface-2);
            padding: 20px;
            border-radius: var(--radius);
            margin: 20px 0;
        }
        
        .troubleshooting h3 {
            color: var(--warn);
            margin-top: 0;
        }
        
        .troubleshooting ul {
            margin: 10px 0;
            padding-left: 20px;
        }
        
        .troubleshooting li {
            margin: 8px 0;
            color: var(--muted);
        }
        
        @media (max-width: 768px) {
            .grid {
                grid-template-columns: 1fr;
            }
            
            .header h1 {
                font-size: 2em;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌟 NODNOL</h1>
            <p>Database Initialization & Configuration System</p>
            <p><small>Addiction Recovery Support Platform - Stage 1 Setup</small></p>
        </div>
        
        <?php if ($message): ?>
            <div class="message success"><?php echo htmlspecialchars($message); ?></div>
        <?php endif; ?>
        
        <?php if ($error): ?>
            <div class="message error"><?php echo htmlspecialchars($error); ?></div>
        <?php endif; ?>
        
        <div class="grid">
            <!-- System Status -->
            <div class="card">
                <h2>🔧 System Status</h2>
                <div class="status-grid">
                    <div class="status-item <?php echo $php_ok ? 'pass' : 'fail'; ?>">
                        <strong>PHP Version</strong><br>
                        <?php echo $php_version; ?> <?php echo $php_ok ? '✅' : '❌'; ?>
                    </div>
                    <?php foreach ($ext_status as $ext => $loaded): ?>
                    <div class="status-item <?php echo $loaded ? 'pass' : 'fail'; ?>">
                        <strong><?php echo ucfirst($ext); ?></strong><br>
                        <?php echo $loaded ? '✅ Loaded' : '❌ Missing'; ?>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>
            
            <!-- Database Configuration -->
            <div class="card">
                <h2>🗄️ Database Configuration</h2>
                <form method="POST">
                    <div class="form-group">
                        <label for="db_host">Database Host:</label>
                        <input type="text" id="db_host" name="db_host" value="<?php echo htmlspecialchars($default_db_host); ?>" required>
                    </div>
                    <div class="form-group">
                        <label for="db_user">Username:</label>
                        <input type="text" id="db_user" name="db_user" value="<?php echo htmlspecialchars($default_db_user); ?>" required>
                    </div>
                    <div class="form-group">
                        <label for="db_pass">Password:</label>
                        <input type="password" id="db_pass" name="db_pass" value="<?php echo htmlspecialchars($default_db_pass); ?>" required>
                    </div>
                    <div class="form-group">
                        <label for="db_name">Database Name:</label>
                        <input type="text" id="db_name" name="db_name" value="<?php echo htmlspecialchars($default_db_name); ?>" required>
                    </div>
                    
                    <button type="submit" name="action" value="test_connection" class="btn">Test Connection</button>
                    <button type="submit" name="action" value="create_database" class="btn">Create Database</button>
                    <button type="submit" name="action" value="initialize_tables" class="btn">Initialize Tables</button>
                    <button type="submit" name="action" value="demo_data" class="btn secondary">Load Demo Data</button>
                </form>
            </div>
        </div>
        
        <!-- AI Troubleshooting -->
        <div class="troubleshooting">
            <h3>🤖 AI-Powered Troubleshooting</h3>
            <p><strong>Common Issues & Solutions:</strong></p>
            <ul>
                <li><strong>Connection Failed:</strong> Check if MySQL/MariaDB is running: <code>sudo systemctl start mysql</code></li>
                <li><strong>Access Denied:</strong> Create user: <code>CREATE USER 'chance'@'localhost' IDENTIFIED BY 'chance';</code></li>
                <li><strong>Permission Issues:</strong> Grant privileges: <code>GRANT ALL PRIVILEGES ON *.* TO 'chance'@'localhost';</code></li>
                <li><strong>PHP Extensions Missing:</strong> Install with: <code>sudo apt-get install php-mysqli php-json php-openssl php-curl</code></li>
                <li><strong>Database Not Found:</strong> Ensure database exists or use 'Create Database' button above</li>
                <li><strong>Port Issues:</strong> Check if MySQL is running on port 3306: <code>netstat -an | grep 3306</code></li>
            </ul>
            
            <p><strong>Quick Diagnostics:</strong></p>
            <ul>
                <li>Check MySQL status: <code>sudo systemctl status mysql</code></li>
                <li>Test connection manually: <code>mysql -u chance -p</code></li>
                <li>View MySQL error log: <code>sudo tail -f /var/log/mysql/error.log</code></li>
                <li>Check PHP configuration: <code>php -m | grep mysqli</code></li>
            </ul>
        </div>
        
        <!-- Next Steps -->
        <div class="card">
            <h2>📋 Next Steps - Phase 1 Foundation</h2>
            <p>Once database is initialized, the following features will be developed:</p>
            <ul>
                <li>✅ Database design and setup</li>
                <li>🔄 Security implementation (authentication, encryption)</li>
                <li>🔄 Basic UI framework</li>
                <li>🔄 Authentication system</li>
                <li>🔄 Accessibility features</li>
            </ul>
            
            <div style="margin-top: 20px;">
                <a href="setup.php" class="btn">Continue to Setup</a>
                <a href="<?php echo htmlspecialchars('OUTSINC/theme_template.html'); ?>" class="btn secondary">View Theme Template</a>
            </div>
        </div>
    </div>
    
    <script>
        // Auto-refresh connection status
        document.addEventListener('DOMContentLoaded', function() {
            // Add some interactive features
            const buttons = document.querySelectorAll('.btn');
            buttons.forEach(button => {
                button.addEventListener('click', function() {
                    if (this.type === 'submit') {
                        this.innerHTML = '⏳ Processing...';
                        this.disabled = true;
                    }
                });
            });
            
            // Form validation
            const form = document.querySelector('form');
            if (form) {
                form.addEventListener('submit', function(e) {
                    const requiredFields = this.querySelectorAll('input[required]');
                    let valid = true;
                    
                    requiredFields.forEach(field => {
                        if (!field.value.trim()) {
                            field.style.borderColor = 'var(--error)';
                            valid = false;
                        } else {
                            field.style.borderColor = 'var(--line)';
                        }
                    });
                    
                    if (!valid) {
                        e.preventDefault();
                        alert('Please fill in all required fields.');
                    }
                });
            }
        });
    </script>
</body>
</html>