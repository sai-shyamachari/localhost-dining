import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import { CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

const VerifyEmailPage = () => {
  const { token: urlToken } = useParams();
  const [token, setToken] = useState(urlToken || '');
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(null);

  const verifyToken = async (tokenToVerify) => {
    if (!tokenToVerify) return;
    setLoading(true);
    setError(null);
    try {
      await api.get(`/auth/verify-email/${tokenToVerify}`);
      setVerified(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Invalid or expired verification token. Please register again or request assistance.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (urlToken) {
      verifyToken(urlToken);
    }
  }, [urlToken]);

  const handleSubmitManual = (e) => {
    e.preventDefault();
    if (token.trim()) {
      verifyToken(token.trim());
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h1 className="font-display text-3xl font-bold text-white tracking-tight">
              Email Verification
            </h1>
            <p className="text-xs text-slate-400">
              Activating your account for LocalHost Dining.
            </p>
          </div>

          {loading ? (
            <div className="py-8 space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin mx-auto"></div>
              <p className="text-xs text-slate-400">Verifying security token with database...</p>
            </div>
          ) : verified ? (
            <div className="space-y-4 py-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="font-display text-2xl font-bold text-white">
                Account Successfully Verified!
              </h2>
              <p className="text-xs text-slate-300">
                Your email has been confirmed. You can now access full reservation capabilities and management tools.
              </p>
              <div className="pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-amber-500/20"
                >
                  <span>Log In to Account</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 text-left">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmitManual} className="space-y-3 text-left">
                <label className="block text-xs font-semibold text-slate-300">
                  Paste Verification Token manually if needed:
                </label>
                <input
                  type="text"
                  placeholder="Paste token string here..."
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-amber-500/50"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Verify Token
                </button>
              </form>

              <div className="text-center pt-2">
                <Link to="/login" className="text-xs text-slate-400 hover:text-white">
                  Back to Sign In
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
