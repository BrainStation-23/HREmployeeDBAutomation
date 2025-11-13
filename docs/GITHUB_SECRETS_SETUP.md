# GitHub Secrets Setup Guide

## Overview

This guide provides step-by-step instructions for configuring GitHub Secrets for the HR Employee DB Automation project. GitHub Secrets are encrypted environment variables that allow you to securely store sensitive information like credentials and API keys for use in GitHub Actions workflows.

## Table of Contents

1. [Accessing GitHub Secrets Settings](#accessing-github-secrets-settings)
2. [Required Secrets](#required-secrets)
3. [Adding Secrets to Your Repository](#adding-secrets-to-your-repository)
4. [Environment Variables Precedence](#environment-variables-precedence)
5. [Verification](#verification)
6. [Troubleshooting](#troubleshooting)

---

## Accessing GitHub Secrets Settings

Follow these steps to access the GitHub Secrets configuration page:

1. **Navigate to your repository** on GitHub (e.g., `https://github.com/your-username/your-repo`)

2. **Click on "Settings"** tab in the repository navigation bar (top of the page)

3. **In the left sidebar**, scroll down to the "Security" section

4. **Click on "Secrets and variables"** to expand the menu

5. **Select "Actions"** from the expanded menu

6. You should now see the "Actions secrets and variables" page with two tabs:
   - **Secrets** (for encrypted values)
   - **Variables** (for non-sensitive values)

7. **Click on "Secrets"** tab if not already selected

8. **Click the "New repository secret"** button (green button in the top right)

---

## Required Secrets

The following secrets are required for the Playwright test workflow to function properly. Each secret must be added individually using the steps in the next section.

### Application Configuration

| Secret Name | Description | Example Format |
|------------|-------------|----------------|
| `BASE_URL` | Base URL of the application under test | `https://your-app.example.com` or `http://localhost:3000` |

### Super Admin Credentials

| Secret Name | Description | Example Format |
|------------|-------------|----------------|
| `TEST_SUPER_ADMIN_EMAIL` | Email address for super admin test user | `superadmin@example.com` |
| `TEST_SUPER_ADMIN_PASSWORD` | Password for super admin test user | `SecureP@ssw0rd123` |

### Admin Credentials

| Secret Name | Description | Example Format |
|------------|-------------|----------------|
| `TEST_ADMIN_EMAIL` | Email address for admin test user | `admin@example.com` |
| `TEST_ADMIN_PASSWORD` | Password for admin test user | `AdminP@ss123` |

### Manager Credentials

| Secret Name | Description | Example Format |
|------------|-------------|----------------|
| `TEST_MANAGER_EMAIL` | Email address for manager test user | `manager@example.com` |
| `TEST_MANAGER_PASSWORD` | Password for manager test user | `ManagerP@ss123` |

### Employee Credentials

| Secret Name | Description | Example Format |
|------------|-------------|----------------|
| `TEST_EMPLOYEE_EMAIL` | Email address for employee test user | `employee@example.com` |
| `TEST_EMPLOYEE_PASSWORD` | Password for employee test user | `EmployeeP@ss123` |

### Shadow SBU Credentials

| Secret Name | Description | Example Format |
|------------|-------------|----------------|
| `TEST_SHADOW_SBU_EMAIL` | Email address for shadow SBU test user | `shadow.sbu@example.com` |
| `TEST_SHADOW_SBU_NAME` | Full name of shadow SBU test user | `Shadow SBU User` |
| `TEST_SHADOW_SBU_PASSWORD` | Password for shadow SBU test user | `ShadowP@ss123` |

### Total Required Secrets: 12

---

## Adding Secrets to Your Repository

Follow these steps for **each secret** listed in the table above:

### Step-by-Step Process

1. **Click "New repository secret"** button on the Actions secrets page

2. **Enter the secret name** in the "Name" field
   - Use the exact name from the table above (e.g., `BASE_URL`)
   - Names are case-sensitive and must match exactly
   - Use underscores, not hyphens or spaces

3. **Enter the secret value** in the "Secret" field
   - Paste or type the actual value (e.g., `https://your-app.example.com`)
   - The value will be masked with asterisks after saving
   - Do not include quotes around the value

4. **Click "Add secret"** button to save

5. **Repeat** steps 1-4 for each of the 12 required secrets

### Example: Adding BASE_URL Secret

```
Name: BASE_URL
Secret: https://your-app.example.com
```

After clicking "Add secret", you'll see it listed on the secrets page with a masked value (`***`).

---

## Environment Variables Precedence

The workflow uses a two-tier system for loading environment variables, ensuring flexibility while maintaining security.

### Precedence Order (Highest to Lowest)

1. **GitHub Secrets** (Highest Priority)
   - Values set in GitHub repository settings
   - Encrypted and secure
   - Override any other source
   - Recommended for production and CI/CD environments

2. **.env Files** (Fallback)
   - Located in `env/` directory (`env/prod.env`, `env/local.env`)
   - Used when GitHub Secrets are not configured
   - Useful for local development
   - Should not contain production credentials

### How It Works

The workflow configuration in `utils/global-setup.ts` uses:

```typescript
dotenv.config({ override: false })
```

This means:
- If a variable is **already set** (from GitHub Secrets), it will **NOT be overridden** by .env files
- If a variable is **not set**, it will be **loaded from** the appropriate .env file based on `test_env` input

### Configuration Scenarios

#### Scenario 1: Full GitHub Secrets Configuration (Recommended)
- All 12 secrets configured in GitHub
- .env files are ignored
- Most secure approach for CI/CD

#### Scenario 2: Partial GitHub Secrets Configuration
- Some secrets configured in GitHub (e.g., `BASE_URL`)
- Missing secrets loaded from .env files
- Useful during migration or testing

#### Scenario 3: No GitHub Secrets (Local Development)
- No secrets configured in GitHub
- All variables loaded from .env files
- Suitable for local development only

### Environment Selection

When triggering the workflow, you select the `test_env` input:
- **`prod`**: Loads `env/prod.env` as fallback
- **`local`**: Loads `env/local.env` as fallback

---

## Verification

After adding all secrets, verify your configuration:

### 1. Check Secrets List

On the Actions secrets page, you should see all 12 secrets listed:
- BASE_URL
- TEST_SUPER_ADMIN_EMAIL
- TEST_SUPER_ADMIN_PASSWORD
- TEST_ADMIN_EMAIL
- TEST_ADMIN_PASSWORD
- TEST_MANAGER_EMAIL
- TEST_MANAGER_PASSWORD
- TEST_EMPLOYEE_EMAIL
- TEST_EMPLOYEE_PASSWORD
- TEST_SHADOW_SBU_EMAIL
- TEST_SHADOW_SBU_NAME
- TEST_SHADOW_SBU_PASSWORD

### 2. Test the Workflow

1. Go to the **Actions** tab in your repository
2. Select **"Playwright Tests"** workflow from the left sidebar
3. Click **"Run workflow"** dropdown button
4. Select your desired environment (`prod` or `local`)
5. Optionally add test tags (e.g., `@user-management`)
6. Click **"Run workflow"** button
7. Monitor the workflow execution

### 3. Check Workflow Logs

In the workflow run logs, verify:
- No "missing environment variables" errors
- Tests execute against the correct environment
- BASE_URL matches your expected value (visible in test output)

---

## Troubleshooting

### Issue: "Missing required environment variables" Error

**Symptoms:**
- Workflow fails with error message listing missing variables
- Tests don't execute

**Solutions:**
1. Verify all 12 required secrets are added to GitHub
2. Check secret names match exactly (case-sensitive)
3. Ensure no typos in secret names
4. Confirm you're in the correct repository

**How to Fix:**
- Go to Settings → Secrets and variables → Actions → Secrets
- Compare your list with the [Required Secrets](#required-secrets) table
- Add any missing secrets

---

### Issue: Tests Run Against Wrong Environment

**Symptoms:**
- Tests execute but fail due to incorrect BASE_URL
- Login credentials don't work

**Solutions:**
1. Verify `BASE_URL` secret value is correct for your environment
2. Check that you selected the correct `test_env` when triggering workflow
3. Ensure credentials match the target environment

**How to Fix:**
- Update the `BASE_URL` secret:
  - Go to the secret in GitHub settings
  - Click "Update" button
  - Enter the correct URL
  - Save changes

---

### Issue: Cannot Find "Secrets and variables" in Settings

**Symptoms:**
- Settings page doesn't show "Secrets and variables" option

**Solutions:**
1. Verify you have admin or write access to the repository
2. Check if you're in the repository settings (not your personal settings)
3. Ensure you're looking in the "Security" section of the left sidebar

**How to Fix:**
- Contact repository owner to grant you appropriate permissions
- Required permission: "Write" access or higher

---

### Issue: Secret Values Are Incorrect

**Symptoms:**
- Tests fail with authentication errors
- Workflow runs but tests cannot log in

**Solutions:**
1. Verify secret values match your test environment credentials
2. Check for extra spaces or characters in secret values
3. Ensure passwords meet application requirements

**How to Fix:**
- Update each incorrect secret:
  - Navigate to the secret in GitHub settings
  - Click "Update" button
  - Re-enter the correct value (copy-paste recommended)
  - Save changes
- Re-run the workflow to test

---

### Issue: Secrets Work Locally but Not in GitHub Actions

**Symptoms:**
- Tests pass locally with .env files
- Same tests fail in GitHub Actions workflow

**Solutions:**
1. Confirm GitHub Secrets are configured (they don't auto-sync from .env)
2. Verify secret values match your .env file values
3. Check for environment-specific differences (URLs, credentials)

**How to Fix:**
- Manually copy values from your .env files to GitHub Secrets
- Ensure `BASE_URL` points to an accessible environment from GitHub runners
- If using `localhost`, change to a publicly accessible URL or staging environment

---

### Issue: "Secret not found" During Workflow Execution

**Symptoms:**
- Workflow logs show empty values for environment variables
- Error: "Secret not found" or similar

**Solutions:**
1. Verify secrets are added at repository level (not organization or environment level)
2. Check secret names in workflow file match GitHub Secrets exactly
3. Ensure workflow has permission to access secrets

**How to Fix:**
- Re-add secrets at the repository level
- Check `.github/workflows/playwright-tests.yml` for correct secret references
- Verify workflow permissions in repository settings

---

### Issue: Need to Rotate/Update Credentials

**Symptoms:**
- Credentials have changed in the application
- Security policy requires credential rotation

**Solutions:**
1. Update secrets one at a time to avoid breaking the workflow
2. Test after each update if possible

**How to Fix:**
1. Navigate to Settings → Secrets and variables → Actions → Secrets
2. Find the secret to update
3. Click "Update" button
4. Enter new value
5. Click "Update secret"
6. Run workflow to verify

---

### Issue: Workflow Runs but Artifacts Are Empty

**Symptoms:**
- Workflow completes successfully
- Artifacts are uploaded but contain no files or are empty

**Solutions:**
1. This is not a secrets issue - check test execution logs
2. Verify tests are actually running (not skipped)
3. Check Playwright configuration for report output paths

**How to Fix:**
- Review workflow logs for test execution details
- Ensure tests generate reports in expected directories
- Check `playwright.config.ts` reporter configuration

---

## Additional Resources

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [GitHub Actions Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Playwright Configuration](https://playwright.dev/docs/test-configuration)

---

## Security Best Practices

1. **Never commit secrets to version control**
   - Keep .env files in `.gitignore`
   - Use GitHub Secrets for CI/CD

2. **Use strong passwords**
   - Follow your organization's password policy
   - Use unique passwords for test accounts

3. **Rotate credentials regularly**
   - Update secrets periodically
   - Update immediately if compromised

4. **Limit access**
   - Only grant repository access to trusted team members
   - Use principle of least privilege

5. **Use environment-specific credentials**
   - Don't use production credentials for testing
   - Create dedicated test accounts

6. **Monitor workflow logs**
   - Review logs for suspicious activity
   - Ensure secrets are properly masked in logs

---

## Need Help?

If you encounter issues not covered in this guide:

1. Check the [main README.md](../README.md) for general project setup
2. Review the [workflow documentation](.github/workflows/README.md) for advanced configuration
3. Contact your team lead or DevOps engineer
4. Open an issue in the repository with:
   - Description of the problem
   - Steps to reproduce
   - Workflow run URL (if applicable)
   - Screenshots (ensure no secrets are visible)

