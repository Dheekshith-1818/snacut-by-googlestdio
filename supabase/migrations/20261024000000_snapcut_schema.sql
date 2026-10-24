-- SnapCut AI — Production PostgreSQL Database Schema & RLS Policies
-- Migration: 20261024000000_snapcut_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'pro', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own display_name"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Admins have full access to profiles"
    ON public.profiles FOR ALL
    USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- 2. PLANS (Configurable monetization tiers)
CREATE TABLE IF NOT EXISTS public.plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price_minor_units INTEGER NOT NULL, -- e.g. 49900 = ₹499
    currency TEXT NOT NULL DEFAULT 'INR',
    billing_interval TEXT NOT NULL CHECK (billing_interval IN ('month', 'year', 'one_time')),
    daily_limit INTEGER NOT NULL DEFAULT 5,
    monthly_limit INTEGER NOT NULL DEFAULT 150,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access to active plans"
    ON public.plans FOR SELECT
    USING (is_active = true);

-- 3. SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    provider_subscription_id TEXT UNIQUE NOT NULL,
    plan_id TEXT NOT NULL REFERENCES public.plans(id),
    status TEXT NOT NULL CHECK (status IN ('active', 'past_due', 'canceled', 'incomplete', 'trialing')),
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own subscriptions"
    ON public.subscriptions FOR SELECT
    USING (auth.uid() = user_id);

-- 4. CREDIT ACCOUNTS (Purchased non-expiring credit pool)
CREATE TABLE IF NOT EXISTS public.credit_accounts (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    purchased_balance INTEGER NOT NULL DEFAULT 0 CHECK (purchased_balance >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.credit_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their credit balance"
    ON public.credit_accounts FOR SELECT
    USING (auth.uid() = user_id);

-- 5. DAILY USAGE (Resets each UTC day)
CREATE TABLE IF NOT EXISTS public.daily_usage (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
    successful_jobs INTEGER NOT NULL DEFAULT 0,
    reserved_jobs INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (user_id, usage_date)
);

ALTER TABLE public.daily_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their daily usage"
    ON public.daily_usage FOR SELECT
    USING (auth.uid() = user_id);

-- 6. PROCESSING JOBS
CREATE TABLE IF NOT EXISTS public.processing_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    original_filename TEXT NOT NULL,
    input_format TEXT NOT NULL,
    output_format TEXT NOT NULL DEFAULT 'image/png',
    input_size_bytes INTEGER NOT NULL CHECK (input_size_bytes <= 10485760), -- <= 10MB
    input_width INTEGER NOT NULL CHECK (input_width <= 5000),
    input_height INTEGER NOT NULL CHECK (input_height <= 5000),
    status TEXT NOT NULL CHECK (status IN ('queued', 'uploading', 'processing', 'completed', 'failed', 'cancelled', 'expired')),
    provider TEXT NOT NULL,
    provider_job_reference TEXT,
    original_asset_id TEXT NOT NULL,
    processed_asset_id TEXT,
    processing_duration_ms INTEGER,
    failure_code TEXT,
    failure_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    completed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (timezone('utc'::text, now()) + INTERVAL '24 hours'),
    deleted_at TIMESTAMPTZ,
    idempotency_key TEXT UNIQUE NOT NULL
);

ALTER TABLE public.processing_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view their own jobs"
    ON public.processing_jobs FOR SELECT
    USING (auth.uid() = user_id);

-- 7. CREDIT LEDGER (Immutable audit trail)
CREATE TABLE IF NOT EXISTS public.credit_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    job_id UUID REFERENCES public.processing_jobs(id),
    transaction_id TEXT,
    entry_type TEXT NOT NULL CHECK (entry_type IN ('purchase', 'reservation', 'consumption', 'refund', 'release', 'admin_adjustment')),
    amount INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    idempotency_key TEXT UNIQUE NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.credit_ledger ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view their own credit ledger"
    ON public.credit_ledger FOR SELECT
    USING (auth.uid() = user_id);

-- 8. TRANSACTIONS (Razorpay payments)
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    provider TEXT NOT NULL DEFAULT 'razorpay',
    provider_order_id TEXT UNIQUE NOT NULL,
    provider_payment_id TEXT UNIQUE,
    provider_event_id TEXT UNIQUE,
    amount_minor_units INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL CHECK (status IN ('pending', 'successful', 'failed', 'refunded', 'cancelled')),
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('subscription', 'credit_pack')),
    idempotency_key TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view their own transactions"
    ON public.transactions FOR SELECT
    USING (auth.uid() = user_id);

-- 9. API KEYS
CREATE TABLE IF NOT EXISTS public.api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    key_hash TEXT NOT NULL UNIQUE,
    key_prefix TEXT NOT NULL,
    last_used_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view and manage their API keys"
    ON public.api_keys FOR SELECT
    USING (auth.uid() = user_id);

-- 10. API USAGE
CREATE TABLE IF NOT EXISTS public.api_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    api_key_id UUID NOT NULL REFERENCES public.api_keys(id) ON DELETE CASCADE,
    request_id TEXT NOT NULL,
    status_code INTEGER NOT NULL,
    processing_duration_ms INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.api_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view API key usage"
    ON public.api_usage FOR SELECT
    USING (EXISTS (SELECT 1 FROM public.api_keys WHERE id = api_usage.api_key_id AND user_id = auth.uid()));

-- 11. AUDIT LOGS (Admin actions & system security)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_user_id UUID REFERENCES public.profiles(id),
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins view audit logs"
    ON public.audit_logs FOR SELECT
    USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- INDEXES for frequent lookups
CREATE INDEX IF NOT EXISTS idx_jobs_user_status ON public.processing_jobs(user_id, status);
CREATE INDEX IF NOT EXISTS idx_jobs_expires_at ON public.processing_jobs(expires_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_transactions_user ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_ledger_user ON public.credit_ledger(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON public.api_keys(key_hash);

-- ATOMIC POSTGRESQL FUNCTIONS

-- Function 1: Atomically reserve credit or daily quota for a job
CREATE OR REPLACE FUNCTION public.reserve_processing_credit(
    p_user_id UUID,
    p_job_id UUID,
    p_idempotency_key TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_daily_limit INTEGER;
    v_successful INTEGER;
    v_reserved INTEGER;
    v_purchased_bal INTEGER;
    v_today DATE := CURRENT_DATE;
BEGIN
    -- Determine user daily limit
    SELECT COALESCE(p.daily_limit, 5) INTO v_daily_limit
    FROM public.profiles u
    LEFT JOIN public.subscriptions s ON s.user_id = u.id AND s.status = 'active'
    LEFT JOIN public.plans p ON p.id = s.plan_id
    WHERE u.id = p_user_id;

    IF v_daily_limit IS NULL THEN
        v_daily_limit := 5;
    END IF;

    -- Ensure daily_usage row exists
    INSERT INTO public.daily_usage (user_id, usage_date, successful_jobs, reserved_jobs)
    VALUES (p_user_id, v_today, 0, 0)
    ON CONFLICT (user_id, usage_date) DO NOTHING;

    -- Lock usage row for update
    SELECT successful_jobs, reserved_jobs INTO v_successful, v_reserved
    FROM public.daily_usage
    WHERE user_id = p_user_id AND usage_date = v_today
    FOR UPDATE;

    -- If daily limit has room, reserve daily quota
    IF (v_successful + v_reserved) < v_daily_limit THEN
        UPDATE public.daily_usage
        SET reserved_jobs = reserved_jobs + 1, updated_at = now()
        WHERE user_id = p_user_id AND usage_date = v_today;

        RETURN jsonb_build_object('success', true, 'source', 'daily_quota');
    END IF;

    -- Otherwise check purchased credits
    SELECT purchased_balance INTO v_purchased_bal
    FROM public.credit_accounts
    WHERE user_id = p_user_id
    FOR UPDATE;

    IF v_purchased_bal IS NOT NULL AND v_purchased_bal > 0 THEN
        -- Lock 1 purchased credit
        UPDATE public.credit_accounts
        SET purchased_balance = purchased_balance - 1, updated_at = now()
        WHERE user_id = p_user_id;

        INSERT INTO public.credit_ledger (
            user_id, job_id, entry_type, amount, balance_after, idempotency_key, reason
        ) VALUES (
            p_user_id, p_job_id, 'reservation', -1, v_purchased_bal - 1, p_idempotency_key, 'Processing Credit Reservation'
        );

        RETURN jsonb_build_object('success', true, 'source', 'purchased_credits');
    END IF;

    RETURN jsonb_build_object('success', false, 'error', 'INSUFFICIENT_CREDITS');
END;
$$;

-- Function 2: Commit reserved credit upon job completion
CREATE OR REPLACE FUNCTION public.commit_processing_credit(
    p_user_id UUID,
    p_job_id UUID,
    p_source TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF p_source = 'daily_quota' THEN
        UPDATE public.daily_usage
        SET reserved_jobs = GREATEST(0, reserved_jobs - 1),
            successful_jobs = successful_jobs + 1,
            updated_at = now()
        WHERE user_id = p_user_id AND usage_date = CURRENT_DATE;
    END IF;
    -- If purchased_credits, reservation already debited the balance; nothing more to debit
END;
$$;

-- Function 3: Release reserved credit if processing fails
CREATE OR REPLACE FUNCTION public.release_processing_credit(
    p_user_id UUID,
    p_job_id UUID,
    p_source TEXT,
    p_idempotency_key TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_curr_bal INTEGER;
BEGIN
    IF p_source = 'daily_quota' THEN
        UPDATE public.daily_usage
        SET reserved_jobs = GREATEST(0, reserved_jobs - 1), updated_at = now()
        WHERE user_id = p_user_id AND usage_date = CURRENT_DATE;
    ELSIF p_source = 'purchased_credits' THEN
        SELECT purchased_balance INTO v_curr_bal
        FROM public.credit_accounts
        WHERE user_id = p_user_id FOR UPDATE;

        UPDATE public.credit_accounts
        SET purchased_balance = purchased_balance + 1, updated_at = now()
        WHERE user_id = p_user_id;

        INSERT INTO public.credit_ledger (
            user_id, job_id, entry_type, amount, balance_after, idempotency_key, reason
        ) VALUES (
            p_user_id, p_job_id, 'release', 1, v_curr_bal + 1, p_idempotency_key, 'Processing Failure Credit Release'
        );
    END IF;
END;
$$;
