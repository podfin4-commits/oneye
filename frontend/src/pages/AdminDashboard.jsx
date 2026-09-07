import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import DashboardLayout from '@/components/DashboardLayout';
import AlertDetailModal from '@/components/AlertDetailModal';
import MapView from '@/components/MapView';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ALERTS as SEED_ALERTS, CAMERAS as SEED_CAMERAS, POLICE_STATIONS, ANALYTICS, STATUS_COLORS, CAM_STATUS_COLORS, formatTime } from '@/data/mockData';
import { LayoutDashboard, Camera, Siren, BarChart3, Users, Map as MapIcon, CheckCircle, XCircle, Video, Building2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const PIE_COLORS = ['#ef4444', '#dc2626', '#f97316', '#f59e0b', '#eab308', '#a855f7'];

export default function AdminDashboard() {
  const [alerts, setAlerts] = useState(SEED_ALERTS);
  const [cameras, setCameras] = useState(SEED_CAMERAS);
  const [activeKey, setActiveKey] = useState('overview');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const pendingCams = cameras.filter((c) => c.status === 'pending');
  const activeCams = cameras.filter((c) => c.status === 'active');
  const newAlertCount = alerts.filter((a) => a.status === 'new').length;

  const navItems = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'alerts', label: 'All Alerts', icon: Siren, badge: newAlertCount },
    { key: 'approvals', label: 'Camera Approvals', icon: Camera, badge: pendingCams.length },
    { key: 'stations', label: 'Police Stations', icon: Building2 },
    { key: 'analytics', label: 'Analytics', icon: BarChart3 },
    { key: 'map', label: 'Live Network', icon: MapIcon },
    { key: 'users', label: 'Users', icon: Users },
  ];

  const approve = (id) => {
    setCameras((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'active' } : c)));
    toast.success('Camera approved and activated');
  };
  const reject = (id) => {
    setCameras((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'rejected' } : c)));
    toast.error('Camera rejected');
  };

  const handleAction = (id, status) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    toast.success(`Alert marked ${STATUS_COLORS[status].label}`);
    setModalOpen(false);
  };

  const reassign = (alertId, stationId) => {
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, station_id: stationId } : a)));
    toast.success('Alert reassigned');
  };

  const openAlert = (a) => { setSelectedAlert(a); setModalOpen(true); };

  const allMapPoints = useMemo(() => cameras.map((c) => ({
    id: c.id,
    lat: c.lat,
    lng: c.lng,
    label: c.id,
    note: c.coverage_note,
    status: c.status,
  })), [cameras]);

  return (
    <DashboardLayout title="Central Command" roleLabel="Admin" navItems={navItems} activeKey={activeKey} onNavClick={setActiveKey}>
      {activeKey === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { l: 'Total Alerts (24h)', v: alerts.length, c: 'text-red-400' },
              { l: 'Active Cameras', v: activeCams.length, c: 'text-emerald-400' },
              { l: 'Pending Approvals', v: pendingCams.length, c: 'text-amber-400', pulse: pendingCams.length > 0 },
              { l: 'Avg Response', v: `${ANALYTICS.avg_response_time_min}m`, c: 'text-zinc-100' },
            ].map((s) => (
              <Card key={s.l} className={`bg-zinc-950 border-zinc-800 p-4 ${s.pulse ? 'border-amber-500/50' : ''}`}>
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">{s.l}</div>
                <div className={`mt-2 font-heading font-black text-3xl ${s.c}`}>{s.v}</div>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-4">
            <Card className="bg-zinc-950 border-zinc-800 p-4 lg:col-span-2">
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-500 mb-3">// Weekly Alert Volume</div>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={ANALYTICS.alerts_by_day}>
                  <XAxis dataKey="day" stroke="#71717a" style={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                  <YAxis stroke="#71717a" style={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', fontSize: 12 }} />
                  <Line type="monotone" dataKey="alerts" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 4 }} />
                  <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
            <Card className="bg-zinc-950 border-zinc-800 p-4">
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-500 mb-3">// Anomaly Breakdown</div>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={ANALYTICS.alerts_by_type} dataKey="count" nameKey="type" innerRadius={45} outerRadius={80}>
                    {ANALYTICS.alerts_by_type.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-2">
                {ANALYTICS.alerts_by_type.map((a, i) => (
                  <div key={a.type} className="flex items-center gap-1.5 text-[10px]">
                    <span className="w-2 h-2 rounded-sm" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}></span>
                    <span className="text-zinc-400 truncate">{a.type}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card className="bg-zinc-950 border-zinc-800 p-4">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-500 mb-3">// Recent Alerts</div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {alerts.slice(0, 8).map((a) => (
                <div key={a.id} className="flex items-center gap-3 p-3 rounded bg-zinc-900/50 border border-zinc-800 hover:border-red-500/40 cursor-pointer" onClick={() => openAlert(a)}>
                  <div className={`w-2 h-2 rounded-full ${a.status === 'new' ? 'bg-red-500 pulse-dot' : 'bg-zinc-600'}`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-zinc-100 truncate">{a.anomaly_type}</div>
                    <div className="text-xs text-zinc-500 truncate">{a.location} • {formatTime(a.timestamp)}</div>
                  </div>
                  <span className={`text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded border ${STATUS_COLORS[a.status].bg} ${STATUS_COLORS[a.status].text} ${STATUS_COLORS[a.status].border}`}>
                    {STATUS_COLORS[a.status].label}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeKey === 'alerts' && (
        <Card className="bg-zinc-950 border-zinc-800 p-4">
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-500 mb-3">// All System Alerts — {alerts.length}</div>
          <div className="space-y-2">
            {alerts.map((a) => (
              <div key={a.id} data-testid={`admin-alert-${a.id}`} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded bg-zinc-900/50 border border-zinc-800 hover:border-red-500/40">
                <img src={a.snapshot_url} alt="" className="w-full sm:w-20 h-12 rounded object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className={`text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded border ${STATUS_COLORS[a.status].bg} ${STATUS_COLORS[a.status].text} ${STATUS_COLORS[a.status].border}`}>
                      {STATUS_COLORS[a.status].label}
                    </span>
                    <span className="text-[10px] font-mono text-red-400">{Math.round(a.confidence * 100)}%</span>
                  </div>
                  <div className="text-sm font-semibold text-zinc-100">{a.anomaly_type}</div>
                  <div className="text-xs text-zinc-500">{a.location} • {formatTime(a.timestamp)}</div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Select value={a.station_id} onValueChange={(v) => reassign(a.id, v)}>
                    <SelectTrigger className="w-full sm:w-40 bg-zinc-900 border-zinc-800 h-9 text-xs" data-testid={`reassign-${a.id}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                      {POLICE_STATIONS.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={() => openAlert(a)} size="sm" className="bg-red-600 hover:bg-red-700 text-white h-9 text-xs uppercase tracking-wider">View</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeKey === 'approvals' && (
        <Card className="bg-zinc-950 border-zinc-800 p-4">
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-500 mb-3">// Pending Camera Approvals — {pendingCams.length}</div>
          {pendingCams.length === 0 && <div className="text-sm text-zinc-500 py-12 text-center">No pending submissions.</div>}
          <div className="grid md:grid-cols-2 gap-3">
            {pendingCams.map((c) => (
              <Card key={c.id} data-testid={`approval-card-${c.id}`} className="bg-zinc-900/50 border-amber-500/30 p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded bg-amber-500/10 border border-amber-500/40 flex items-center justify-center flex-shrink-0">
                    <Video className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-zinc-100">{c.id}</div>
                    <div className="text-xs text-zinc-500">By {c.contributor_name}</div>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">PENDING</span>
                </div>
                <div className="space-y-1.5 text-xs mb-3">
                  <div><span className="text-zinc-500">Feed Type:</span> <span className="text-zinc-200 font-mono">{c.feed_type}</span></div>
                  <div><span className="text-zinc-500">Location:</span> <span className="text-zinc-200 font-mono">{c.lat.toFixed(4)}, {c.lng.toFixed(4)}</span></div>
                  <div><span className="text-zinc-500">Coverage:</span> <span className="text-zinc-200">{c.coverage_note}</span></div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => approve(c.id)} data-testid={`approve-${c.id}`} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-9 text-xs uppercase tracking-wider">
                    <CheckCircle className="w-3.5 h-3.5 mr-1" /> Approve
                  </Button>
                  <Button onClick={() => reject(c.id)} data-testid={`reject-${c.id}`} variant="outline" className="flex-1 border-zinc-800 bg-zinc-900 hover:bg-red-500/10 hover:border-red-500/40 text-zinc-300 hover:text-red-400 h-9 text-xs uppercase tracking-wider">
                    <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}

      {activeKey === 'stations' && (
        <Card className="bg-zinc-950 border-zinc-800 p-4">
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-500 mb-3">// Police Stations — {POLICE_STATIONS.length}</div>
          <div className="grid md:grid-cols-2 gap-3">
            {POLICE_STATIONS.map((s) => {
              const stationAlerts = alerts.filter((a) => a.station_id === s.id);
              return (
                <Card key={s.id} className="bg-zinc-900/50 border-zinc-800 p-4 hud-corner">
                  <div className="flex items-start justify-between mb-3">
                    <div className="min-w-0">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-red-500">{s.id}</div>
                      <div className="font-heading font-bold text-lg uppercase truncate">{s.name}</div>
                      <div className="text-xs text-zinc-500">{s.jurisdiction}</div>
                    </div>
                    <Building2 className="w-5 h-5 text-red-500 flex-shrink-0" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-zinc-800">
                    <div>
                      <div className="text-[9px] font-mono uppercase text-zinc-500">Officers</div>
                      <div className="font-heading font-bold text-lg text-zinc-100">{s.officers}</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-mono uppercase text-zinc-500">Alerts</div>
                      <div className="font-heading font-bold text-lg text-red-400">{stationAlerts.length}</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-mono uppercase text-zinc-500">Open</div>
                      <div className="font-heading font-bold text-lg text-amber-400">{stationAlerts.filter((a) => !['resolved', 'false_positive'].includes(a.status)).length}</div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </Card>
      )}

      {activeKey === 'analytics' && (
        <div className="space-y-4">
          <Card className="bg-zinc-950 border-zinc-800 p-4">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-500 mb-3">// Hotspot Zones</div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={ANALYTICS.hotspots}>
                <XAxis dataKey="zone" stroke="#71717a" style={{ fontSize: 11 }} />
                <YAxis stroke="#71717a" style={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', fontSize: 12 }} />
                <Bar dataKey="incidents" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card className="bg-zinc-950 border-zinc-800 p-4">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-500 mb-3">// Anomaly Type Distribution</div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={ANALYTICS.alerts_by_type} layout="vertical">
                <XAxis type="number" stroke="#71717a" style={{ fontSize: 11 }} />
                <YAxis dataKey="type" type="category" stroke="#71717a" style={{ fontSize: 11 }} width={90} />
                <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', fontSize: 12 }} />
                <Bar dataKey="count" fill="#dc2626" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {activeKey === 'map' && (
        <Card className="bg-zinc-950 border-zinc-800 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-500">// Live Network — {cameras.length} cameras</div>
            <div className="flex gap-3 text-xs">
              <span className="text-emerald-400">● {activeCams.length} active</span>
              <span className="text-amber-400">● {pendingCams.length} pending</span>
              <span className="text-zinc-500">● {cameras.filter((c) => c.status === 'rejected').length} rejected</span>
            </div>
          </div>
          <MapView points={allMapPoints} height={600} showLegend />
        </Card>
      )}

      {activeKey === 'users' && (
        <Card className="bg-zinc-950 border-zinc-800 p-4">
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-500 mb-3">// User Management</div>
          <div className="space-y-2">
            {[...new Map(cameras.map((c) => [c.contributor_id, c])).values()].map((c) => (
              <div key={c.contributor_id} className="flex items-center gap-3 p-3 rounded bg-zinc-900/50 border border-zinc-800">
                <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 font-heading font-bold">
                  {c.contributor_name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-zinc-100">{c.contributor_name}</div>
                  <div className="text-xs text-zinc-500 font-mono">{c.contributor_id} • Contributor</div>
                </div>
                <Button variant="outline" size="sm" className="border-zinc-800 bg-zinc-900 hover:bg-red-500/10 hover:text-red-400 text-zinc-300 h-8 text-xs uppercase" data-testid={`suspend-${c.contributor_id}`}>Suspend</Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      <AlertDetailModal alert={selectedAlert} open={modalOpen} onOpenChange={setModalOpen} onAction={handleAction} />
    </DashboardLayout>
  );
}
