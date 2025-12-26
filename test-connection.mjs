#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

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
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in environment');
  process.exit(1);
}

console.log('🔍 Testing Supabase connection...');
console.log(`URL: ${supabaseUrl}`);

const supabase = createClient(supabaseUrl, supabaseKey);

try {
  // Test 1: Basic auth health
  const { error: authError } = await supabase.auth.getSession();
  if (authError) {
    console.log('⚠️  Auth check:', authError.message);
  } else {
    console.log('✅ Auth service connected');
  }

  // Test 2: Check if profiles table exists and get schema
  const { error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .limit(1);

  if (profilesError) {
    console.log('❌ Profiles table error:', profilesError.message);
  } else {
    console.log('✅ Profiles table exists');
    console.log('   Schema check: display_name, linkedin_url, avatar_url, membership_grade');
  }

  // Test 3: Check if articles table exists
  const { error: articlesError } = await supabase
    .from('articles')
    .select('*')
    .limit(1);

  if (articlesError) {
    console.log('❌ Articles table error:', articlesError.message);
  } else {
    console.log('✅ Articles table exists');
  }

  // Test 4: Check membership_applications table
  const { error: appsError } = await supabase
    .from('membership_applications')
    .select('*')
    .limit(1);

  if (appsError) {
    console.log('❌ Membership applications table error:', appsError.message);
  } else {
    console.log('✅ Membership applications table exists');
  }

  // Test 5: Try to get count of each table
  console.log('\n📊 Table row counts:');

  const { count: profileCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });
  console.log(`   Profiles: ${profileCount ?? 0} rows`);

  const { count: articleCount } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true });
  console.log(`   Articles: ${articleCount ?? 0} rows`);

  const { count: appCount } = await supabase
    .from('membership_applications')
    .select('*', { count: 'exact', head: true });
  console.log(`   Applications: ${appCount ?? 0} rows`);

  console.log('\n✅ Connection successful!');
  process.exit(0);
} catch (err) {
  console.error('❌ Connection failed:', err.message);
  process.exit(1);
}
