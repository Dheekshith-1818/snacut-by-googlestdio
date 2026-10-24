# SnapCut AI — Production Deployment Verification Checklist

This checklist must be executed and signed off prior to production launch:

## 1. Supabase Cloud Configuration
- [ ] Execute `supabase/migrations/20261024000000_snapcut_schema.sql` in Supabase SQL Editor.
- [ ] Confirm RLS is enabled on all 11 tables (`profiles`, `plans`, `subscriptions`, `credit_accounts`, `daily_usage`, `processing_jobs`, `credit_ledger`, `transactions`, `api_keys`, `api_usage`, `audit_logs`).
- [ ] Configure Google OAuth in Supabase Auth > Providers.
- [ ] Verify `reserve_processing_credit` stored procedure executes successfully.

## 2. n8n Cloud Configuration
- [ ] Import `n8n/workflows/workflow_a_image_processing.json`.
- [ ] Import `n8n/workflows/workflow_b_razorpay_order.json`.
- [ ] Import `n8n/workflows/workflow_c_razorpay_webhook.json`.
- [ ] Import `n8n/workflows/workflow_d_asset_cleanup.json` and enable hourly cron.
- [ ] Import `n8n/workflows/workflow_e_operational_monitoring.json`.
- [ ] Configure credentials: Postgres (Supabase), Remove.bg API Header, Cloudinary, Razorpay Basic Auth.

## 3. Cloudinary Ephemeral Storage
- [ ] Set default upload folder to `snapcut/`.
- [ ] Enable signed delivery URLs for private access.
- [ ] Test public ID deletion call via API.

## 4. Razorpay Payments
- [ ] Configure webhook endpoint in Razorpay Dashboard: `https://<n8n-or-server>/webhooks/razorpay`.
- [ ] Subscribe to `payment.captured`, `order.paid`, `subscription.charged`.
- [ ] Verify secret matching `RAZORPAY_WEBHOOK_SECRET`.
- [ ] Perform test payment with dummy card and confirm credit balance updates atomically.

## 5. Vercel Frontend Deployment
- [ ] Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel Project Settings.
- [ ] Deploy main branch via `npm run build`.
- [ ] Confirm Lighthouse performance > 90.
