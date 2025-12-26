import { defineConfig } from "vitest/config";
import path from "path";
import { readFileSync } from "fs";

// Load environment variables from .env.local
try {
  const envContent = readFileSync('.env.local', 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
} catch {
  // .env.local file may not exist
}

/**
 * Vitest configuration for integration tests.
 *
 * Integration tests validate interactions with external services like Supabase,
 * testing server actions, RLS policies, and database operations against a real instance.
 *
 * Test naming convention: *.integration.test.ts files in any directory
 */
export default defineConfig({
  test: {
    // Include only integration tests
    include: ["**/*.integration.test.ts"],

    // Use Node environment for server-side integration tests
    environment: "node",

    // Setup file runs before all test suites
    setupFiles: ["./vitest.integration.setup.ts"],

    // Timeout for integration tests (10 seconds default, can be overridden per test)
    testTimeout: 10000,

    // Run tests sequentially to avoid race conditions with shared test data
    fileParallelism: false,
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
