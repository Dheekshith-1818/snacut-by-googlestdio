export type UserRole = 'user' | 'pro' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export type JobStatus =
  | 'queued'
  | 'uploading'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'expired';

export type AIProvider = 'remove_bg' | 'clipdrop' | 'photoroom' | 'edge_ai_fallback';

export interface ProcessingJob {
  id: string;
  user_id: string;
  original_filename: string;
  input_format: string;
  output_format: string;
  input_size_bytes: number;
  input_width: number;
  input_height: number;
  status: JobStatus;
  provider: AIProvider;
  provider_job_reference?: string;
  original_asset_id: string;
  original_asset_url: string;
  processed_asset_id?: string;
  processed_asset_url?: string;
  processing_duration_ms?: number;
  failure_code?: string;
  failure_message?: string;
  created_at: string;
  completed_at?: string;
  expires_at: string;
  deleted_at?: string;
  idempotency_key: string;
}

export interface CreditAccount {
  user_id: string;
  purchased_balance: number;
  updated_at: string;
}

export type LedgerEntryType =
  | 'purchase'
  | 'reservation'
  | 'consumption'
  | 'refund'
  | 'release'
  | 'admin_adjustment';

export interface CreditLedgerEntry {
  id: string;
  user_id: string;
  job_id?: string;
  transaction_id?: string;
  entry_type: LedgerEntryType;
  amount: number; // positive for credits added, negative for deducted
  balance_after: number;
  idempotency_key: string;
  reason: string;
  created_at: string;
}

export type SubscriptionStatus =
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'incomplete'
  | 'trialing';

export interface Plan {
  id: string;
  name: string;
  price_minor_units: number; // in paise: 49900 = ₹499
  currency: string;
  billing_interval: 'month' | 'year' | 'one_time';
  daily_limit: number;
  monthly_limit: number;
  features: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  provider_subscription_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

export type TransactionStatus =
  | 'pending'
  | 'successful'
  | 'failed'
  | 'refunded'
  | 'cancelled';

export interface Transaction {
  id: string;
  user_id: string;
  provider: 'razorpay' | 'manual_admin';
  provider_order_id: string;
  provider_payment_id?: string;
  provider_event_id?: string;
  amount_minor_units: number; // paise
  currency: string;
  status: TransactionStatus;
  transaction_type: 'subscription' | 'credit_pack';
  idempotency_key: string;
  created_at: string;
  updated_at: string;
}

export interface ApiKey {
  id: string;
  user_id: string;
  name: string;
  key_hash: string;
  key_prefix: string; // e.g. "sc_live_9a7f"
  last_used_at?: string;
  revoked_at?: string;
  created_at: string;
}

export interface ApiUsage {
  id: string;
  api_key_id: string;
  request_id: string;
  status_code: number;
  processing_duration_ms: number;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_user_id?: string;
  actor_email?: string;
  action: string;
  target_type: string;
  target_id: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface DailyUsage {
  user_id: string;
  usage_date: string; // YYYY-MM-DD
  successful_jobs: number;
  reserved_jobs: number;
  updated_at: string;
}

export interface UserEntitlements {
  daily_limit: number;
  daily_used: number;
  daily_remaining: number;
  purchased_credits: number;
  total_available_credits: number;
  plan: Plan;
  subscription?: Subscription;
}
