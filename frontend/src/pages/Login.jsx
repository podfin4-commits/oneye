import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Shield, Eye, Users, ArrowLeft } from 'lucide-react';

const ROLES = [
  { key: 'police', label: 'Police Station', icon: Shield, demo: 'police@oneye.gov / police123' },
  { key: 'admin', label: 'Admin', icon: Eye, demo: 'admin@oneye.gov / admin123' },
  { key: 'contributor', label: 'Public Contributor', icon: Users, demo: 'contributor@oneye.gov / contrib123' },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('police');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    const result = login(email, password, role);
    setSubmitting(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(`Welcome back, ${result.user.name}`);
    navigate(`/${role}`);
  };

  const fillDemo = () => {
    const r = ROLES.find((x) => x.key === role);
    const [em, pw] = r.demo.split(' / ');
    setEmail(em);
    setPassword(pw);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col grid-noise">
      <div className="p-4 sm:p-6">
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-red-400 text-sm font-mono uppercase tracking-wider" data-testid="login-back">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-md bg-red-500/10 border border-red-500/40 flex items-center justify-center">
                <Eye className="w-5 h-5 text-red-500" />
              </div>
              <div className="font-heading font-black text-2xl tracking-widest">ONEYE</div>
            </div>
            <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-red-500">// Secure Access</div>
            <h1 className="mt-2 font-heading font-black text-3xl uppercase">Sign in to command</h1>
          </div>

          <Card className="bg-zinc-950 border-zinc-800 p-6 rounded-lg hud-corner">
            <div className="mb-5">
              <Label className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500 mb-2 block">Role</Label>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r.key}
                    type="button"
                    data-testid={`role-${r.key}-btn`}
                    onClick={() => setRole(r.key)}
                    className={`p-3 rounded border text-center transition-all ${
                      role === r.key
                        ? 'border-red-500 bg-red-500/10 text-red-400'
                        : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <r.icon className="w-4 h-4 mx-auto mb-1" />
                    <div className="text-[10px] font-mono uppercase tracking-wider">{r.label.split(' ')[0]}</div>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500 mb-2 block">Email</Label>
                <Input
                  id="email"
                  data-testid="login-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-zinc-100 focus-visible:ring-red-500 focus-visible:border-red-500 h-11"
                  placeholder="you@oneye.gov"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500 mb-2 block">Password</Label>
                <Input
                  id="password"
                  data-testid="login-password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-zinc-100 focus-visible:ring-red-500 focus-visible:border-red-500 h-11"
                  placeholder="••••••••"
                  required
                />
              </div>
              <Button
                type="submit"
                data-testid="login-submit-btn"
                disabled={submitting}
                className="w-full bg-red-600 hover:bg-red-700 text-white h-11 rounded-md font-semibold uppercase tracking-wider text-sm"
              >
                {submitting ? 'Authenticating…' : 'Access Dashboard'}
              </Button>
            </form>

            <div className="mt-5 pt-5 border-t border-zinc-800">
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 mb-2">// Demo Credentials</div>
              <div className="text-xs text-zinc-400 font-mono mb-2">{ROLES.find((r) => r.key === role).demo}</div>
              <Button
                type="button"
                data-testid="login-fill-demo-btn"
                variant="outline"
                onClick={fillDemo}
                className="w-full h-9 text-xs border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 uppercase tracking-wider"
              >
                Autofill Demo
              </Button>
            </div>
          </Card>

          <div className="mt-6 text-center text-sm text-zinc-500">
            New contributor?{' '}
            <Link to="/signup" className="text-red-400 hover:text-red-300 font-semibold" data-testid="login-goto-signup">
              Register a camera
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

