import { useState, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import AlertDetailModal from '@/components/AlertDetailModal';
import MapView from '@/components/MapView';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ALERTS as SEED_ALERTS, POLICE_STATIONS, STATUS_COLORS, formatTime } from '@/data/mockData';
import { LayoutDashboard, Siren, Map as MapIcon, History, AlertTriangle, Camera, Play } from 'lucide-react';

const ANOMALY = ['Weapon Detected', 'Theft in Progress', 'Suspicious Loitering', 'Trespassing', 'Assault'];

export default function PoliceDashboard() {
  const { user } = useAuth();
  const stationId = user?.station_id || 'st-001';
  const station = POLICE_STATIONS.find((s) => s.id === stationId);
  const [alerts, setAlerts] = useState(SEED_ALERTS);
  const [activeKey, setActiveKey] = useState('overview');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const myAlerts = useMemo(() => alerts.filter((a) => a.station_id === stationId), [alerts, stationId]);
  const activeAlerts = myAlerts.filter((a) => ['new', 'acknowledged', 'responding'].includes(a.status));
  const newCount = myAlerts.filter((a) => a.status === 'new').length;

  // Simulate incoming alerts every 25s
  useEffect(() => {
    const t = setInterval(() => {
      const newAlert = {
        id: `alert-${Date.now()}`,
        camera_id: 'cam-001',
        station_id: stationId,
        anomaly_type: ANOMALY[Math.floor(Math.random() * ANOMALY.length)],
        confidence: 0.7 + Math.random() * 0.3,
        snapshot_url: 'https://images.unsplash.com/photo-1702682502494-3891f9e3ec59?w=800&q=70',
        clip_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        status: 'new',
        timestamp: new Date().toISOString(),
        location: 'Connaught Place, Delhi',
        lat: 28.6145 + (Math.random() - 0.5) * 0.01,
        lng: 77.2095 + (Math.random() - 0.5) * 0.01,
      };
      setAlerts((prev) => [newAlert, ...prev]);
      toast.error(`New Alert: ${newAlert.anomaly_type}`, {
        description: `${newAlert.location} • ${Math.round(newAlert.confidence * 100)}% confidence`,
        action: { label: 'View', onClick: () => { setSelectedAlert(newAlert); setModalOpen(true); } },
      });
    }, 25000);
    return () => clearInterval(t);
  }, [stationId]);

  const handleAction = (alertId, newStatus) => {
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, status: newStatus } : a)));
    toast.success(`Alert marked ${STATUS_COLORS[newStatus].label}`);
    setModalOpen(false);
  };

  const openAlert = (a) => {
    setSelectedAlert(a);
    setModalOpen(true);
  };

  const navItems = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'alerts', label: 'Live Alerts', icon: Siren, badge: newCount },
    { key: 'map', label: 'Map View', icon: MapIcon },
    { key: 'history', label: 'Alert History', icon: History },
  ];

  const mapPoints = myAlerts.map((a) => ({
    id: a.id,
    lat: a.lat,
    lng: a.lng,
    label: a.anomaly_type,
    note: a.location,
    status: a.status === 'resolved' || a.status === 'false_positive' ? 'active' : 'new',
  }));

  return (
    <DashboardLayout
      title={station?.name || 'Police Command'}
      roleLabel="Police Station"
      navItems={navItems}
      activeKey={activeKey}
      onNavClick={setActiveKey}
    >
      {activeKey === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { l: 'New Alerts', v: newCount, c: 'text-red-400', pulse: newCount > 0 },
              { l: 'Active Cases', v: activeAlerts.length, c: 'text-amber-400' },
              { l: 'Resolved (24h)', v: myAlerts.filter((a) => a.status === 'resolved').length, c: 'text-emerald-400' },
              { l: 'Jurisdiction', v: station?.jurisdiction, c: 'text-zinc-100', small: true },
            ].map((s) => (
              <Card key={s.l} className={`bg-zinc-950 border-zinc-800 p-4 ${s.pulse ? 'border-red-500/50 pulse-red' : ''}`}>
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">{s.l}</div>
                <div className={`mt-2 font-heading font-black ${s.small ? 'text-lg' : 'text-4xl'} ${s.c}`}>{s.v}</div>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <Card className="bg-zinc-950 border-zinc-800 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-500">// Active Feed</div>
                <span className="text-[10px] font-mono text-zinc-500">{activeAlerts.length} open</span>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {activeAlerts.length === 0 && <div className="text-sm text-zinc-500 py-8 text-center">No active alerts.</div>}
                {activeAlerts.map((a) => <AlertRow key={a.id} alert={a} onOpen={openAlert} />)}
              </div>
            </Card>
            <Card className="bg-zinc-950 border-zinc-800 p-4">
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-500 mb-3">// Jurisdiction Map</div>
              <MapView points={mapPoints} height={380} onPointClick={(p) => {
                const a = myAlerts.find((x) => x.id === p.id);
                if (a) openAlert(a);
              }} showLegend />
            </Card>
          </div>
        </div>
      )}

      {activeKey === 'alerts' && (
        <Card className="bg-zinc-950 border-zinc-800 p-4">
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-500 mb-3">// All Alerts — {myAlerts.length}</div>
          <Tabs defaultValue="active">
            <TabsList className="bg-zinc-900 border border-zinc-800">
              <TabsTrigger value="active" data-testid="tab-active">Active ({activeAlerts.length})</TabsTrigger>
              <TabsTrigger value="all" data-testid="tab-all">All</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="mt-4 space-y-2">
              {activeAlerts.map((a) => <AlertRow key={a.id} alert={a} onOpen={openAlert} expanded />)}
            </TabsContent>
            <TabsContent value="all" className="mt-4 space-y-2">
              {myAlerts.map((a) => <AlertRow key={a.id} alert={a} onOpen={openAlert} expanded />)}
            </TabsContent>
          </Tabs>
        </Card>
      )}

      {activeKey === 'map' && (
        <Card className="bg-zinc-950 border-zinc-800 p-4">
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-500 mb-3">// Live Jurisdiction Map</div>
          <MapView points={mapPoints} height={600} onPointClick={(p) => {
            const a = myAlerts.find((x) => x.id === p.id);
            if (a) openAlert(a);
          }} showLegend />
        </Card>
      )}

      {activeKey === 'history' && (
        <Card className="bg-zinc-950 border-zinc-800 p-4">
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-500 mb-3">// Alert History</div>
          <div className="space-y-2">
            {myAlerts.map((a) => <AlertRow key={a.id} alert={a} onOpen={openAlert} expanded />)}
          </div>
        </Card>
      )}

      <AlertDetailModal alert={selectedAlert} open={modalOpen} onOpenChange={setModalOpen} onAction={handleAction} />
    </DashboardLayout>
  );
}

function AlertRow({ alert, onOpen, expanded }) {
  const status = STATUS_COLORS[alert.status];
  return (
    <div
      data-testid={`alert-row-${alert.id}`}
      className={`p-3 rounded border ${alert.status === 'new' ? 'border-red-500/40 bg-red-500/5' : 'border-zinc-800 bg-zinc-900/50'} hover:border-red-500/60 transition-colors cursor-pointer`}
      onClick={() => onOpen(alert)}
    >
      <div className="flex items-center gap-3">
        <div className="relative w-16 h-12 sm:w-20 sm:h-14 rounded overflow-hidden bg-black flex-shrink-0">
          <img src={alert.snapshot_url} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Play className="w-4 h-4 text-red-400" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className={`text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded border ${status.bg} ${status.text} ${status.border}`}>
              {status.label}
            </span>
            {alert.status === 'new' && <AlertTriangle className="w-3.5 h-3.5 text-red-500 pulse-dot" />}
          </div>
          <div className="text-sm font-semibold text-zinc-100 truncate">{alert.anomaly_type}</div>
          <div className="text-xs text-zinc-500 truncate flex items-center gap-2 mt-0.5">
            <span>{alert.location}</span>
            <span>•</span>
            <span className="font-mono">{formatTime(alert.timestamp)}</span>
            {expanded && <><span>•</span><span className="font-mono text-red-400">{Math.round(alert.confidence * 100)}%</span></>}
          </div>
        </div>
        <Button size="sm" variant="ghost" className="text-red-400 hover:bg-red-500/10 flex-shrink-0" data-testid={`view-${alert.id}`}>
          View
        </Button>
      </div>
    </div>
  );
}
