import { createClient } from "@supabase/supabase-js";

/**
 * Integration test setup for Supabase.
 *
 * CONFIGURATION REQUIREMENTS:
 * ---------------------------
 * To run integration tests, you need to configure a Supabase instance.
 * You have two options:
 *
 * Option 1: Local Supabase (Recommended for development)
 * -------------------------------------------------------
 * 1. Install Supabase CLI: https://supabase.com/docs/guides/cli
 * 2. Run: supabase init
 * 3. Run: supabase start
 * 4. Use the local credentials (typically http://localhost:54321)
 *
 * Option 2: Cloud Supabase Instance
 * ----------------------------------
 * 1. Create a test project at https://supabase.com
 * 2. Use a separate project from production
 * 3. Get your project URL and anon key
 *
 * ENVIRONMENT VARIABLES:
 * ----------------------
 * Set these in your environment before running tests:
 * - SUPABASE_TEST_URL: Your Supabase instance URL
 * - SUPABASE_TEST_ANON_KEY: Your Supabase anon key
 *
 * For local testing, you can create a .env.test.local file:
 *   SUPABASE_TEST_URL=http://localhost:54321
 *   SUPABASE_TEST_ANON_KEY=your-local-anon-key
 */

export type TestSupabaseClient = ReturnType<typeof createClient>;

/**
 * Create a Supabase client for integration testing.
 *
 * @throws {Error} If required environment variables are not set
 * @returns Configured Supabase client for testing
 */
export function createTestSupabaseClient(): TestSupabaseClient {
  const url = process.env.SUPABASE_TEST_URL;
  const anonKey = process.env.SUPABASE_TEST_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Integration test configuration missing.\n\n" +
        "Required environment variables:\n" +
        "  - SUPABASE_TEST_URL\n" +
        "  - SUPABASE_TEST_ANON_KEY\n\n" +
        "For local development:\n" +
        "  1. Install Supabase CLI: https://supabase.com/docs/guides/cli\n" +
        "  2. Run: supabase start\n" +
        "  3. Set environment variables with local credentials\n\n" +
        "For cloud testing:\n" +
        "  1. Create a test project at https://supabase.com\n" +
        "  2. Set SUPABASE_TEST_URL and SUPABASE_TEST_ANON_KEY"
    );
  }

  return createClient(url, anonKey);
}

/**
 * Check if integration tests should be skipped.
 *
 * @returns true if Supabase is not configured, false otherwise
 */
export function shouldSkipIntegrationTests(): boolean {
  return !process.env.SUPABASE_TEST_URL || !process.env.SUPABASE_TEST_ANON_KEY;
}
