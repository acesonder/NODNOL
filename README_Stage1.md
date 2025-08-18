# NODNOL - Crystal Meth Addiction Recovery Platform

## Overview
NODNOL is a comprehensive web application supporting individuals recovering from crystal methamphetamine addiction, along with powerful tools for healthcare professionals and case workers.

### Key Features
- Privacy-first design with anonymous options
- Trauma-informed care approach
- HIPAA compliance ready
- Accessibility features (WCAG compliance)
- Multi-tier platform for clients, staff, and providers

## Project Status
**Current Phase**: Stage 1 Complete - Foundation Setup ✅
- ✅ Database initialization system
- ✅ Authentication framework
- ✅ Security implementation (password hashing, sessions)
- ✅ Basic UI framework with accessibility
- ✅ AI-powered troubleshooting system
- ✅ Documentation preserved

## Technology Stack
- **Backend**: PHP 8.0+ (pure PHP, no Composer dependencies)
- **Database**: MySQL/MariaDB
- **Frontend**: HTML5, CSS3, JavaScript
- **Development**: PHP built-in server

## Quick Start

### Prerequisites
- PHP 8.0 or higher with mysqli, json, openssl, curl extensions
- MySQL/MariaDB server
- Web server (Apache/Nginx for production)

### Installation & Setup
1. Clone the repository
2. Start development server: `php -S localhost:8000`
3. Visit: http://localhost:8000 for database initialization
4. Complete database setup with credentials (user: chance, password: chance)
5. Proceed to http://localhost:8000/setup.php for authentication setup
6. Access dashboard at http://localhost:8000/dashboard.php after login

### Database Configuration
The system includes an intelligent database initialization page that:
- Tests PHP/MySQL server connectivity
- Creates database and required tables
- Provides AI-powered troubleshooting suggestions
- Validates system requirements
- Loads demo data for testing

Default credentials: **username: chance, password: chance**

## Project Structure (Stage 1)
```
/
├── docs/                    # Comprehensive documentation (preserved)
├── OUTSINC/                # External templates and assets (preserved)
│   └── theme_template.html # Theme template (preserved)
├── index.php               # Database initialization & configuration
├── setup.php               # Authentication system setup
├── dashboard.php           # Main dashboard (post-login)
└── README.md               # This file
```

## Stage 1 Implementation Features

### ✅ Database Initialization System
- Intelligent connection testing
- Automatic database and table creation
- Demo data loading
- Real-time status monitoring

### ✅ Authentication Framework
- Secure password hashing (PASSWORD_DEFAULT)
- Session management
- Role-based access control (admin, staff, client, provider)
- Login/logout functionality

### ✅ AI-Powered Troubleshooting
- Automated error detection and solutions
- MySQL connectivity diagnostics
- PHP extension validation
- System health monitoring

### ✅ Security Implementation
- SQL injection prevention (prepared statements)
- XSS protection (htmlspecialchars)
- CSRF protection ready
- Secure session handling

### ✅ Accessibility Features
- WCAG-compliant design
- Screen reader friendly
- Keyboard navigation support
- High contrast design
- Responsive layouts

## Phase 2 Development Plan
Next development phase will include:
- Client portal with recovery tracking
- Staff dashboard with case management
- AI-powered features integration
- Provider portal development
- Advanced security features

## Documentation
Comprehensive documentation preserved in the `docs/` directory:
- [Feature Specifications](docs/Feature_Specifications.md)
- [AI Features](docs/AI_Features_Specification.md)
- [Development SOP](docs/SOP_Development.md)

## Database Schema (Stage 1)
```sql
users (id, username, email, password_hash, role, created_at, updated_at, is_active)
user_profiles (id, user_id, first_name, last_name, phone, emergency_contact, accessibility_needs, privacy_settings, created_at)
system_config (id, config_key, config_value, description, updated_at)
```

## AI Troubleshooting Features
The system includes intelligent troubleshooting that automatically detects and provides solutions for:
- MySQL connection failures
- PHP extension issues
- Permission problems
- Database configuration errors
- Port conflicts

## Contributing
This project follows strict development procedures. All changes must maintain:
- HIPAA compliance considerations
- Accessibility standards
- Security best practices
- Documentation updates

## License
This project contains sensitive healthcare-related functionality. All development must consider HIPAA compliance and patient privacy.

---

*NODNOL is committed to supporting individuals in recovery with compassion, respect, and evidence-based care.*