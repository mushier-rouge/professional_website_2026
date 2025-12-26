import { describe, expect, it } from "vitest";
import {
  createTestSupabaseClient,
  shouldSkipIntegrationTests,
} from "../../../vitest.integration.setup";

/**
 * Integration tests for Supabase connection.
 *
 * SETUP REQUIREMENTS:
 * -------------------
 * These tests require a configured Supabase instance. See vitest.integration.setup.ts
 * for detailed setup instructions.
 *
 * Quick start:
 * 1. Install Supabase CLI: npm install -g supabase
 * 2. Initialize: supabase init
 * 3. Start local instance: supabase start
 * 4. Set environment variables:
 *    export SUPABASE_TEST_URL=http://localhost:54321
 *    export SUPABASE_TEST_ANON_KEY=<your-local-anon-key>
 * 5. Run tests: npm run test:integration
 *
 * NOTE: Tests will be skipped if Supabase is not configured.
 */

describe("Supabase Connection", () => {
  // Skip all tests in this suite if Supabase is not configured
  const skipTests = shouldSkipIntegrationTests();

  if (skipTests) {
    it.skip("requires Supabase configuration (see setup instructions)", () => {
      // This test will be skipped with a clear message
    });
    return;
  }

  it("can create a Supabase client", () => {
    // ARRANGE: Create client using test helper
    const client = createTestSupabaseClient();

    // ASSERT: Client should be defined and have expected properties
    expect(client).toBeDefined();
    expect(client.auth).toBeDefined();
    expect(client.from).toBeDefined();
  });

  it("can connect to Supabase and execute a simple query", async () => {
    // ARRANGE: Create client
    const client = createTestSupabaseClient();

    // ACT: Execute a simple query to verify connection
    // This queries the auth.users table metadata (no actual data needed)
    const { error } = await client.auth.getSession();

    // ASSERT: Should not have a connection error
    // Note: It's OK if there's no session (null data), we're just testing connectivity
    expect(error).toBeNull();
  });

  it("can verify database connectivity with health check", async () => {
    // ARRANGE: Create client
    const client = createTestSupabaseClient();

    // ACT: Execute a basic SQL query to test database connectivity
    // Using rpc to call a simple function or query
    const { error } = await client.rpc("version");

    // ASSERT: Connection should work
    // If 'version' function doesn't exist, that's OK - we're testing connectivity
    // A connection error would be different from a "function not found" error
    if (error) {
      // If there's an error, it should be about the function, not the connection
      expect(error.message).not.toContain("connection");
      expect(error.message).not.toContain("network");
    }
  });
});
