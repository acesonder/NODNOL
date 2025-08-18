<?php
// NODNOL - Setup and Authentication System
session_start();

// Database configuration (should match index.php)
$db_host = 'localhost';
$db_user = 'chance';
$db_pass = 'chance';
$db_name = 'nodnol_db';

$message = '';
$error = '';

// Check if database exists and is initialized
function checkDatabaseStatus($host, $user, $pass, $dbname) {
    try {
        $connection = new mysqli($host, $user, $pass, $dbname);
        if ($connection->connect_error) {
            return false;
        }
        
        // Check if required tables exist
        $tables = ['users', 'user_profiles', 'system_config'];
        foreach ($tables as $table) {
            $result = $connection->query("SHOW TABLES LIKE '$table'");
            if ($result->num_rows == 0) {
                return false;
            }
        }
        
        $connection->close();
        return true;
    } catch (Exception $e) {
        return false;
    }
}

$db_ready = checkDatabaseStatus($db_host, $db_user, $db_pass, $db_name);

// Handle authentication setup
if ($_POST && $db_ready) {
    $action = $_POST['action'] ?? '';
    
    if ($action === 'create_admin') {
        $username = $_POST['username'] ?? '';
        $email = $_POST['email'] ?? '';
        $password = $_POST['password'] ?? '';
        $confirm_password = $_POST['confirm_password'] ?? '';
        
        if ($password !== $confirm_password) {
            $error = "Passwords do not match.";
        } elseif (strlen($password) < 8) {
            $error = "Password must be at least 8 characters long.";
        } else {
            try {
                $connection = new mysqli($db_host, $db_user, $db_pass, $db_name);
                if ($connection->connect_error) {
                    throw new Exception("Database connection failed");
                }
                
                // Check if admin already exists
                $check_sql = "SELECT id FROM users WHERE role = 'admin' LIMIT 1";
                $result = $connection->query($check_sql);
                
                if ($result->num_rows > 0) {
                    $error = "Admin user already exists. Use login instead.";
                } else {
                    $password_hash = password_hash($password, PASSWORD_DEFAULT);
                    $stmt = $connection->prepare("INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, 'admin')");
                    $stmt->bind_param("sss", $username, $email, $password_hash);
                    
                    if ($stmt->execute()) {
                        $message = "Admin user created successfully! You can now login.";
                    } else {
                        throw new Exception("Failed to create admin user");
                    }
                }
                
                $connection->close();
            } catch (Exception $e) {
                $error = "Error: " . $e->getMessage();
            }
        }
    } elseif ($action === 'login') {
        $username = $_POST['username'] ?? '';
        $password = $_POST['password'] ?? '';
        
        try {
            $connection = new mysqli($db_host, $db_user, $db_pass, $db_name);
            if ($connection->connect_error) {
                throw new Exception("Database connection failed");
            }
            
            $stmt = $connection->prepare("SELECT id, username, password_hash, role FROM users WHERE username = ? AND is_active = 1");
            $stmt->bind_param("s", $username);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($user = $result->fetch_assoc()) {
                if (password_verify($password, $user['password_hash'])) {
                    $_SESSION['user_id'] = $user['id'];
                    $_SESSION['username'] = $user['username'];
                    $_SESSION['role'] = $user['role'];
                    header('Location: dashboard.php');
                    exit;
                } else {
                    $error = "Invalid password.";
                }
            } else {
                $error = "User not found or inactive.";
            }
            
            $connection->close();
        } catch (Exception $e) {
            $error = "Login error: " . $e->getMessage();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NODNOL - Authentication Setup</title>
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
            max-width: 800px;
            margin: 0 auto;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        
        .header h1 {
            font-size: 2.5em;
            margin: 0;
            background: linear-gradient(45deg, var(--cta), var(--glow));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-shadow: 0 0 20px rgba(0, 229, 255, 0.3);
        }
        
        .card {
            background: var(--surface);
            border: 1px solid var(--line);
            border-radius: var(--radius);
            padding: 30px;
            box-shadow: var(--shadow);
            margin-bottom: 20px;
        }
        
        .card h2 {
            margin-top: 0;
            color: var(--glow);
            border-bottom: 2px solid var(--line);
            padding-bottom: 10px;
        }
        
        .status-warning {
            background: rgba(241, 196, 15, 0.1);
            color: var(--warn);
            border: 1px solid var(--warn);
            padding: 20px;
            border-radius: var(--radius);
            margin-bottom: 30px;
            text-align: center;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 5px;
            color: var(--muted);
            font-weight: 500;
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
            width: 100%;
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
        
        .tabs {
            display: flex;
            margin-bottom: 20px;
            border-bottom: 1px solid var(--line);
        }
        
        .tab {
            padding: 10px 20px;
            cursor: pointer;
            border-bottom: 2px solid transparent;
            transition: all 0.3s ease;
        }
        
        .tab.active {
            border-bottom-color: var(--glow);
            color: var(--glow);
        }
        
        .tab-content {
            display: none;
        }
        
        .tab-content.active {
            display: block;
        }
        
        .feature-list {
            list-style: none;
            padding: 0;
        }
        
        .feature-list li {
            padding: 10px 0;
            border-bottom: 1px solid var(--line);
            display: flex;
            align-items: center;
        }
        
        .feature-list li:last-child {
            border-bottom: none;
        }
        
        .feature-list li::before {
            content: "✨";
            margin-right: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 NODNOL Setup</h1>
            <p>Authentication System & Foundation Setup</p>
        </div>
        
        <?php if (!$db_ready): ?>
            <div class="status-warning">
                <h3>⚠️ Database Not Ready</h3>
                <p>Please complete the database initialization first.</p>
                <a href="index.php" class="btn">Back to Database Setup</a>
            </div>
        <?php else: ?>
            
            <?php if ($message): ?>
                <div class="message success"><?php echo htmlspecialchars($message); ?></div>
            <?php endif; ?>
            
            <?php if ($error): ?>
                <div class="message error"><?php echo htmlspecialchars($error); ?></div>
            <?php endif; ?>
            
            <div class="card">
                <div class="tabs">
                    <div class="tab active" onclick="switchTab('create')">Create Admin</div>
                    <div class="tab" onclick="switchTab('login')">Login</div>
                    <div class="tab" onclick="switchTab('features')">Features</div>
                </div>
                
                <!-- Create Admin Tab -->
                <div id="create-tab" class="tab-content active">
                    <h2>Create Administrator Account</h2>
                    <form method="POST">
                        <input type="hidden" name="action" value="create_admin">
                        
                        <div class="form-group">
                            <label for="username">Username:</label>
                            <input type="text" id="username" name="username" required 
                                   pattern="[a-zA-Z0-9_]+" title="Only letters, numbers, and underscores allowed">
                        </div>
                        
                        <div class="form-group">
                            <label for="email">Email:</label>
                            <input type="email" id="email" name="email" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="password">Password:</label>
                            <input type="password" id="password" name="password" required 
                                   minlength="8" title="Minimum 8 characters">
                        </div>
                        
                        <div class="form-group">
                            <label for="confirm_password">Confirm Password:</label>
                            <input type="password" id="confirm_password" name="confirm_password" required>
                        </div>
                        
                        <button type="submit" class="btn">Create Admin Account</button>
                    </form>
                </div>
                
                <!-- Login Tab -->
                <div id="login-tab" class="tab-content">
                    <h2>Administrator Login</h2>
                    <form method="POST">
                        <input type="hidden" name="action" value="login">
                        
                        <div class="form-group">
                            <label for="login_username">Username:</label>
                            <input type="text" id="login_username" name="username" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="login_password">Password:</label>
                            <input type="password" id="login_password" name="password" required>
                        </div>
                        
                        <button type="submit" class="btn">Login</button>
                    </form>
                </div>
                
                <!-- Features Tab -->
                <div id="features-tab" class="tab-content">
                    <h2>🚀 Phase 1 Foundation Features</h2>
                    <ul class="feature-list">
                        <li><strong>Database Design & Setup</strong> - Initialized and ready</li>
                        <li><strong>Security Implementation</strong> - Password hashing, session management</li>
                        <li><strong>Basic UI Framework</strong> - Responsive design with accessibility</li>
                        <li><strong>Authentication System</strong> - User roles and permissions</li>
                        <li><strong>Accessibility Features</strong> - WCAG compliant, screen reader friendly</li>
                    </ul>
                    
                    <h3>🎯 Next Development Steps</h3>
                    <ul class="feature-list">
                        <li>Client portal development</li>
                        <li>Staff management dashboard</li>
                        <li>Case management system</li>
                        <li>AI-powered features integration</li>
                        <li>Provider portal</li>
                    </ul>
                </div>
            </div>
            
            <div class="card">
                <h2>🔗 Quick Navigation</h2>
                <a href="index.php" class="btn secondary">Database Configuration</a>
                <a href="<?php echo htmlspecialchars('OUTSINC/theme_template.html'); ?>" class="btn secondary">View Theme Template</a>
            </div>
            
        <?php endif; ?>
    </div>
    
    <script>
        function switchTab(tabName) {
            // Hide all tab contents
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Remove active class from all tabs
            const tabs = document.querySelectorAll('.tab');
            tabs.forEach(tab => tab.classList.remove('active'));
            
            // Show selected tab content
            document.getElementById(tabName + '-tab').classList.add('active');
            
            // Add active class to selected tab
            event.target.classList.add('active');
        }
        
        // Password confirmation validation
        document.addEventListener('DOMContentLoaded', function() {
            const password = document.getElementById('password');
            const confirmPassword = document.getElementById('confirm_password');
            
            function validatePasswords() {
                if (password.value !== confirmPassword.value) {
                    confirmPassword.setCustomValidity("Passwords don't match");
                } else {
                    confirmPassword.setCustomValidity('');
                }
            }
            
            if (password && confirmPassword) {
                password.addEventListener('change', validatePasswords);
                confirmPassword.addEventListener('keyup', validatePasswords);
            }
        });
    </script>
</body>
</html>