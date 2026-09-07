import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Eye, LogOut, Menu, Bell } from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardLayout({ title, roleLabel, roleColor = 'red', navItems, activeKey, onNavClick, children, headerRight }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Signed out');
    navigate('/');
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-zinc-800">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-md bg-red-500/10 border border-red-500/40 flex items-center justify-center">
            <Eye className="w-4 h-4 text-red-500" />
          </div>
          <div className="font-heading font-black text-lg tracking-widest">ONEYE</div>
        </div>
        <div className={`text-[10px] font-mono uppercase tracking-[0.2em] text-${roleColor}-500 mt-2`}>// {roleLabel}</div>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.key}
            data-testid={`nav-${item.key}`}
            onClick={() => {
              onNavClick(item.key);
              setOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm text-left transition-colors ${
              activeKey === item.key
                ? 'bg-red-500/10 border border-red-500/30 text-red-400'
                : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
            }`}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">{item.label}</span>
            {item.badge > 0 && (
              <span className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-600 text-white">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-zinc-800">
        <div className="mb-3 px-2">
          <div className="text-sm font-semibold text-zinc-100 truncate">{user?.name}</div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 truncate">{user?.email}</div>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          data-testid="logout-btn"
          className="w-full border-zinc-800 bg-zinc-900 hover:bg-red-500/10 hover:border-red-500/40 hover:text-red-400 text-zinc-300 h-9 text-xs uppercase tracking-wider"
        >
          <LogOut className="w-3.5 h-3.5 mr-2" /> Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-zinc-900 bg-zinc-950/60 sticky top-0 h-screen">
        <NavContent />
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top nav */}
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#09090b]/80 border-b border-zinc-900">
          <div className="flex items-center justify-between px-4 sm:px-6 h-16">
            <div className="flex items-center gap-3 min-w-0">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden text-zinc-300" data-testid="mobile-menu-btn">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-zinc-950 border-zinc-800 p-0 w-72">
                  <NavContent />
                </SheetContent>
              </Sheet>
              <div className="min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-500">// {roleLabel}</div>
                <h1 className="font-heading font-bold text-lg sm:text-xl uppercase truncate" data-testid="dashboard-title">{title}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {headerRight}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot"></span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">Online</span>
              </div>
              <Button variant="ghost" size="icon" className="text-zinc-400 relative" data-testid="notifications-btn">
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-500 pulse-dot"></span>
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 sm:p-6 min-w-0">
          {children}
        </div>
      </main>
    </div>
  );
}
