import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Eye, Shield, Zap, Radio, MapPin, AlertTriangle, Camera, Users, ChevronRight } from 'lucide-react';

const HERO_IMG = 'https://images.unsplash.com/photo-1708807472445-d33589e6b090?w=1600&q=80';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-[#09090b]/80 border-b border-red-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" data-testid="nav-logo">
            <div className="relative w-8 h-8 rounded-md bg-red-500/10 border border-red-500/40 flex items-center justify-center">
              <Eye className="w-4 h-4 text-red-500" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full pulse-dot"></span>
            </div>
            <div>
              <div className="font-heading font-black text-lg tracking-widest">ONEYE</div>
              <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-red-500/80 -mt-1">Live Watch</div>
            </div>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/login" data-testid="nav-login-link">
              <Button variant="ghost" className="text-zinc-300 hover:text-white hover:bg-zinc-800 h-9">Sign In</Button>
            </Link>
            <Link to="/signup" data-testid="nav-signup-link">
              <Button className="bg-red-600 hover:bg-red-700 text-white h-9 rounded-full px-5">
                Join Network
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 px-4 sm:px-6 grid-noise">
        <div className="absolute inset-0 overflow-hidden">
          <img src={HERO_IMG} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#09090b]/50 via-[#09090b]/70 to-[#09090b]"></div>
        </div>
        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 mb-6" data-testid="hero-badge">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 pulse-dot"></span>
              <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-red-400">Live Detection Network</span>
            </div>
            <h1 className="font-heading font-black uppercase tracking-tight leading-[0.95] text-4xl sm:text-5xl lg:text-7xl">
              Every Camera.<br />
              <span className="text-red-500">Always Watching.</span><br />
              Zero Response Time.
            </h1>
            <p className="mt-6 text-base sm:text-lg text-zinc-400 max-w-xl leading-relaxed">
              OnEye turns disconnected CCTV infrastructure into one intelligent safety network — flagging theft, weapons and violent acts the moment they happen, and routing them directly to the nearest police station.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup" data-testid="hero-cta-join">
                <Button className="bg-red-600 hover:bg-red-700 text-white h-12 px-8 rounded-full text-sm font-semibold uppercase tracking-wider">
                  Contribute a Camera <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/login" data-testid="hero-cta-login">
                <Button variant="outline" className="border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-100 h-12 px-8 rounded-full text-sm font-semibold uppercase tracking-wider">
                  Access Command
                </Button>
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-lg">
              {[
                { v: '342', l: 'Live Cameras' },
                { v: '6.4m', l: 'Avg Response' },
                { v: '1284', l: 'Incidents Flagged' },
              ].map((s) => (
                <div key={s.l} className="border-l-2 border-red-500/50 pl-3">
                  <div className="font-heading font-black text-2xl sm:text-3xl">{s.v}</div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-500 mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5 hidden lg:block">
            <div className="hud-corner p-4 bg-zinc-950/70 border border-zinc-800 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full pulse-dot"></span> Live Feed // Cam-001
                </span>
                <span className="text-[10px] font-mono text-zinc-500">28.61°N 77.20°E</span>
              </div>
              <div className="relative aspect-video rounded overflow-hidden bg-black scan-line">
                <img src="https://images.unsplash.com/photo-1702682502494-3891f9e3ec59?w=800&q=70" alt="feed" className="w-full h-full object-cover opacity-90" />
                <div className="absolute top-3 left-3 px-2 py-1 rounded bg-red-600/90 text-white text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3" /> Anomaly Detected
                </div>
                <div className="absolute inset-0 border-2 border-red-500/60 rounded"></div>
                <div className="absolute bottom-3 left-3 right-3 flex justify-between text-[10px] font-mono text-red-400">
                  <span>WEAPON • 96% CONF</span>
                  <span className="text-zinc-400">REC</span>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {['Cam-002', 'Cam-003', 'Cam-004'].map((c) => (
                  <div key={c} className="aspect-video rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] font-mono text-zinc-500">
                    {c}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-red-500 mb-3">// The Problem</div>
            <h2 className="font-heading font-black uppercase text-3xl sm:text-5xl leading-tight">
              Millions of cameras. <span className="text-zinc-500">Zero eyes on them.</span>
            </h2>
            <p className="mt-5 text-zinc-400 text-base sm:text-lg leading-relaxed">
              CCTV cameras today only record — they don't watch. Crimes are discovered hours or days later, footage reviewed while the criminal is gone. Police lack a unified real-time feed. Every system is an island.
            </p>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-4">
            {[
              { i: Camera, t: '00:00:04', s: 'Incident begins on private CCTV' },
              { i: AlertTriangle, t: '02:14:00', s: 'Footage reviewed after report filed' },
              { i: Shield, t: '05:36:00', s: 'Suspect long gone. Case cold.' },
            ].map((step, idx) => (
              <Card key={idx} className="bg-zinc-950 border-zinc-800 p-6 rounded-lg">
                <step.i className="w-6 h-6 text-red-500 mb-4" />
                <div className="font-mono text-xs text-zinc-500 uppercase tracking-wider">T + {step.t}</div>
                <div className="mt-2 font-semibold text-zinc-100">{step.s}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solution / How it works */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 border-t border-zinc-900 bg-zinc-950/40">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-red-500 mb-3">// The OnEye Way</div>
            <h2 className="font-heading font-black uppercase text-3xl sm:text-5xl leading-tight">
              Technology as the <span className="text-red-500">first responder.</span>
            </h2>
          </div>
          <div className="mt-12 grid md:grid-cols-4 gap-4">
            {[
              { i: Camera, n: '01', t: 'Connect', s: 'Public contributors pin cameras on the map. Admin approves.' },
              { i: Radio, n: '02', t: 'Detect', s: 'AI scans every feed 24/7 for weapons, theft, violent acts.' },
              { i: Zap, n: '03', t: 'Alert', s: 'Instant red alert with a 10-second clip — before + after.' },
              { i: MapPin, n: '04', t: 'Dispatch', s: 'Routed directly to the nearest police station in seconds.' },
            ].map((step) => (
              <div key={step.n} className="relative bg-zinc-950 border border-zinc-800 rounded-lg p-6 hover:border-red-500/40 transition-colors">
                <div className="absolute top-4 right-4 text-4xl font-heading font-black text-zinc-800">{step.n}</div>
                <step.i className="w-6 h-6 text-red-500 mb-4" />
                <div className="font-heading font-bold uppercase tracking-wider text-lg">{step.t}</div>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{step.s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-red-500 mb-3">// Three Roles. One Network.</div>
          <h2 className="font-heading font-black uppercase text-3xl sm:text-5xl leading-tight max-w-2xl">Who's watching, and who's acting.</h2>

          <div className="mt-12 grid md:grid-cols-3 gap-4">
            {[
              { i: Shield, t: 'Police Station', s: 'Receive jurisdiction alerts with clip context. Acknowledge, respond, resolve — all in one command view.', tag: 'FIRST RESPONDER' },
              { i: Eye, t: 'Admin', s: 'Global oversight. Approve contributor cameras, manage stations, analyze hotspots, override alerts.', tag: 'CENTRAL COMMAND' },
              { i: Users, t: 'Public Contributor', s: 'Register your camera. Cover your block. Earn safety score for every incident you help catch.', tag: 'CITIZEN NODE' },
            ].map((r) => (
              <Card key={r.t} className="bg-zinc-950 border-zinc-800 p-6 rounded-lg hover:border-red-500/40 transition-colors group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-md bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                    <r.i className="w-5 h-5 text-red-500" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 group-hover:text-red-400 transition-colors">{r.tag}</span>
                </div>
                <div className="font-heading font-bold uppercase text-xl">{r.t}</div>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{r.s}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-red-500 mb-4">// Vision</div>
          <h2 className="font-heading font-black uppercase text-3xl sm:text-5xl lg:text-6xl leading-[0.95]">
            A <span className="text-red-500">crime-free nation</span> — one camera at a time.
          </h2>
          <p className="mt-6 text-zinc-400 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Help close the gap between when a crime happens and when help arrives. Join the network.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link to="/signup" data-testid="footer-cta-signup">
              <Button className="bg-red-600 hover:bg-red-700 text-white h-12 px-8 rounded-full text-sm font-semibold uppercase tracking-wider">
                Contribute a Camera
              </Button>
            </Link>
            <Link to="/login" data-testid="footer-cta-login">
              <Button variant="outline" className="border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-100 h-12 px-8 rounded-full text-sm font-semibold uppercase tracking-wider">
                I'm Police / Admin
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-900 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-zinc-600 uppercase tracking-wider">
          <span>© OnEye Network — Prototype</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 pulse-dot"></span>
            All systems operational
          </span>
        </div>
      </footer>
    </div>
  );
}
