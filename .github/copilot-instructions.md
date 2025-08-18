# NODNOL - Addiction Recovery Support Platform

Always reference these instructions first and fallback to search or additional exploration only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Quick Start and Environment Setup
- **Repository Status**: Early development phase with comprehensive documentation but minimal source code
- **Current State**: Documentation-only with basic PHP development environment setup

#### Bootstrap the Development Environment:
```bash
cd /home/runner/work/NODNOL/NODNOL
composer install --no-dev  # Takes ~6 seconds. NEVER CANCEL.
npm install                 # Takes ~30 seconds. NEVER CANCEL.
```

#### Start Development Server:
```bash
php -S localhost:8000       # Starts PHP development server on port 8000
```
- **Server startup time**: Immediate (< 1 second)
- **Validation**: Visit http://localhost:8000 and http://localhost:8000/test.php
- **NEVER CANCEL**: Always let the server start completely before testing

#### Current Working Commands:
- `composer install` - Installs PHP dependencies (~6 seconds)
- `npm install` - Installs Node.js development tools (~30 seconds) 
- `npm run build` - Currently placeholder, returns "not yet implemented"
- `npm test` - Currently placeholder, returns "not yet implemented"
- `php -S localhost:8000` - Starts development server (immediate)

#### Known Limitations (Document these in your work):
- **MySQL**: Connection with root/blank credentials FAILS - database not configured
- **phpMyAdmin**: Not available in current environment
- **Source Code**: Only basic index.php and test.php exist
- **Frontend Build**: npm scripts are placeholders only
- **CI/CD**: No GitHub Actions workflows exist yet

## Technology Stack Validation

### PHP Environment (✅ Working)
- **Version**: PHP 8.3.6 (meets requirement of PHP 8.0+)
- **Required Extensions**: ✅ json, mysqli, curl, openssl all loaded
- **Directory Permissions**: ✅ Write access confirmed
- **Development Server**: ✅ Functional on localhost:8000

### Node.js Environment (✅ Working)
- **Version**: Node.js v20.19.4, npm 10.8.2
- **Status**: Available for future frontend tooling
- **Current State**: Basic package.json with placeholder scripts

### Database (❌ Not Available)
- **MySQL**: Version 8.0.42 installed but not configured
- **Connection**: root/blank credentials DO NOT WORK
- **Status**: Database setup required for actual development

## Validation Scenarios

### CRITICAL: Manual Validation Steps
Always run these validation steps after making changes:

1. **Environment Validation**:
   ```bash
   php -S localhost:8000 &
   sleep 2
   curl -s http://localhost:8000/test.php | grep "✅"
   kill %1
   ```
   - **Expected**: All environment checks show ✅
   - **Time**: ~5 seconds total

2. **Basic Application Test**:
   ```bash
   php -S localhost:8000 &
   sleep 2  
   curl -s http://localhost:8000 | grep "NODNOL"
   kill %1
   ```
   - **Expected**: HTML response containing "NODNOL" title
   - **Time**: ~3 seconds total

3. **Dependency Validation**:
   ```bash
   composer validate && echo "Composer config valid"
   npm run build && echo "npm scripts accessible"
   ```
   - **Expected**: No composer errors, placeholder build message
   - **Time**: ~2 seconds total

### Build and Test Timing Expectations
- **composer install**: 6 seconds - NEVER CANCEL, set timeout to 60+ seconds
- **npm install**: 30 seconds - NEVER CANCEL, set timeout to 180+ seconds
- **PHP server start**: Immediate - but always wait 2+ seconds before testing
- **Environment validation**: 5 seconds total for complete validation

## Project Structure and Navigation

### Key Files and Directories
```
/home/runner/work/NODNOL/NODNOL/
├── README.md                    # Project overview and setup instructions
├── composer.json               # PHP dependency management
├── package.json                # Frontend tooling configuration  
├── index.php                   # Basic development homepage
├── test.php                    # Environment validation page
├── docs/                       # Comprehensive project documentation
│   ├── README.md              # Documentation index
│   ├── SOP_Development.md     # Development procedures and standards
│   ├── Feature_Specifications.md  # Detailed feature requirements
│   └── AI_Features_Specification.md  # AI functionality specifications
└── OUTSINC/                   # External reference material
```

### Important Documentation Files
- **Always reference first**: `docs/SOP_Development.md` for development standards
- **Feature development**: `docs/Feature_Specifications.md` for requirements
- **Architecture decisions**: All docs follow the established SOP procedures

### Current Implementation Status
- **Phase**: Foundation setup (early development)
- **Backend**: Basic PHP environment configured
- **Frontend**: HTML/CSS/JavaScript planned but not implemented
- **Database**: MySQL/MariaDB specified but not configured
- **AI Features**: Documented but not implemented

## Development Workflow

### Standard Development Process
1. **ALWAYS start with environment validation**:
   ```bash
   cd /home/runner/work/NODNOL/NODNOL
   php -S localhost:8000 &
   sleep 2
   curl -s http://localhost:8000/test.php | grep "ready"
   kill %1
   ```

2. **Reference documentation before coding**:
   - Read relevant sections in `docs/Feature_Specifications.md`
   - Follow standards in `docs/SOP_Development.md`
   - Ensure HIPAA compliance and privacy requirements

3. **Test changes immediately**:
   - Start PHP server: `php -S localhost:8000`
   - Test in browser or with curl
   - Validate all functionality works as expected

4. **Pre-commit validation** (when applicable):
   ```bash
   composer validate
   npm run lint    # (placeholder currently)
   npm run test    # (placeholder currently)
   ```

### File Creation Standards
- All PHP files should start with `<?php` and include proper headers
- Follow the header/footer convention shown in docs:
  ```
  //START - folder/filename.ext
  [File content]
  //END - folder/filename.ext
  ```
- Maintain privacy-first and accessibility-first principles

## Common Tasks and Commands

### Environment Setup (Fresh Clone)
```bash
# Navigate to project
cd /home/runner/work/NODNOL/NODNOL

# Install dependencies  
composer install --no-dev     # ~6 seconds
npm install                   # ~30 seconds

# Validate environment
php -S localhost:8000 &
sleep 2
curl http://localhost:8000/test.php
kill %1
```

### Development Server Management
```bash
# Start development server
php -S localhost:8000

# Test server response (in another terminal)
curl -s http://localhost:8000

# Stop server (Ctrl+C in server terminal)
```

### Documentation Reference Commands
```bash
# View project structure
ls -la docs/

# Read development procedures  
cat docs/SOP_Development.md

# Check feature requirements
cat docs/Feature_Specifications.md
```

## Troubleshooting and Common Issues

### "Composer not found" or Dependency Issues
- **Cause**: Missing composer.json file
- **Solution**: File exists at `/home/runner/work/NODNOL/NODNOL/composer.json`
- **Validation**: Run `composer validate`

### "MySQL Connection Failed"
- **Expected**: This is normal in current environment
- **Workaround**: Document database connection requirements for future setup
- **Do NOT try to fix**: MySQL configuration is environment-specific

### "npm scripts not implemented"
- **Expected**: Frontend build system not yet developed
- **Current Status**: Placeholder scripts in package.json
- **Action**: Document as future development requirement

### PHP Server "Not Responding" 
- **Common Issue**: Server needs 2+ seconds to start
- **Solution**: Always `sleep 2` before testing
- **Alternative**: Check if port 8000 is already in use

## Security and Compliance Notes

- **HIPAA Compliance**: All development must consider healthcare data requirements
- **Privacy First**: Anonymous access options must be preserved
- **Accessibility**: WCAG compliance is mandatory
- **Trauma-Informed**: Consider psychological impact in all design decisions

## Performance Expectations

### Command Timeouts (CRITICAL - NEVER CANCEL)
- `composer install`: Set timeout to 60+ seconds (actual: ~6 seconds)
- `npm install`: Set timeout to 180+ seconds (actual: ~30 seconds)  
- PHP server start: Set timeout to 30+ seconds (actual: immediate)
- Environment validation: Set timeout to 30+ seconds (actual: ~5 seconds)

### Manual Testing Requirements
- **NEVER skip manual validation**: Always test actual functionality
- **Complete user scenarios**: Test full workflows, not just server start/stop
- **Cross-browser testing**: When UI exists, test in multiple browsers
- **Accessibility testing**: Verify screen reader and keyboard navigation

## Project Context and Goals

**NODNOL** is an addiction recovery support platform focusing on crystal methamphetamine addiction support. The platform serves both individuals in recovery and healthcare professionals with crisis support, AI-powered features, community tools, and case management capabilities.

**Current Development Priority**: 
1. Complete foundation setup (database configuration)
2. Implement core client safety features  
3. Develop professional case management tools
4. Integrate AI-powered support features

**Success Criteria**: 
- All environments validate successfully via test.php
- Development server starts and responds correctly
- Code follows established SOP procedures
- Privacy and security requirements are maintained

---

> **Remember**: This is a healthcare application dealing with sensitive topics. Approach all development with compassion, professionalism, and respect for individuals affected by addiction.