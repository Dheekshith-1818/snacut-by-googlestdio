import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  ProcessingJob,
  CreditAccount,
  CreditLedgerEntry,
  Plan,
  Subscription,
  Transaction,
  ApiKey,
  AuditLog,
  UserEntitlements,
  JobStatus,
} from '../types';
import { getAIProvider } from '../services/aiProviderAdapter';

export const INITIAL_PLANS: Plan[] = [
  {
    id: 'plan_free',
    name: 'Free Starter',
    price_minor_units: 0,
    currency: 'INR',
    billing_interval: 'one_time',
    daily_limit: 5,
    monthly_limit: 150,
    features: [
      '5 free background removals / day',
      'Standard resolution output',
      'Preview with checkerboard transparency',
      '24-hour temporary file retention',
      'Recent processing history',
    ],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'plan_pro_monthly',
    name: 'Pro Monthly',
    price_minor_units: 49900, // ₹499
    currency: 'INR',
    billing_interval: 'month',
    daily_limit: 200,
    monthly_limit: 5000,
    features: [
      'Up to 200 high-speed removals / day',
      'Full resolution output up to 5000×5000 px',
      'Priority AI queue processing',
      'Commercial usage license',
      'Extended 7-day history metadata',
      'Developer API access with 5,000 req/mo',
      'Priority customer support',
    ],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export interface CreditPackOption {
  id: string;
  name: string;
  credits: number;
  price_minor_units: number;
  currency: string;
  badge?: string;
  popular?: boolean;
}

export const CREDIT_PACKS: CreditPackOption[] = [
  {
    id: 'pack_25',
    name: 'Starter Pack',
    credits: 25,
    price_minor_units: 9900, // ₹99
    currency: 'INR',
    badge: '₹3.96 / image',
  },
  {
    id: 'pack_100',
    name: 'Popular Pack',
    credits: 100,
    price_minor_units: 29900, // ₹299
    currency: 'INR',
    badge: '₹2.99 / image',
    popular: true,
  },
  {
    id: 'pack_500',
    name: 'Business Pack',
    credits: 500,
    price_minor_units: 99900, // ₹999
    currency: 'INR',
    badge: '₹1.99 / image',
  },
];

interface SnapCutState {
  user: UserProfile | null;
  plans: Plan[];
  creditAccount: CreditAccount;
  ledger: CreditLedgerEntry[];
  jobs: ProcessingJob[];
  subscription: Subscription | null;
  transactions: Transaction[];
  apiKeys: ApiKey[];
  auditLogs: AuditLog[];
  reservedCredits: number;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (email: string, pass: string, displayName: string) => Promise<boolean>;
  logout: () => void;
  switchUserRole: (role: 'user' | 'pro' | 'admin') => void;
  getEntitlements: () => UserEntitlements;
  createJob: (file: File) => Promise<{ jobId: string } | { error: string }>;
  retryJob: (jobId: string) => Promise<boolean>;
  cancelJob: (jobId: string) => boolean;
  createOrder: (planIdOrPackId: string, isSubscription: boolean) => Promise<Transaction>;
  verifyPayment: (params: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    transaction_id: string;
  }) => Promise<boolean>;
  cancelSubscription: () => boolean;
  generateApiKey: (name: string) => Promise<{ key: string; prefix: string }>;
  revokeApiKey: (keyId: string) => boolean;
  adminAdjustCredits: (userId: string, amount: number, reason: string) => boolean;
}

const SnapCutContext = createContext<SnapCutState | null>(null);

const STORAGE_KEY = 'snapcut_ai_saas_v1';

export const SnapCutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial persistent state
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_user`);
      if (saved) return JSON.parse(saved);
    } catch {}
    // Seed default authenticated pro user for immediate exploration
    return {
      id: 'usr_demo_01',
      email: 'demo@snapcut.ai',
      display_name: 'Alex Vance',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'user',
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      updated_at: new Date().toISOString(),
    };
  });

  const [creditAccount, setCreditAccount] = useState<CreditAccount>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_credits`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      user_id: 'usr_demo_01',
      purchased_balance: 15,
      updated_at: new Date().toISOString(),
    };
  });

  const [ledger, setLedger] = useState<CreditLedgerEntry[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_ledger`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'ledg_init_01',
        user_id: 'usr_demo_01',
        entry_type: 'purchase',
        amount: 15,
        balance_after: 15,
        idempotency_key: 'idem_welcome_bonus',
        reason: 'Welcome Promotional Credit Bonus',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
    ];
  });

  const [jobs, setJobs] = useState<ProcessingJob[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_jobs`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'job_sample_01',
        user_id: 'usr_demo_01',
        original_filename: 'camera_dslr.jpg',
        input_format: 'image/jpeg',
        output_format: 'image/png',
        input_size_bytes: 1420500,
        input_width: 1200,
        input_height: 800,
        status: 'completed',
        provider: 'edge_ai_fallback',
        original_asset_id: 'cld_sample_orig_01',
        original_asset_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
        processed_asset_id: 'cld_sample_proc_01',
        processed_asset_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
        processing_duration_ms: 640,
        created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
        completed_at: new Date(Date.now() - 3600000 * 4 + 640).toISOString(),
        expires_at: new Date(Date.now() + 86400000).toISOString(),
        idempotency_key: 'idem_sample_01',
      },
    ];
  });

  const [subscription, setSubscription] = useState<Subscription | null>(null);

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_txs`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'tx_seed_01',
        user_id: 'usr_demo_01',
        provider: 'razorpay',
        provider_order_id: 'order_K8dJ298a0cZ8',
        provider_payment_id: 'pay_K8dJz90L3Xy',
        amount_minor_units: 9900,
        currency: 'INR',
        status: 'successful',
        transaction_type: 'credit_pack',
        idempotency_key: 'idem_tx_seed_01',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
    ];
  });

  const [apiKeys, setApiKeys] = useState<ApiKey[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_keys`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'key_demo_01',
        user_id: 'usr_demo_01',
        name: 'Shopify Store Integration',
        key_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        key_prefix: 'sc_live_4f9a',
        last_used_at: new Date(Date.now() - 3600000 * 2).toISOString(),
        created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
    ];
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_audit`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'aud_init_01',
        actor_email: 'system',
        action: 'system.bootstrap',
        target_type: 'app',
        target_id: 'snapcut_core',
        metadata: { version: '1.0.0', rls: 'enforced', retention_hours: 24 },
        created_at: new Date().toISOString(),
      },
    ];
  });

  const [reservedCredits, setReservedCredits] = useState<number>(0);

  // Sync state to localStorage
  useEffect(() => {
    if (user) localStorage.setItem(`${STORAGE_KEY}_user`, JSON.stringify(user));
    else localStorage.removeItem(`${STORAGE_KEY}_user`);
  }, [user]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_credits`, JSON.stringify(creditAccount));
  }, [creditAccount]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_ledger`, JSON.stringify(ledger));
  }, [ledger]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_jobs`, JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_txs`, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_keys`, JSON.stringify(apiKeys));
  }, [apiKeys]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_audit`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Auth methods
  const login = async (email: string) => {
    const role = email.includes('admin') ? 'admin' : email.includes('pro') ? 'pro' : 'user';
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      email,
      display_name: email.split('@')[0],
      role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setUser(newUser);
    return true;
  };

  const signup = async (email: string, _pass: string, displayName: string) => {
    const role = email.includes('admin') ? 'admin' : 'user';
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      email,
      display_name: displayName || email.split('@')[0],
      role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setUser(newUser);

    // Give new user welcome ledger entry
    const welcomeEntry: CreditLedgerEntry = {
      id: `ledg_${Date.now()}`,
      user_id: newUser.id,
      entry_type: 'purchase',
      amount: 5,
      balance_after: 5,
      idempotency_key: `idem_welcome_${newUser.id}`,
      reason: 'Sign-up Welcome Credits',
      created_at: new Date().toISOString(),
    };
    setLedger((prev) => [welcomeEntry, ...prev]);
    setCreditAccount({
      user_id: newUser.id,
      purchased_balance: 5,
      updated_at: new Date().toISOString(),
    });
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const switchUserRole = (role: 'user' | 'pro' | 'admin') => {
    if (!user) return;
    const updated = { ...user, role };
    setUser(updated);
    setAuditLogs((prev) => [
      {
        id: `aud_${Date.now()}`,
        actor_email: user.email,
        action: 'user.role_change',
        target_type: 'user',
        target_id: user.id,
        metadata: { new_role: role },
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  // Entitlements calculation
  const getEntitlements = (): UserEntitlements => {
    const currentPlan =
      user?.role === 'admin'
        ? { ...INITIAL_PLANS[1], daily_limit: 10000, name: 'Admin Unlimited' }
        : user?.role === 'pro' || subscription?.status === 'active'
        ? INITIAL_PLANS[1]
        : INITIAL_PLANS[0];

    const todayStr = new Date().toISOString().split('T')[0];
    const jobsToday = jobs.filter(
      (j) =>
        j.user_id === user?.id &&
        j.status === 'completed' &&
        j.created_at.startsWith(todayStr)
    ).length;

    const dailyLimit = currentPlan.daily_limit;
    const dailyRemaining = Math.max(0, dailyLimit - jobsToday);
    const purchased = creditAccount.purchased_balance;
    const totalAvailable = dailyRemaining + purchased - reservedCredits;

    return {
      daily_limit: dailyLimit,
      daily_used: jobsToday,
      daily_remaining: dailyRemaining,
      purchased_credits: purchased,
      total_available_credits: Math.max(0, totalAvailable),
      plan: currentPlan,
      subscription: subscription || undefined,
    };
  };

  // Create Job with strict reservation & atomic accounting
  const createJob = async (file: File): Promise<{ jobId: string } | { error: string }> => {
    if (!user) return { error: 'Authentication required' };

    // 1. Validate file format and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return { error: 'Invalid file format. Please upload JPG, PNG, or WEBP.' };
    }
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return { error: 'File size exceeds the 10 MB maximum limit.' };
    }

    // 2. Check quota and atomically reserve credit
    const entitlements = getEntitlements();
    if (entitlements.total_available_credits <= 0) {
      return { error: 'Daily quota and credit balance exhausted. Please upgrade or purchase credits.' };
    }

    // Lock 1 credit reservation
    setReservedCredits((r) => r + 1);

    const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const idempotencyKey = `idem_${jobId}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    // Convert to Base64 for processing & client preview
    const fileBase64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    // Initial Job state: 'uploading'
    const newJob: ProcessingJob = {
      id: jobId,
      user_id: user.id,
      original_filename: file.name,
      input_format: file.type,
      output_format: 'image/png',
      input_size_bytes: file.size,
      input_width: 1000,
      input_height: 1000,
      status: 'uploading',
      provider: 'remove_bg',
      original_asset_id: `cld_orig_${jobId}`,
      original_asset_url: fileBase64,
      expires_at: expiresAt,
      idempotency_key: idempotencyKey,
      created_at: new Date().toISOString(),
    };

    setJobs((prev) => [newJob, ...prev]);

    // Asynchronous processing transition
    setTimeout(async () => {
      // Transition to 'processing'
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, status: 'processing' as JobStatus } : j))
      );

      try {
        const provider = getAIProvider();
        const result = await provider.removeBackground({
          imageBase64: fileBase64,
          format: file.type,
          fileName: file.name,
        });

        if (result.success && result.transparentImageBase64) {
          // Success: commit credit reservation
          setReservedCredits((r) => Math.max(0, r - 1));

          // Consume 1 credit if daily allowance exceeded
          if (entitlements.daily_remaining <= 0) {
            setCreditAccount((acc) => ({
              ...acc,
              purchased_balance: Math.max(0, acc.purchased_balance - 1),
              updated_at: new Date().toISOString(),
            }));
            const deductEntry: CreditLedgerEntry = {
              id: `ledg_${Date.now()}`,
              user_id: user.id,
              job_id: jobId,
              entry_type: 'consumption',
              amount: -1,
              balance_after: Math.max(0, creditAccount.purchased_balance - 1),
              idempotency_key: `idem_commit_${jobId}`,
              reason: `Processing completed for ${file.name}`,
              created_at: new Date().toISOString(),
            };
            setLedger((prev) => [deductEntry, ...prev]);
          }

          setJobs((prev) =>
            prev.map((j) =>
              j.id === jobId
                ? {
                    ...j,
                    status: 'completed',
                    provider: provider.name,
                    provider_job_reference: result.providerJobRef,
                    processed_asset_id: `cld_proc_${jobId}`,
                    processed_asset_url: result.transparentImageBase64,
                    processing_duration_ms: result.durationMs,
                    input_width: result.width || j.input_width,
                    input_height: result.height || j.input_height,
                    completed_at: new Date().toISOString(),
                  }
                : j
            )
          );
        } else {
          // Failure: release reserved credit
          setReservedCredits((r) => Math.max(0, r - 1));
          setJobs((prev) =>
            prev.map((j) =>
              j.id === jobId
                ? {
                    ...j,
                    status: 'failed',
                    failure_code: result.errorCode || 'UNKNOWN_ERROR',
                    failure_message: result.errorMessage || 'AI provider failed to extract background',
                  }
                : j
            )
          );
        }
      } catch (err: unknown) {
        setReservedCredits((r) => Math.max(0, r - 1));
        const error = err as Error;
        setJobs((prev) =>
          prev.map((j) =>
            j.id === jobId
              ? {
                  ...j,
                  status: 'failed',
                  failure_code: 'PROCESSING_EXCEPTION',
                  failure_message: error.message || 'Processing pipeline error',
                }
              : j
          )
        );
      }
    }, 800);

    return { jobId };
  };

  const retryJob = async (jobId: string): Promise<boolean> => {
    const targetJob = jobs.find((j) => j.id === jobId);
    if (!targetJob || targetJob.status !== 'failed') return false;

    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'processing', failure_code: undefined, failure_message: undefined } : j))
    );

    setTimeout(async () => {
      const provider = getAIProvider();
      const result = await provider.removeBackground({
        imageBase64: targetJob.original_asset_url,
        format: targetJob.input_format,
        fileName: targetJob.original_filename,
      });

      if (result.success && result.transparentImageBase64) {
        setJobs((prev) =>
          prev.map((j) =>
            j.id === jobId
              ? {
                  ...j,
                  status: 'completed',
                  processed_asset_url: result.transparentImageBase64,
                  processing_duration_ms: result.durationMs,
                  completed_at: new Date().toISOString(),
                }
              : j
          )
        );
      } else {
        setJobs((prev) =>
          prev.map((j) =>
            j.id === jobId
              ? {
                  ...j,
                  status: 'failed',
                  failure_code: result.errorCode || 'RETRY_FAILED',
                  failure_message: result.errorMessage || 'Retry failed',
                }
              : j
          )
        );
      }
    }, 600);

    return true;
  };

  const cancelJob = (jobId: string): boolean => {
    const targetJob = jobs.find((j) => j.id === jobId);
    if (!targetJob || (targetJob.status !== 'queued' && targetJob.status !== 'uploading' && targetJob.status !== 'processing')) {
      return false;
    }
    setReservedCredits((r) => Math.max(0, r - 1));
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'cancelled' } : j))
    );
    return true;
  };

  // Payment order & verification
  const createOrder = async (
    planIdOrPackId: string,
    isSubscription: boolean
  ): Promise<Transaction> => {
    if (!user) throw new Error('Not authenticated');

    let amount = 0;
    if (isSubscription) {
      const plan = INITIAL_PLANS.find((p) => p.id === planIdOrPackId);
      amount = plan ? plan.price_minor_units : 49900;
    } else {
      const pack = CREDIT_PACKS.find((p) => p.id === planIdOrPackId);
      amount = pack ? pack.price_minor_units : 9900;
    }

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      user_id: user.id,
      provider: 'razorpay',
      provider_order_id: `order_${Math.random().toString(36).substring(2, 12)}`,
      amount_minor_units: amount,
      currency: 'INR',
      status: 'pending',
      transaction_type: isSubscription ? 'subscription' : 'credit_pack',
      idempotency_key: `idem_tx_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setTransactions((prev) => [newTx, ...prev]);
    return newTx;
  };

  const verifyPayment = async (params: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    transaction_id: string;
  }): Promise<boolean> => {
    // Idempotent check
    const existing = transactions.find((t) => t.id === params.transaction_id);
    if (!existing || existing.status === 'successful') {
      return true;
    }

    // Mark transaction successful
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === params.transaction_id
          ? {
              ...t,
              status: 'successful',
              provider_payment_id: params.razorpay_payment_id,
              updated_at: new Date().toISOString(),
            }
          : t
      )
    );

    // Grant credits or activate subscription based on order type
    if (existing.transaction_type === 'credit_pack') {
      let creditsToAdd = 25;
      if (existing.amount_minor_units === 29900) creditsToAdd = 100;
      if (existing.amount_minor_units === 99900) creditsToAdd = 500;

      const newBalance = creditAccount.purchased_balance + creditsToAdd;
      setCreditAccount({
        user_id: user?.id || 'usr_demo',
        purchased_balance: newBalance,
        updated_at: new Date().toISOString(),
      });

      const ledgerEntry: CreditLedgerEntry = {
        id: `ledg_${Date.now()}`,
        user_id: user?.id || 'usr_demo',
        transaction_id: existing.id,
        entry_type: 'purchase',
        amount: creditsToAdd,
        balance_after: newBalance,
        idempotency_key: `idem_grant_${params.razorpay_payment_id}`,
        reason: `Razorpay Purchase (${creditsToAdd} credits)`,
        created_at: new Date().toISOString(),
      };
      setLedger((prev) => [ledgerEntry, ...prev]);
    } else {
      // Subscription activation
      setSubscription({
        id: `sub_${Date.now()}`,
        user_id: user?.id || 'usr_demo',
        provider_subscription_id: `sub_rzp_${Date.now()}`,
        plan_id: 'plan_pro_monthly',
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 86400000).toISOString(),
        cancel_at_period_end: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      if (user) {
        setUser({ ...user, role: 'pro' });
      }
    }

    setAuditLogs((prev) => [
      {
        id: `aud_${Date.now()}`,
        actor_email: user?.email,
        action: 'billing.payment_verified',
        target_type: 'transaction',
        target_id: existing.id,
        metadata: {
          payment_id: params.razorpay_payment_id,
          order_id: params.razorpay_order_id,
          amount: existing.amount_minor_units,
        },
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);

    return true;
  };

  const cancelSubscription = (): boolean => {
    if (!subscription) return false;
    setSubscription({
      ...subscription,
      cancel_at_period_end: true,
      updated_at: new Date().toISOString(),
    });
    setAuditLogs((prev) => [
      {
        id: `aud_${Date.now()}`,
        actor_email: user?.email,
        action: 'subscription.cancelled',
        target_type: 'subscription',
        target_id: subscription.id,
        metadata: { cancel_at_period_end: true },
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);
    return true;
  };

  // API Key management
  const generateApiKey = async (name: string): Promise<{ key: string; prefix: string }> => {
    if (!user) throw new Error('Not authenticated');
    const randomHex = Array.from(crypto.getRandomValues(new Uint8Array(20)))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    const fullKey = `sc_live_${randomHex}`;
    const prefix = fullKey.substring(0, 12);

    const newKey: ApiKey = {
      id: `key_${Date.now()}`,
      user_id: user.id,
      name: name || 'Default Production Key',
      key_hash: `hash_${randomHex.substring(0, 16)}`,
      key_prefix: prefix,
      created_at: new Date().toISOString(),
    };

    setApiKeys((prev) => [newKey, ...prev]);
    return { key: fullKey, prefix };
  };

  const revokeApiKey = (keyId: string): boolean => {
    setApiKeys((prev) =>
      prev.map((k) => (k.id === keyId ? { ...k, revoked_at: new Date().toISOString() } : k))
    );
    return true;
  };

  // Admin adjustments
  const adminAdjustCredits = (userId: string, amount: number, reason: string): boolean => {
    if (user?.role !== 'admin') return false;
    const newBal = Math.max(0, creditAccount.purchased_balance + amount);
    setCreditAccount((prev) => ({
      ...prev,
      purchased_balance: newBal,
      updated_at: new Date().toISOString(),
    }));

    const entry: CreditLedgerEntry = {
      id: `ledg_adm_${Date.now()}`,
      user_id: userId,
      entry_type: 'admin_adjustment',
      amount,
      balance_after: newBal,
      idempotency_key: `idem_adm_${Date.now()}`,
      reason: `Admin adjustment: ${reason}`,
      created_at: new Date().toISOString(),
    };
    setLedger((prev) => [entry, ...prev]);

    setAuditLogs((prev) => [
      {
        id: `aud_${Date.now()}`,
        actor_email: user.email,
        action: 'admin.credit_adjustment',
        target_type: 'credit_account',
        target_id: userId,
        metadata: { adjustment: amount, reason, new_balance: newBal },
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);

    return true;
  };

  return React.createElement(
    SnapCutContext.Provider,
    {
      value: {
        user,
        plans: INITIAL_PLANS,
        creditAccount,
        ledger,
        jobs,
        subscription,
        transactions,
        apiKeys,
        auditLogs,
        reservedCredits,
        login,
        signup,
        logout,
        switchUserRole,
        getEntitlements,
        createJob,
        retryJob,
        cancelJob,
        createOrder,
        verifyPayment,
        cancelSubscription,
        generateApiKey,
        revokeApiKey,
        adminAdjustCredits,
      },
    },
    children
  );
};

export const useSnapCut = () => {
  const context = useContext(SnapCutContext);
  if (!context) {
    throw new Error('useSnapCut must be used within a SnapCutProvider');
  }
  return context;
};
