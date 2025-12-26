#!/usr/bin/env node
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

// Read .env.local file
const envContent = readFileSync('.env.local', 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim().replace(/^["']|["']$/g, '');
    envVars[key] = value;
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

// Extract project ref from URL
const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)[1];

console.log('🔍 Applying migrations to Supabase...');
console.log(`URL: ${supabaseUrl}`);
console.log(`Project: ${projectRef}\n`);

// Read all migration files
const migrationsDir = 'supabase/migrations';
const migrationFiles = readdirSync(migrationsDir)
  .filter(f => f.endsWith('.sql'))
  .sort();

console.log(`Found ${migrationFiles.length} migration files:\n`);

let successCount = 0;
let failCount = 0;

for (const file of migrationFiles) {
  console.log(`📄 ${file}`);
  const sql = readFileSync(join(migrationsDir, file), 'utf-8');

  try {
    // Use Supabase SQL endpoint
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ query: sql })
    });

    if (response.ok || response.status === 204) {
      console.log('   ✅ Applied successfully\n');
      successCount++;
    } else {
      // Try alternative approach - direct query execution
      const response2 = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
        },
        body: JSON.stringify({ query: sql })
      });

      if (response2.ok || response2.status === 204) {
        console.log('   ✅ Applied successfully (alternative method)\n');
        successCount++;
      } else {
        console.log(`   ⚠️  HTTP ${response.status}: Auto-apply not available`);
        console.log('   Manual application required\n');
        failCount++;
      }
    }
  } catch (err) {
    console.log(`   ⚠️  Error: ${err.message}`);
    console.log('   Manual application required\n');
    failCount++;
  }
}

console.log('\n' + '═'.repeat(70));
console.log(`📊 SUMMARY: ${successCount} succeeded, ${failCount} need manual application`);
console.log('═'.repeat(70));

if (failCount > 0) {
  console.log('\n📋 MANUAL MIGRATION REQUIRED:');
  console.log(`\n1. Open: https://supabase.com/dashboard/project/${projectRef}/sql/new`);
  console.log('\n2. Copy and execute each migration file in order:');
  migrationFiles.forEach((file, i) => {
    console.log(`   ${i + 1}. ${file}`);
  });
  console.log('\n3. Or use Supabase CLI:');
  console.log('   supabase db push --linked');
  console.log('\n');
}
