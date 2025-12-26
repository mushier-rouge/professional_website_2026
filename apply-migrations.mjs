#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
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

console.log('🔍 Applying migrations to Supabase...');
console.log(`URL: ${supabaseUrl}\n`);

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Read all migration files
const migrationsDir = 'supabase/migrations';
const migrationFiles = readdirSync(migrationsDir)
  .filter(f => f.endsWith('.sql'))
  .sort();

console.log(`Found ${migrationFiles.length} migration files:\n`);

for (const file of migrationFiles) {
  console.log(`📄 Applying: ${file}`);
  const sql = readFileSync(join(migrationsDir, file), 'utf-8');

  try {
    const { error } = await supabase.rpc('exec_sql', { sql_string: sql });

    if (error) {
      // RPC might not exist, try direct query
      const { error: directError } = await supabase.from('_migrations').select('*').limit(1);

      if (directError) {
        console.log('   ⚠️  Cannot apply via RPC, manual application needed');
        console.log('   Copy this SQL to Supabase SQL Editor:');
        console.log('   ' + supabaseUrl.replace('https://', 'https://supabase.com/dashboard/project/') + '/sql/new');
        console.log('');
      }
    } else {
      console.log('   ✅ Applied successfully');
    }
  } catch (err) {
    console.log(`   ⚠️  Could not auto-apply: ${err.message}`);
  }
}

console.log('\n📋 MANUAL MIGRATION INSTRUCTIONS:');
console.log('═'.repeat(60));
console.log('Since auto-apply may not work, please manually run migrations:');
console.log('');
console.log('1. Go to: https://supabase.com/dashboard/project/cgjzowzomduwdxolcon/sql/new');
console.log('2. Copy and paste each migration file in order:');
migrationFiles.forEach((file, i) => {
  console.log(`   ${i + 1}. supabase/migrations/${file}`);
});
console.log('3. Click "Run" for each migration');
console.log('');
console.log('After applying, run: npm run test:integration');
console.log('═'.repeat(60));
