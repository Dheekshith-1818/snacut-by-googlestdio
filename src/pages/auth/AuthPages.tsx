import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, CheckCircle2, ArrowRight } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 shadow-lg shadow-sky-500/25">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">SnapCut AI</span>
        </Link>
        <h2 className="text-2xl font-bold text-white tracking-tight">Reset your password</h2>
        <p className="mt-2 text-xs text-slate-400">
          Enter your registered email and we’ll dispatch a secure recovery token.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-900 py-8 px-6 sm:px-10 rounded-2xl border border-slate-800 shadow-2xl">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500 mx-auto flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Recovery Link Sent</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                If an account exists for <strong className="text-slate-200">{email}</strong>, a secure password reset link has been dispatched.
              </p>
              <Link
                to="/login"
                className="inline-block mt-4 text-xs font-semibold text-cyan-400 hover:underline"
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-purple-600 text-white font-semibold text-sm shadow-md hover:opacity-95 transition-all mt-2"
              >
                Send Password Reset Email
              </button>

              <div className="text-center pt-3">
                <Link to="/login" className="text-xs text-slate-400 hover:text-white">
                  Back to sign in
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [newPass, setNewPass] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 6) return;
    setDone(true);
    setTimeout(() => navigate('/login'), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-2xl font-bold text-white tracking-tight">Set New Password</h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-900 py-8 px-6 sm:px-10 rounded-2xl border border-slate-800 shadow-2xl">
          {done ? (
            <div className="text-center space-y-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-sm text-slate-200">Password updated! Redirecting to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-purple-600 text-white font-semibold text-sm shadow-md hover:opacity-95"
              >
                Save New Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export const VerifyEmailPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center shadow-2xl space-y-4">
        <div className="w-12 h-12 rounded-full bg-cyan-950/80 border border-cyan-800 mx-auto flex items-center justify-center text-cyan-400">
          <Mail className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Check Your Inbox</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          We’ve sent a verification link to your email address. Please click the link to activate your account and start removing backgrounds.
        </p>
        <Link
          to="/login"
          className="inline-block pt-2 text-xs font-semibold text-cyan-400 hover:underline"
        >
          Return to Sign In
        </Link>
      </div>
    </div>
  );
};

export const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  React.useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/app/dashboard');
    }, 1000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-400">Authenticating session with Supabase...</p>
      </div>
    </div>
  );
};
