# HR Employee DB Automation

End-to-end automation test framework for the HR Employee Database Management System using Playwright and TypeScript.

## Overview

This project covers automated testing of role-based access control and employee management features using a scalable Page Object Model, supporting multiple environments and CI/CD integration.

## Built With

- **[Playwright](https://playwright.dev)** - Modern web testing framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[DotEnv](https://github.com/motdotla/dotenv)** - Environment configuration
- **[Faker.js](https://github.com/faker-js/faker)** - Test data generation
- **[Playwright Report Summary](https://github.com/skilbourn/playwright-report-summary)** - Custom reporting

## Project Structure

```
env/                            # Environment configuration files
├── local.env                   # Local environment settings
└── prod.env                    # Production environment settings
lib/
└── base.fixture.ts            # Shared test fixture
pages/                         # Page Object Model classes
├── common.page.ts             # Common page elements
├── dashboard.page.ts          # Dashboard page
├── login.page.ts              # Login page
├── myProfile.page.ts          # My Profile page
├── myTeam.page.ts            # My Team page
├── platformFeedback.page.ts   # Platform Feedback page
└── security.page.ts          # Security page
test_data/                    # Test data files
├── dashboardExpectedData.json
└── loginExpectedData.json
tests/                        # Test specifications
└── web/
    └── RoleManagement/
        └── 1. TestShadowRole.spec.ts
utils/
├── env.ts                    # Environment variable accessors
├── global-setup.ts           # Loads env/<name>.env via DotEnv
└── Utility.ts                # Common utilities
playwright.config.ts          # Playwright configuration
package.json                  # Project dependencies and scripts
```

## Prerequisites

- **Node.js** (v18.16.0 or higher) - Download from [nodejs.org](https://nodejs.org/en/download/)
- **npm** (v9.5.1 or higher)

## Installation

1. **Clone the repository**
   ```sh
   git clone <repository-url>
   cd HREmployeeDBAutomation
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Install Playwright browsers**
   ```sh
   npx playwright install
   ```

## Environment Configuration

The project supports multiple environments via `.env` files in the `env/` directory and CI/CD environment variables.

### Available Environments
- **LOCAL** - Local development
- **PROD** - Production

### Environment Variables

The project requires `.env` files in the `env/` directory for different environments. Create the following files:

1. `env/local.env` - For local development
2. `env/prod.env` - For production/CI environment

Each environment file should include these variables:

```env
# Environment Identifier
ENVIRONMENT_NAME=

# Application Base URL
BASE_URL=

# Super Admin Credentials
TEST_SUPER_ADMIN_EMAIL=
TEST_SUPER_ADMIN_PASSWORD=

# Admin Credentials
TEST_ADMIN_EMAIL=
TEST_ADMIN_PASSWORD=

# Manager Credentials
TEST_MANAGER_EMAIL=
TEST_MANAGER_PASSWORD=

# Employee Credentials
TEST_EMPLOYEE_EMAIL=
TEST_EMPLOYEE_PASSWORD=

# Shadow SBU User Credentials
TEST_SHADOW_SBU_EMAIL=
TEST_SHADOW_SBU_NAME=
TEST_SHADOW_SBU_PASSWORD=
```

### Environment Setup Instructions

1. **Local Development**:
   - Create `env/local.env`
   - Set variables with local development values
   - Variables will be loaded when running `npm run env:local`

2. **CI/CD Environment**:
   - Create `env/prod.env` for production fallback values
   - Set CI/CD environment variables in your pipeline
   - CI/CD variables take precedence over `.env` files
   - Missing values will fall back to `env/prod.env`

### Variable Loading Priority
1. CI/CD environment variables (highest priority)
2. Environment-specific `.env` file based on `TEST_ENV`
3. Default environment configuration (lowest priority)

These variables are exposed via `utils/env.ts` and can be accessed in tests using convenience accessors like `ENV.SITE_BASE_URL`.

## Usage

### Running Tests

Select which `.env` file to load by setting `TEST_ENV` (or `test_env`), default is `local`:

```sh
# Local .env (default)
npx playwright test

# Run tests in local environment
npm run env:local

# Run tests in production environment
npm run env:prod
```

### Test Execution Details

- **Browser**: Chrome (Desktop)
- **Parallel Execution**: Enabled (4 workers)
- **Retries**: 1 retry on failure
- **Timeout**: 5 minutes per test
- **Headless Mode**: Enabled in CI, disabled locally

### Viewing Test Reports

After test execution, reports are generated in the `playwright-report/` directory:

- **HTML Report**: Opens automatically after test completion
- **Custom Summary**: Available at `playwright-report/custom-summary.txt`
- **JUnit Report**: Available at `playwright-report/result.xml` (CI only)

### Trace Files

To view trace files for debugging:

```sh
npx playwright show-trace trace.zip
```

## Test Structure

### Page Object Model
The project follows the Page Object Model pattern with classes in the `pages/` directory:
- `common.page.ts` - Shared page elements and methods
- `home.page.ts` - Home page interactions
- `login.page.ts` - Login page functionality
- `register.page.ts` - Registration page functionality

### Test Specifications
Tests are organized in the `tests/web/` directory:
- **Registration Tests** - User registration functionality
- **Login Tests** - User authentication functionality

### Test Data
Test data is stored in JSON format in the `test_data/` directory, supporting:
- Expected data validation
- Test case scenarios
- Environment-specific data

## Configuration

### Playwright Configuration (`playwright.config.ts`)

Key configuration options:
- **Test Matching**: `**.spec.ts` files
- **Parallel Execution**: 4 workers
- **Screenshots**: On failure (local), off (CI)
- **Traces**: On (local), off (CI)
- **Timeout**: 5 minutes per test
- **Navigation Timeout**: 3 minutes

### Browser Support

Currently configured for:
- **Chrome** (Desktop)

Additional browsers can be easily added to the configuration.

## Reporting

The framework provides comprehensive reporting:

1. **HTML Report** - Interactive test results with screenshots and traces
2. **Custom Summary** - Concise test execution summary
3. **JUnit Report** - CI/CD integration (XML format)
4. **Console Output** - Real-time test progress

## CI/CD Integration

The framework is CI-ready with:
- Headless browser execution
- JUnit XML reporting
- GitHub Actions integration
- Optimized for parallel execution

### CI/CD Environment Variable Precedence
- CI/CD variables and secrets take precedence over `.env` files. In `utils/global-setup.ts` we call DotEnv with `override: false`, so values already present in the environment are preserved, and missing ones are filled from `env/<TEST_ENV>.env`.
- Set `TEST_ENV=prod` to load `env/prod.env` as fallback values in CI.

## Contributing

1. Follow the existing code structure and naming conventions
2. Add appropriate test data for new test cases
3. Update environment configurations as needed
4. Ensure all tests pass before submitting changes

## Troubleshooting

### Common Issues

1. **Browser Installation**: Run `npx playwright install` if browsers are missing
2. **Environment Variables**: Ensure `.env` files are properly configured
3. **Timeout Issues**: Adjust timeout values in `playwright.config.ts` if needed

### Debug Mode

For debugging, you can run tests in non-headless mode by modifying the configuration or using:
```sh
npx playwright test --headed
```

## License

This project is licensed under the ISC License.