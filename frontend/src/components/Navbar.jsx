import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  UtensilsCrossed,
  CalendarCheck,
  LayoutDashboard,
  ShieldAlert,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Grid,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, quickLogin, isAuthenticated, isSuperAdmin, isRestaurantAdmin, isDiner } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const handleDemoSwitch = async (roleKey) => {
    try {
      await quickLogin(roleKey);
      setDemoMenuOpen(false);
      setMobileMenuOpen(false);
      if (roleKey === 'superadmin') navigate('/super-admin');
      else if (roleKey === 'bistro' || roleKey === 'sakura') navigate('/admin/dashboard');
      else navigate('/my-bookings');
    } catch (err) {
      console.error('Demo switch failed:', err);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
              <UtensilsCrossed className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-display text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                LocalHost <span className="gold-gradient-text font-serif italic">Dining</span>
              </span>
              <span className="block text-[10px] tracking-widest uppercase text-slate-400 font-semibold">
                Multi-Tenant Reservation
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/restaurants"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/restaurants')
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Explore Restaurants
            </Link>

            {/* Diner Links */}
            {isAuthenticated && isDiner && (
              <Link
                to="/my-bookings"
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                  isActive('/my-bookings')
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <CalendarCheck className="w-4 h-4" />
                My Bookings
              </Link>
            )}

            {/* Restaurant Admin Links */}
            {isAuthenticated && isRestaurantAdmin && (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                    isActive('/admin/dashboard')
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Floor Feed
                </Link>
                <Link
                  to="/admin/tables"
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                    isActive('/admin/tables')
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                  Table Inventory
                </Link>
              </>
            )}

            {/* Super Admin Links */}
            {isAuthenticated && isSuperAdmin && (
              <Link
                to="/super-admin"
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                  isActive('/super-admin')
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                Platform Overview
              </Link>
            )}
          </div>

          {/* Right Section: Quick Demo Switcher + Auth Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Demo Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all cursor-pointer"
                title="Switch between pre-seeded demo accounts instantly"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Demo Switcher
                <ChevronDown className="w-3 h-3" />
              </button>

              {demoMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 glass-panel bg-slate-900/95 rounded-xl shadow-2xl p-2 z-50 border border-amber-500/20"
                  onMouseLeave={() => setDemoMenuOpen(false)}
                >
                  <div className="px-3 py-2 text-[11px] font-semibold uppercase text-slate-400 tracking-wider border-b border-white/10">
                    Switch Active Persona:
                  </div>
                  <button
                    onClick={() => handleDemoSwitch('superadmin')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-white/10 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <span className="font-semibold text-amber-400 block">Platform Super Admin</span>
                      <span className="text-[10px] text-slate-400">superadmin@localhostdining.com</span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('bistro')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-white/10 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-sky-400 block">Restaurant Admin (Bistro)</span>
                      <span className="text-[10px] text-slate-400">admin.bistro@localhostdining.com</span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('sakura')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-white/10 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-rose-400 block">Restaurant Admin (Sakura)</span>
                      <span className="text-[10px] text-slate-400">admin.sakura@localhostdining.com</span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('alice')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-white/10 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-emerald-400 block">Alice (Diner)</span>
                      <span className="text-[10px] text-slate-400">alice.diner@example.com</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-2 border-l border-white/10">
                <div className="text-right">
                  <span className="block text-xs font-semibold text-white leading-tight">
                    {user?.name}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                    {user?.role?.replace('_', ' ')}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20 transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-white/10 px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/restaurants"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-200"
          >
            Explore Restaurants
          </Link>
          {isAuthenticated && isDiner && (
            <Link
              to="/my-bookings"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-200"
            >
              My Bookings
            </Link>
          )}
          {isAuthenticated && isRestaurantAdmin && (
            <>
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-slate-200"
              >
                Floor Feed
              </Link>
              <Link
                to="/admin/tables"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-slate-200"
              >
                Table Inventory
              </Link>
            </>
          )}
          {isAuthenticated && isSuperAdmin && (
            <Link
              to="/super-admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-amber-400"
            >
              Platform Overview
            </Link>
          )}

          <div className="pt-3 border-t border-white/10">
            <div className="text-xs text-slate-400 font-semibold uppercase mb-2">Demo Accounts:</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleDemoSwitch('superadmin')}
                className="text-left p-2 rounded bg-white/5 text-[11px] text-amber-300"
              >
                Super Admin
              </button>
              <button
                onClick={() => handleDemoSwitch('bistro')}
                className="text-left p-2 rounded bg-white/5 text-[11px] text-sky-300"
              >
                Bistro Admin
              </button>
              <button
                onClick={() => handleDemoSwitch('sakura')}
                className="text-left p-2 rounded bg-white/5 text-[11px] text-rose-300"
              >
                Sakura Admin
              </button>
              <button
                onClick={() => handleDemoSwitch('alice')}
                className="text-left p-2 rounded bg-white/5 text-[11px] text-emerald-300"
              >
                Alice (Diner)
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex justify-between items-center">
            {isAuthenticated ? (
              <>
                <div className="text-xs text-slate-300">
                  Signed in as <span className="font-bold text-amber-400">{user?.name}</span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-rose-400"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2 w-full">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-xs bg-white/10 rounded"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-xs bg-amber-500 text-slate-950 font-bold rounded"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
