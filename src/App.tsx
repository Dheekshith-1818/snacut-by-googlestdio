import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SnapCutProvider } from './lib/store';

// Public pages
import { LandingPage } from './pages/public/LandingPage';
import { FeaturesPage } from './pages/public/FeaturesPage';
import { PricingPage } from './pages/public/PricingPage';
import { ApiDocsPage } from './pages/public/ApiDocsPage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';
import { BlogPage } from './pages/public/BlogPage';
import { BlogPostPage } from './pages/public/BlogPostPage';
import {
  PrivacyPolicyPage,
  TermsOfServicePage,
  RefundPolicyPage,
} from './pages/public/LegalPages';

// Auth pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import {
  ForgotPasswordPage,
  ResetPasswordPage,
  VerifyEmailPage,
  AuthCallbackPage,
} from './pages/auth/AuthPages';

// App pages
import { DashboardPage } from './pages/app/DashboardPage';
import { RemoveBackgroundPage } from './pages/app/RemoveBackgroundPage';
import { ResultPage } from './pages/app/ResultPage';
import { HistoryPage } from './pages/app/HistoryPage';
import { BillingPage } from './pages/app/BillingPage';
import { CreditsPage } from './pages/app/CreditsPage';
import { SubscriptionPage } from './pages/app/SubscriptionPage';
import { SettingsPage } from './pages/app/SettingsPage';
import { ApiKeysPage } from './pages/app/ApiKeysPage';
import { ApiUsagePage } from './pages/app/ApiUsagePage';

// Admin pages
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminJobsPage } from './pages/admin/AdminJobsPage';
import {
  AdminAnalyticsPage,
  AdminPaymentsPage,
  AdminSubscriptionsPage,
  AdminWorkflowsPage,
  AdminAuditLogsPage,
} from './pages/admin/AdminPages';

export default function App() {
  return (
    <SnapCutProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Marketing Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/api-docs" element={<ApiDocsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/refund-policy" element={<RefundPolicyPage />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />

          {/* Authenticated User Workspace Routes */}
          <Route path="/app/dashboard" element={<DashboardPage />} />
          <Route path="/app/remove-background" element={<RemoveBackgroundPage />} />
          <Route path="/app/result/:jobId" element={<ResultPage />} />
          <Route path="/app/history" element={<HistoryPage />} />
          <Route path="/app/history/:jobId" element={<ResultPage />} />
          <Route path="/app/billing" element={<BillingPage />} />
          <Route path="/app/credits" element={<CreditsPage />} />
          <Route path="/app/subscription" element={<SubscriptionPage />} />
          <Route path="/app/settings" element={<SettingsPage />} />
          <Route path="/app/api-keys" element={<ApiKeysPage />} />
          <Route path="/app/api-usage" element={<ApiUsagePage />} />

          {/* Role-Protected Administrative Console Routes */}
          <Route path="/admin" element={<AdminOverviewPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/jobs" element={<AdminJobsPage />} />
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
          <Route path="/admin/payments" element={<AdminPaymentsPage />} />
          <Route path="/admin/subscriptions" element={<AdminSubscriptionsPage />} />
          <Route path="/admin/api-usage" element={<ApiUsagePage />} />
          <Route path="/admin/workflows" element={<AdminWorkflowsPage />} />
          <Route path="/admin/audit-logs" element={<AdminAuditLogsPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </SnapCutProvider>
  );
}
