import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  UtensilsCrossed,
  Mail,
  Lock,
  Sparkles,
  ArrowRight,
  AlertCircle,
  ShieldAlert,
  UserCheck,
} from 'lucide-react';

const LoginPage = () => {
  const { login, quickLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const redirectAfterLogin = (user) => {
    const from = location.state?.from?.pathname;
    if (from) {
      navigate(from, { replace: true });
      return;
    }

    if (user.role === 'super_admin') navigate('/super-admin');
    else if (user.role === 'restaurant_admin') navigate('/admin/dashboard');
    else navigate('/my-bookings');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await login(email, password);
      redirectAfterLogin(user);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials or unverified email.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuick = async (key) => {
    setLoading(true);
    setError(null);
    try {
      const user = await quickLogin(key);
      redirectAfterLogin(user);
    } catch (err) {
      setError('Demo login failed. Please ensure the seeder ran.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Card */}
        <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 mx-auto shadow-lg shadow-amber-500/20">
              <UtensilsCrossed className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h1 className="font-display text-3xl font-bold text-white tracking-tight">
              Sign In to LocalHost
            </h1>
            <p className="text-xs text-slate-400">
              Access your reservations and multi-tenant management portals.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500/50"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] text-amber-400 hover:text-amber-300"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500/50"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Logins Box */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>1-Click Demo Accounts (Pre-Seeded):</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuick('superadmin')}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-left text-amber-300 font-semibold cursor-pointer"
              >
                Super Admin
                <span className="block text-[10px] text-slate-400 font-normal">Platform Lead</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuick('bistro')}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-left text-sky-300 font-semibold cursor-pointer"
              >
                Bistro Admin
                <span className="block text-[10px] text-slate-400 font-normal">Italian Venue</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuick('sakura')}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-left text-rose-300 font-semibold cursor-pointer"
              >
                Sakura Admin
                <span className="block text-[10px] text-slate-400 font-normal">Japanese Venue</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuick('alice')}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-left text-emerald-300 font-semibold cursor-pointer"
              >
                Alice (Diner)
                <span className="block text-[10px] text-slate-400 font-normal">Guest User</span>
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-amber-400 hover:text-amber-300">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
