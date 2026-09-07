import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Eye, ArrowLeft, Users } from 'lucide-react';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error('Name and email are required');
      return;
    }
    const r = signup({ name, email, role: 'contributor' });
    if (r.ok) {
      toast.success('Account created. Add your first camera.');
      navigate('/contributor');
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col grid-noise">
      <div className="p-4 sm:p-6">
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-red-400 text-sm font-mono uppercase tracking-wider" data-testid="signup-back">
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
            <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-red-500">// Join Network</div>
            <h1 className="mt-2 font-heading font-black text-3xl uppercase">Contribute a Camera</h1>
            <p className="mt-2 text-sm text-zinc-400">Registration is for public contributors. Police & admin accounts are provisioned by central command.</p>
          </div>

          <Card className="bg-zinc-950 border-zinc-800 p-6 rounded-lg hud-corner">
            <div className="mb-5 flex items-center gap-3 p-3 rounded bg-red-500/5 border border-red-500/20">
              <Users className="w-4 h-4 text-red-400" />
              <div className="text-xs text-red-400 font-mono uppercase tracking-wider">Registering as Contributor</div>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500 mb-2 block">Full Name</Label>
                <Input
                  data-testid="signup-name-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-zinc-100 focus-visible:ring-red-500 h-11"
                  placeholder="A. Sharma"
                  required
                />
              </div>
              <div>
                <Label className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500 mb-2 block">Email</Label>
                <Input
                  data-testid="signup-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-zinc-100 focus-visible:ring-red-500 h-11"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <Label className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500 mb-2 block">Phone</Label>
                <Input
                  data-testid="signup-phone-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-zinc-100 focus-visible:ring-red-500 h-11"
                  placeholder="+91 98xxxxxxxx"
                />
              </div>
              <div>
                <Label className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500 mb-2 block">Address / Area</Label>
                <Input
                  data-testid="signup-address-input"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-zinc-100 focus-visible:ring-red-500 h-11"
                  placeholder="Connaught Place, Delhi"
                />
              </div>
              <Button
                type="submit"
                data-testid="signup-submit-btn"
                className="w-full bg-red-600 hover:bg-red-700 text-white h-11 rounded-md font-semibold uppercase tracking-wider text-sm"
              >
                Create Account & Continue
              </Button>
            </form>
          </Card>

          <div className="mt-6 text-center text-sm text-zinc-500">
            Already registered?{' '}
            <Link to="/login" className="text-red-400 hover:text-red-300 font-semibold" data-testid="signup-goto-login">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
