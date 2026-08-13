import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Activity, ShieldCheck, Database, Cpu, Lock } from 'lucide-react';
import { APP_NAME } from '../utils/constants';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('admin@sdohnexus.demo');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const handleDemoLogin = async () => {
    setEmail('admin@sdohnexus.demo');
    setPassword('demo123');
    try {
      await login('admin@sdohnexus.demo', 'demo123');
      navigate('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Demo login failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col md:flex-row">
      {/* Left Panel: Product Identity & Architecture Flow */}
      <div className="w-full md:w-1/2 p-8 lg:p-16 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950 text-white">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">{APP_NAME}</h1>
              <span className="text-xs text-blue-400 font-semibold tracking-wider uppercase">Health Equity Intelligence</span>
            </div>
          </div>

          <div className="mt-12 space-y-4 max-w-lg">
            <h2 className="text-3xl font-extrabold tracking-tight leading-tight text-white">
              Connect member health data with the social conditions shaping health.
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              SDOH Nexus is an intelligence and enrichment layer that sits on top of existing healthcare/payer systems. It combines member data with CDC SVI, Census ACS, USDA food access, and EPA environmental data.
            </p>
          </div>

          {/* Architecture Flow Banner */}
          <div className="mt-10 p-5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Integration Pipeline Flow</h4>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-blue-400" />
                <span>Payer Data</span>
              </div>
              <span className="text-slate-600">→</span>
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-purple-400" />
                <span>SDOH Enrichment</span>
              </div>
              <span className="text-slate-600">→</span>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Actionable Risk</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 text-xs text-slate-500 flex justify-between">
          <span>SDOH Nexus v1.0</span>
          <span>Hackathon Demonstration Prototype</span>
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="w-full md:w-1/2 p-8 lg:p-16 flex items-center justify-center bg-slate-900">
        <div className="w-full max-w-md space-y-6 bg-slate-950/60 p-8 rounded-2xl border border-slate-800 shadow-2xl">
          <div>
            <h3 className="text-xl font-extrabold text-white">Sign In to SDOH Nexus</h3>
            <p className="text-xs text-slate-400 mt-1">Enter your credentials or click Demo Login</p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-950/80 border border-red-800 text-red-300 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              icon={<Lock className="h-4 w-4" />}
            >
              Sign In
            </Button>
          </form>

          <div className="relative border-t border-slate-800 pt-4">
            <Button
              type="button"
              variant="secondary"
              size="md"
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
              onClick={handleDemoLogin}
              isLoading={isLoading}
            >
              Quick Demo Login (Pre-filled Credentials)
            </Button>
          </div>

          <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 text-[11px] text-slate-400 text-center">
            Demo Credentials: <code className="text-blue-300">admin@sdohnexus.demo</code> / <code className="text-blue-300">demo123</code>
          </div>
        </div>
      </div>
    </div>
  );
};
