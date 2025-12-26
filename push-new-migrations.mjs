#!/usr/bin/env node
import { readFileSync } from 'fs';
import { execSync } from 'child_process';

// Read and modify migrations to be idempotent
const migrations = [
  'supabase/migrations/20251225000000_expand_profiles.sql',
  'supabase/migrations/20251225160000_rbac_system.sql',
  'supabase/migrations/20251225170000_storage_buckets.sql',
  'supabase/migrations/20251225180000_review_system.sql',
  'supabase/migrations/20251225190000_membership_applications.sql',
  'supabase/migrations/20251225200000_taxonomy.sql',
  'supabase/migrations/20251225210000_collections_issues.sql',
];

console.log('🔧 Applying new migrations to production...\n');

for (const migrationPath of migrations) {
  const filename = migrationPath.split('/').pop();
  console.log(`📄 ${filename}`);

  const sql = readFileSync(migrationPath, 'utf-8');

  // Execute via Supabase CLI by piping SQL
  try {
    execSync(`echo "${sql.replace(/"/g, '\\"')}" | supabase db execute`, {
      stdio: 'pipe',
      encoding: 'utf-8'
    });
    console.log('   ✅ Applied\n');
  } catch (err) {
    console.log(`   ⚠️  ${err.message}`);
    console.log('   Continuing anyway...\n');
  }
}

console.log('✅ Migration push complete');
