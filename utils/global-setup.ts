import { FullConfig } from "@playwright/test";
import dotenv from "dotenv";

/**
 * Global setup for Playwright tests
 * 
 * Environment Variable Loading Precedence:
 * 1. GitHub Secrets (highest priority) - Set in CI/CD environment
 * 2. .env files (fallback) - Loaded from env/{test_env}.env
 * 
 * The `override: false` configuration ensures that environment variables
 * already set (e.g., from GitHub Secrets) are NOT overwritten by .env files.
 * This allows GitHub Secrets to take precedence while providing fallback
 * values from .env files for local development or when secrets are not configured.
 */
async function globalSetup(config: FullConfig) {
  const testEnv = process.env.test_env || process.env.TEST_ENV || "prod";

  if (testEnv) {
    // Load environment variables from .env file
    // override: false ensures GitHub Secrets take precedence
    dotenv.config({
      path: `env/${testEnv}.env`,
      override: false,
    });
  }
}
export default globalSetup;
