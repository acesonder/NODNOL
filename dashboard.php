<?php
// NODNOL - Main Dashboard
session_start();

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header('Location: setup.php');
    exit;
}

$user_id = $_SESSION['user_id'];
$username = $_SESSION['username'];
$role = $_SESSION['role'];

// Database configuration
$db_host = 'localhost';
$db_user = 'chance';
$db_pass = 'chance';
$db_name = 'nodnol_db';

// Handle logout
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: setup.php');
    exit;
}

// Get user stats and system info
$stats = [
    'total_users' => 0,
    'active_cases' => 0,
    'pending_assessments' => 0,
    'system_health' => 'Good'
];

try {
    $connection = new mysqli($db_host, $db_user, $db_pass, $db_name);
    if (!$connection->connect_error) {
        // Get total users
        $result = $connection->query("SELECT COUNT(*) as count FROM users WHERE is_active = 1");
        if ($row = $result->fetch_assoc()) {
            $stats['total_users'] = $row['count'];
        }
        
        $connection->close();
    }
} catch (Exception $e) {
    $stats['system_health'] = 'Warning';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NODNOL - Dashboard</title>
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
            padding: 0;
            min-height: 100vh;
        }
        
        .navbar {
            background: var(--surface);
            border-bottom: 1px solid var(--line);
            padding: 15px 0;
            box-shadow: var(--shadow);
        }
        
        .navbar-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 20px;
        }
        
        .logo {
            font-size: 1.8em;
            font-weight: bold;
            background: linear-gradient(45deg, var(--cta), var(--glow));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .user-info {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .user-badge {
            background: var(--surface-2);
            padding: 8px 16px;
            border-radius: 20px;
            border: 1px solid var(--line);
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 30px 20px;
        }
        
        .welcome {
            text-align: center;
            margin-bottom: 40px;
        }
        
        .welcome h1 {
            font-size: 2.5em;
            margin: 0 0 10px 0;
            color: var(--glow);
        }
        
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .card {
            background: var(--surface);
            border: 1px solid var(--line);
            border-radius: var(--radius);
            padding: 25px;
            box-shadow: var(--shadow);
            transition: transform 0.3s ease;
        }
        
        .card:hover {
            transform: translateY(-5px);
        }
        
        .card h3 {
            margin-top: 0;
            color: var(--glow);
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .stat-card {
            text-align: center;
        }
        
        .stat-number {
            font-size: 3em;
            font-weight: bold;
            color: var(--cta);
            margin: 10px 0;
        }
        
        .stat-label {
            color: var(--muted);
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 0.9em;
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
            text-decoration: none;
            display: inline-block;
            transition: all 0.3s ease;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(255, 82, 82, 0.3);
        }
        
        .btn.secondary {
            background: linear-gradient(45deg, var(--surface-2), var(--line));
        }
        
        .btn.small {
            padding: 8px 16px;
            font-size: 14px;
        }
        
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
        }
        
        .feature-card {
            background: var(--surface-2);
            padding: 20px;
            border-radius: var(--radius);
            border: 1px solid var(--line);
            text-align: center;
        }
        
        .feature-icon {
            font-size: 2em;
            margin-bottom: 10px;
        }
        
        .status-indicator {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 8px;
        }
        
        .status-good { background: var(--positive); }
        .status-warning { background: var(--warn); }
        .status-error { background: var(--error); }
        
        .development-notice {
            background: linear-gradient(45deg, rgba(255, 82, 82, 0.1), rgba(0, 229, 255, 0.1));
            border: 1px solid var(--glow);
            padding: 20px;
            border-radius: var(--radius);
            margin-bottom: 30px;
            text-align: center;
        }
        
        @media (max-width: 768px) {
            .navbar-content {
                flex-direction: column;
                gap: 15px;
            }
            
            .grid {
                grid-template-columns: 1fr;
            }
            
            .welcome h1 {
                font-size: 2em;
            }
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="navbar-content">
            <div class="logo">🌟 NODNOL</div>
            <div class="user-info">
                <span class="user-badge">
                    👤 <?php echo htmlspecialchars($username); ?> (<?php echo ucfirst($role); ?>)
                </span>
                <a href="?logout=1" class="btn small secondary">Logout</a>
            </div>
        </div>
    </nav>
    
    <div class="container">
        <div class="welcome">
            <h1>Welcome to NODNOL Dashboard</h1>
            <p>Addiction Recovery Support Platform - Administration Panel</p>
        </div>
        
        <div class="development-notice">
            <h3>🚧 Development Phase - Stage 1 Complete</h3>
            <p>Foundation setup is complete! Database initialized, authentication system ready, and basic framework established.</p>
        </div>
        
        <div class="grid">
            <!-- System Statistics -->
            <div class="card stat-card">
                <h3>📊 System Statistics</h3>
                <div class="stat-number"><?php echo $stats['total_users']; ?></div>
                <div class="stat-label">Active Users</div>
            </div>
            
            <div class="card stat-card">
                <h3>📋 Cases</h3>
                <div class="stat-number"><?php echo $stats['active_cases']; ?></div>
                <div class="stat-label">Active Cases</div>
            </div>
            
            <div class="card stat-card">
                <h3>📝 Assessments</h3>
                <div class="stat-number"><?php echo $stats['pending_assessments']; ?></div>
                <div class="stat-label">Pending</div>
            </div>
            
            <div class="card stat-card">
                <h3>🔧 System Health</h3>
                <div style="margin: 20px 0;">
                    <span class="status-indicator status-<?php echo $stats['system_health'] === 'Good' ? 'good' : 'warning'; ?>"></span>
                    <?php echo $stats['system_health']; ?>
                </div>
                <div class="stat-label">Overall Status</div>
            </div>
        </div>
        
        <!-- Phase 1 Features -->
        <div class="card">
            <h3>✅ Phase 1 Foundation - Complete</h3>
            <div class="feature-grid">
                <div class="feature-card">
                    <div class="feature-icon">🗄️</div>
                    <h4>Database Setup</h4>
                    <p>MySQL database initialized with core tables</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🔒</div>
                    <h4>Security System</h4>
                    <p>Authentication, password hashing, session management</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🎨</div>
                    <h4>UI Framework</h4>
                    <p>Responsive design with accessibility features</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">👥</div>
                    <h4>User Management</h4>
                    <p>Role-based access control foundation</p>
                </div>
            </div>
        </div>
        
        <!-- Next Development Phase -->
        <div class="card">
            <h3>🚀 Next: Phase 2 Development</h3>
            <p>The following features are planned for development:</p>
            <div class="feature-grid">
                <div class="feature-card">
                    <div class="feature-icon">👤</div>
                    <h4>Client Portal</h4>
                    <p>Recovery tracking, assessments, resources</p>
                    <a href="#" class="btn small">Coming Soon</a>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">👨‍⚕️</div>
                    <h4>Staff Dashboard</h4>
                    <p>Case management, client oversight</p>
                    <a href="#" class="btn small">Coming Soon</a>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🤖</div>
                    <h4>AI Features</h4>
                    <p>Smart recommendations, risk assessment</p>
                    <a href="#" class="btn small">Coming Soon</a>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🏥</div>
                    <h4>Provider Portal</h4>
                    <p>Healthcare provider integration</p>
                    <a href="#" class="btn small">Coming Soon</a>
                </div>
            </div>
        </div>
        
        <!-- Admin Tools -->
        <?php if ($role === 'admin'): ?>
        <div class="card">
            <h3>⚙️ Administrator Tools</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                <a href="index.php" class="btn secondary">Database Configuration</a>
                <a href="setup.php" class="btn secondary">Setup & Authentication</a>
                <a href="<?php echo htmlspecialchars('OUTSINC/theme_template.html'); ?>" class="btn secondary">Theme Template</a>
                <a href="docs/" class="btn secondary">Documentation</a>
            </div>
        </div>
        <?php endif; ?>
        
        <!-- Documentation Links -->
        <div class="card">
            <h3>📚 Documentation & Resources</h3>
            <p>Access comprehensive documentation for the NODNOL platform:</p>
            <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px;">
                <a href="docs/Feature_Specifications.md" class="btn secondary small">Feature Specs</a>
                <a href="docs/AI_Features_Specification.md" class="btn secondary small">AI Features</a>
                <a href="docs/SOP_Development.md" class="btn secondary small">Development SOP</a>
                <a href="OUTSINC/TASK_LIST.md" class="btn secondary small">Task List</a>
            </div>
        </div>
    </div>
    
    <script>
        // Add some interactive features
        document.addEventListener('DOMContentLoaded', function() {
            // Add hover effects to cards
            const cards = document.querySelectorAll('.card');
            cards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.boxShadow = '0 20px 50px rgba(0,0,0,.6)';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.boxShadow = 'var(--shadow)';
                });
            });
            
            // Simulate real-time updates for demo
            setInterval(function() {
                const healthIndicator = document.querySelector('.status-indicator');
                if (healthIndicator) {
                    healthIndicator.style.opacity = '0.5';
                    setTimeout(() => {
                        healthIndicator.style.opacity = '1';
                    }, 200);
                }
            }, 10000);
        });
    </script>
</body>
</html>