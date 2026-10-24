-- SnapCut AI — PostgreSQL Schema & RLS Test Suite
-- Run via: psql -f supabase/tests/schema_test.sql

BEGIN;

SELECT plan(7);

-- Test 1: Profiles table exists
SELECT has_table('public', 'profiles', 'profiles table should exist');

-- Test 2: Processing jobs table exists
SELECT has_table('public', 'processing_jobs', 'processing_jobs table should exist');

-- Test 3: Credit accounts table exists
SELECT has_table('public', 'credit_accounts', 'credit_accounts table should exist');

-- Test 4: Credit ledger table exists
SELECT has_table('public', 'credit_ledger', 'credit_ledger table should exist');

-- Test 5: Subscriptions table exists
SELECT has_table('public', 'subscriptions', 'subscriptions table should exist');

-- Test 6: Plans table exists
SELECT has_table('public', 'plans', 'plans table should exist');

-- Test 7: Atomic reservation function exists
SELECT has_function('public', 'reserve_processing_credit', 'reserve_processing_credit function should exist');

SELECT * FROM finish();
ROLLBACK;
