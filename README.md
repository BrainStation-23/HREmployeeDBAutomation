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
└── base.fixture.ts            # Shared test fixture and page fixtures
pages/                         # Page Object Model classes
├── common.page.ts             # Common page elements
├── login.page.ts              # Login page
├── dashboard.page.ts          # Dashboard page
├── userManagement.page.ts     # User Management page
├── userManagementNewUser.page.ts # User Management New User page
├── roleManagement.page.ts     # Role Management page
├── myProfile.page.ts          # My Profile page
├── myTeam.page.ts            # My Team page
└── ...                        # Other page objects
test_data/                    # Test data files
├── UserManagementTestData/
│   ├── createTestUserData.json
│   ├── userSearchTestData.json
│   ├── user_create.csv
│   ├── user_update.csv
│   ├── employee_ids_delete.csv
│   └── UserExcelReport/
│       └── excelReport.xlsx
├── dashboardExpectedData.json
└── loginExpectedData.json
tests/                        # Test specifications
└── web/
    ├── RoleManagement/
    │   ├── 1. TestShadowRole.spec.ts
    │   ├── 2.TestManagerRole.spec.ts
    │   └── 3.TestEmployeeRole.spec.ts
    └── UserManagement/
        └── 1. UserCreateUpdateDeleteTest.spec.ts
utils/
├── env.ts                    # Environment variable accessors
├── global-setup.ts           # Loads env/<name>.env via DotEnv
├── Utility.ts                # Common utilities
└── ExcelCsvReader.ts         # Excel/CSV file reader utility
.github/
└── workflows/
    └── playwright-tests.yml  # GitHub Actions workflow
playwright.config.ts          # Playwright configuration
package.json                  # Project dependencies and scripts
```

## Prerequisites

- **Node.js** (v20 or higher) - Download from [nodejs.org](https://nodejs.org/en/download/)
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
   npx playwright install --with-deps
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

# Run tests with coverage
npm run env:local:cov
npm run env:prod:cov
```

### Running Tests by Tag

Tests can be filtered using tags for selective execution:

```sh
# Run only UserManagement tests
npx playwright test --grep "@user-management"

# Run tests excluding a specific tag
npx playwright test --grep-invert "@user-management"

# Run specific test file
npx playwright test tests/web/UserManagement/1. UserCreateUpdateDeleteTest.spec.ts
```

### Test Execution Details

- **Browser**: Chrome (Desktop)
- **Parallel Execution**: Enabled locally, 1 worker in CI
- **Retries**: 2 retries on failure
- **Timeout**: 2 minutes per test
- **Assertion Timeout**: 1 minute
- **Navigation Timeout**: 3 minutes
- **Headless Mode**: Enabled in CI, disabled locally


## Test Structure

### Page Object Model
The project follows the Page Object Model pattern with classes in the `pages/` directory:
- `common.page.ts` - Shared page elements and methods
- `login.page.ts` - Login page functionality
- `userManagement.page.ts` - User Management page interactions
- `userManagementNewUser.page.ts` - User Management New User form
- `roleManagement.page.ts` - Role Management page
- `dashboard.page.ts` - Dashboard page
- And other page objects for various features

### Test Specifications
Tests are organized in the `tests/web/` directory:

#### Role Management Tests
- **Shadow Role Tests** - Tests for Shadow SBU role permissions
- **Manager Role Tests** - Tests for Manager role functionality
- **Employee Role Tests** - Tests for Employee role functionality

#### User Management Tests
- **User Create, Update, Delete Tests** - Comprehensive CRUD operations for users
  - Individual user creation and deletion
  - User information updates
  - Bulk user operations (create, update, delete)
  - Search, filter, and export functionality
  - Tagged with `@user-management` for selective execution

### Test Data
Test data is stored in multiple formats in the `test_data/` directory:
- **JSON files** - For structured test data (user data, expected results)
- **CSV files** - For bulk operations (user_create.csv, user_update.csv)
- **Excel files** - For Excel report testing
- **Export Data** - For testing data export functionality

### Test Tagging
Tests can be tagged for selective execution:
- `@user-management` - All UserManagement test cases
- Tags can be used with `--grep` flag to run specific test suites

## Configuration

### Playwright Configuration (`playwright.config.ts`)

Key configuration options:
- **Test Matching**: `**.spec.ts` files
- **Parallel Execution**: 1 worker in CI, fully parallel locally
- **Screenshots**: Only on failure (local), off (CI)
- **Traces**: On (local), off (CI)
- **Timeout**: 2 minutes per test
- **Assertion Timeout**: 1 minute
- **Navigation Timeout**: 3 minutes
- **Retries**: 2 retries on failure
- **Reporters**: 
  - Local: HTML report, custom summary, list
  - CI: JUnit XML, custom summary, GitHub annotations, list

### Browser Support

Currently configured for:
- **Chrome** (Desktop)

Additional browsers can be easily added to the configuration by modifying the `projects` section in `playwright.config.ts`.

## Reporting

The framework provides comprehensive reporting:

1. **HTML Report** - Interactive test results with screenshots and traces
2. **Custom Summary** - Concise test execution summary
3. **JUnit Report** - CI/CD integration (XML format)
4. **Console Output** - Real-time test progress

## CI/CD Integration

### GitHub Actions Workflow

The project includes a comprehensive GitHub Actions workflow (`.github/workflows/playwright-tests.yml`) for automated test execution with flexible configuration options.

#### Workflow Features

- **Manual Trigger (workflow_dispatch)**: Manually trigger tests on the `main` branch with custom parameters
- **Environment Selection**: Choose between `local` or `prod` environment configurations
- **Test Filtering**: Optionally filter tests by tags (e.g., `@user-management`, `@role-management`)
- **Environment Variable Validation**: Automatic validation of required environment variables before test execution
- **Secure Credential Management**: Uses GitHub Secrets for sensitive credentials with .env file fallback
- **Automated Setup**: 
  - Node.js 20 with npm dependency caching for faster execution
  - Playwright browser installation with system dependencies
  - Clean dependency installation using `npm ci`
- **Test Execution**: Runs Playwright tests with CI-optimized configuration
- **Test Summary Generation**: Automatic generation of detailed test execution summaries with pass/fail statistics
- **Artifact Upload**: Comprehensive artifact collection including reports, screenshots, and traces
- **Artifact Retention**: Test artifacts retained for 30 days
- **Error Handling**: Continues execution even on test failures to ensure artifact collection
- **Job Timeout**: 60-minute timeout to prevent hanging workflows

#### How to Manually Trigger the Workflow

1. **Navigate to Actions Tab**
   - Go to your GitHub repository
   - Click on the **Actions** tab in the top navigation

2. **Select Workflow**
   - In the left sidebar, click on **Playwright Tests** workflow

3. **Run Workflow**
   - Click the **Run workflow** dropdown button (top right)
   - Configure the workflow inputs:

4. **Configure Workflow Inputs**
   
   **Test Environment** (required):
   - Select `prod` for production environment (default)
   - Select `local` for local/development environment
   
   **Test Tags** (optional):
   - Leave empty to run all tests
   - Enter `@user-management` to run only user management tests
   - Enter `@role-management` to run only role management tests
   - Use any custom tags defined in your test files

5. **Start Execution**
   - Click the green **Run workflow** button
   - Workflow will start executing immediately

#### Workflow Execution Examples

**Example 1: Run all tests in production environment**
```
Test environment: prod
Test tags: (leave empty)
```

**Example 2: Run user management tests in local environment**
```
Test environment: local
Test tags: @user-management
```

**Example 3: Run role management tests in production**
```
Test environment: prod
Test tags: @role-management
```

**Example 4: Run multiple tagged tests**
```
Test environment: prod
Test tags: @user-management|@role-management
```

#### Viewing Workflow Results

After triggering the workflow:

1. **Monitor Execution**
   - The workflow run appears at the top of the Actions page
   - Click on the run to view real-time logs
   - Job name displays the selected environment: "Playwright Tests - prod environment"

2. **View Test Summary**
   - Scroll to the bottom of the workflow run page
   - The summary section displays:
     - Execution details (environment, tags, triggered by)
     - Test statistics (passed, failed, errors, skipped)
     - Pass rate percentage
     - Execution duration
     - Artifact information

3. **Check Individual Steps**
   - Click on the "test" job to expand all steps
   - Review logs for each step:
     - Environment variable validation
     - Test execution output
     - Summary generation
     - Artifact upload confirmation

#### Accessing Test Artifacts

Test artifacts are automatically uploaded after every workflow run (success or failure):

**Artifact Contents:**
- `playwright-report/` - HTML test reports and JUnit XML
- `test-results/` - Detailed test output and metadata
- Screenshots (`.png`, `.jpg`, `.jpeg`) - Visual evidence of test failures
- Traces (`trace.zip`, `traces/`) - Detailed execution traces for debugging

**Artifact Naming Convention:**
```
playwright-results-{environment}-{run_number}-{run_attempt}
```

Example: `playwright-results-prod-42-1`

**How to Download Artifacts:**

1. Navigate to the workflow run page
2. Scroll to the **Artifacts** section at the bottom
3. Click on the artifact name to download as a ZIP file
4. Extract the ZIP file locally
5. Open `playwright-report/index.html` in a browser to view the HTML report

**Artifact Retention:**
- Artifacts are retained for **30 days** from the workflow run date
- After 30 days, artifacts are automatically deleted by GitHub
- Download important artifacts before expiration if long-term storage is needed

#### GitHub Secrets Configuration

The workflow uses GitHub Secrets to securely manage sensitive credentials. Secrets take precedence over `.env` files.

**Required Secrets:**
- `BASE_URL` - Application base URL
- `TEST_SUPER_ADMIN_EMAIL` - Super admin email
- `TEST_SUPER_ADMIN_PASSWORD` - Super admin password
- `TEST_ADMIN_EMAIL` - Admin email
- `TEST_ADMIN_PASSWORD` - Admin password
- `TEST_MANAGER_EMAIL` - Manager email
- `TEST_MANAGER_PASSWORD` - Manager password
- `TEST_EMPLOYEE_EMAIL` - Employee email
- `TEST_EMPLOYEE_PASSWORD` - Employee password
- `TEST_SHADOW_SBU_EMAIL` - Shadow SBU email
- `TEST_SHADOW_SBU_NAME` - Shadow SBU name
- `TEST_SHADOW_SBU_PASSWORD` - Shadow SBU password

**Setup Instructions:**

For detailed step-by-step instructions on configuring GitHub Secrets, see:
📖 **[GitHub Secrets Setup Guide](docs/GITHUB_SECRETS_SETUP.md)**

The guide includes:
- How to access GitHub Secrets settings
- Complete list of required secrets with descriptions
- Step-by-step secret configuration process
- Environment variable precedence explanation
- Verification steps
- Troubleshooting common issues

**Quick Setup:**
1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add each of the 12 required secrets listed above
4. Run the workflow to verify configuration

#### Environment Variable Precedence

The workflow uses a two-tier system for loading environment variables:

**Precedence Order (Highest to Lowest):**

1. **GitHub Secrets** (Highest Priority)
   - Values configured in GitHub repository settings
   - Encrypted and secure
   - Override any other source
   - Recommended for CI/CD environments

2. **.env Files** (Fallback)
   - Located in `env/` directory (`env/prod.env`, `env/local.env`)
   - Used when GitHub Secrets are not configured
   - Loaded based on `test_env` workflow input
   - Useful for local development

**How It Works:**

The `utils/global-setup.ts` file uses `dotenv.config({ override: false })`, which means:
- Variables already set in the environment (from GitHub Secrets) are **preserved**
- Missing variables are **loaded from** the appropriate .env file based on `test_env`

**Configuration Scenarios:**

- **Full GitHub Secrets**: All secrets configured → .env files ignored (recommended for CI/CD)
- **Partial GitHub Secrets**: Some secrets configured → Missing values loaded from .env files
- **No GitHub Secrets**: All values loaded from .env files (local development only)

**Environment Selection:**
- `test_env: prod` → Falls back to `env/prod.env` for missing secrets
- `test_env: local` → Falls back to `env/local.env` for missing secrets

#### Workflow Validation

The workflow includes automatic validation of required environment variables:

- **Pre-execution Check**: Validates all required variables before running tests
- **Clear Error Messages**: Lists missing variables with helpful instructions
- **Fail Fast**: Stops execution immediately if critical variables are missing
- **Guidance**: Provides links to setup documentation

If validation fails, the workflow will display:
- List of missing environment variables
- Instructions for configuring GitHub Secrets
- Alternative .env file setup instructions

#### Troubleshooting Workflow Issues

**Issue: "Missing required environment variables" error**
- **Solution**: Configure all 12 required GitHub Secrets or ensure appropriate .env file exists
- **See**: [GitHub Secrets Setup Guide](docs/GITHUB_SECRETS_SETUP.md)

**Issue: Tests run against wrong environment**
- **Solution**: Verify `BASE_URL` secret value matches your intended environment
- **Check**: Selected `test_env` input when triggering workflow

**Issue: Workflow times out**
- **Solution**: Review test execution time; consider splitting tests or increasing timeout
- **Current Timeout**: 60 minutes

**Issue: Artifacts not uploaded**
- **Solution**: Check test execution logs; ensure tests generate output files
- **Verify**: `playwright-report/` and `test-results/` directories exist after test run

**Issue: Cannot trigger workflow**
- **Solution**: Ensure you have write access to the repository
- **Check**: Workflow file exists at `.github/workflows/playwright-tests.yml`

For more troubleshooting help, see the [GitHub Secrets Setup Guide](docs/GITHUB_SECRETS_SETUP.md#troubleshooting).

## Contributing

1. Follow the existing code structure and naming conventions
2. Add appropriate test data for new test cases
3. Update environment configurations as needed
4. Ensure all tests pass before submitting changes

## Troubleshooting

### Common Issues

1. **Browser Installation**: Run `npx playwright install --with-deps` if browsers are missing
2. **Environment Variables**: Ensure `.env` files are properly configured
3. **Timeout Issues**: Adjust timeout values in `playwright.config.ts` if needed

### Debug Mode

For debugging, you can run tests in non-headless mode:
```sh
npx playwright test --headed
```

You can also use Playwright's debug mode:
```sh
npx playwright test --debug
```

### Viewing Test Reports

After test execution, reports are generated in the `playwright-report/` directory:
- **HTML Report**: Opens automatically after test completion (local only)
- **Custom Summary**: Available at `playwright-report/custom-summary.txt`
- **JUnit Report**: Available at `playwright-report/result.xml` (CI only)

To view the HTML report manually:
```sh
npx playwright show-report
```

### Trace Files

To view trace files for debugging:
```sh
npx playwright show-trace trace.zip
```

Trace files are available in the `test-results/` directory after test execution.

## License

This project is licensed under the ISC License.