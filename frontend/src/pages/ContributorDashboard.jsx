import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import MapView from '@/components/MapView';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CAMERAS as SEED_CAMERAS, LEADERBOARD, CAM_STATUS_COLORS } from '@/data/mockData';
import { LayoutDashboard, Plus, Trophy, Camera as CameraIcon, MapPin, Video, Award, Activity } from 'lucide-react';

export default function ContributorDashboard() {
  const { user } = useAuth();
  const [cameras, setCameras] = useState(SEED_CAMERAS);
  const [activeKey, setActiveKey] = useState('overview');

  const myCameras = useMemo(() => cameras.filter((c) => c.contributor_id === user?.id || c.contributor_id === 'u-contrib-1'), [cameras, user]);
  const totalAlertsCaught = myCameras.reduce((sum, c) => sum + c.alerts_triggered, 0);
  const activeCount = myCameras.filter((c) => c.status === 'active').length;
  const pendingCount = myCameras.filter((c) => c.status === 'pending').length;
  const myRank = LEADERBOARD.findIndex((x) => x.name === 'A. Sharma') + 1 || 3;

  const navItems = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'submit', label: 'Submit Camera', icon: Plus },
    { key: 'cameras', label: 'My Cameras', icon: CameraIcon, badge: pendingCount },
    { key: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  const handleSubmit = (newCam) => {
    const cam = {
      id: `cam-${Date.now()}`,
      contributor_id: user?.id || 'u-contrib-1',
      contributor_name: user?.name || 'A. Sharma',
      ...newCam,
      status: 'pending',
      uptime_hours: 0,
      alerts_triggered: 0,
      station_id: 'st-001',
    };
    setCameras((prev) => [cam, ...prev]);
    toast.success('Camera submitted for admin review');
    setActiveKey('cameras');
  };

  return (
    <DashboardLayout title="Contributor Portal" roleLabel="Public Contributor" navItems={navItems} activeKey={activeKey} onNavClick={setActiveKey}>
      {activeKey === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { l: 'My Cameras', v: myCameras.length, c: 'text-zinc-100', i: CameraIcon },
              { l: 'Active', v: activeCount, c: 'text-emerald-400', i: Activity },
              { l: 'Alerts Caught', v: totalAlertsCaught, c: 'text-red-400', i: Award },
              { l: 'Safety Rank', v: `#${myRank}`, c: 'text-amber-400', i: Trophy },
            ].map((s) => (
              <Card key={s.l} className="bg-zinc-950 border-zinc-800 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">{s.l}</div>
                  <s.i className="w-4 h-4 text-red-500/70" />
                </div>
                <div className={`font-heading font-black text-3xl ${s.c}`}>{s.v}</div>
              </Card>
            ))}
          </div>

          <Card className="bg-zinc-950 border-red-500/20 p-6 hud-corner">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/40 flex items-center justify-center flex-shrink-0">
                <Award className="w-6 h-6 text-red-500" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-500">// Safety Score</div>
                <div className="font-heading font-black text-4xl text-zinc-100">512 <span className="text-lg text-zinc-500">pts</span></div>
                <div className="text-sm text-zinc-400 mt-1">Every incident caught earns points. Rank up on the citizen leaderboard.</div>
              </div>
              <Button onClick={() => setActiveKey('leaderboard')} className="bg-red-600 hover:bg-red-700 text-white h-10 text-xs uppercase tracking-wider" data-testid="view-leaderboard-btn">
                View Leaderboard
              </Button>
            </div>
          </Card>

          <Card className="bg-zinc-950 border-zinc-800 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-500">// My Camera Fleet</div>
              <Button onClick={() => setActiveKey('submit')} size="sm" className="bg-red-600 hover:bg-red-700 text-white h-9 text-xs uppercase tracking-wider" data-testid="add-camera-btn">
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Camera
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {myCameras.map((c) => <CameraCard key={c.id} camera={c} />)}
            </div>
          </Card>
        </div>
      )}

      {activeKey === 'submit' && <SubmitCameraForm onSubmit={handleSubmit} />}

      {activeKey === 'cameras' && (
        <Card className="bg-zinc-950 border-zinc-800 p-4">
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-500 mb-3">// My Cameras — {myCameras.length}</div>
          <div className="grid md:grid-cols-2 gap-3">
            {myCameras.map((c) => <CameraCard key={c.id} camera={c} />)}
          </div>
        </Card>
      )}

      {activeKey === 'leaderboard' && (
        <Card className="bg-zinc-950 border-zinc-800 p-4">
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-500 mb-3">// Citizen Safety Leaderboard</div>
          <div className="space-y-2">
            {LEADERBOARD.map((entry, idx) => (
              <div key={entry.id} data-testid={`leaderboard-${idx}`} className={`flex items-center gap-3 p-3 rounded border ${idx === 0 ? 'bg-red-500/5 border-red-500/40' : 'bg-zinc-900/50 border-zinc-800'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-heading font-black text-lg flex-shrink-0 ${idx === 0 ? 'bg-red-500 text-white' : idx === 1 ? 'bg-zinc-500 text-white' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-zinc-100">{entry.name}</div>
                  <div className="text-xs text-zinc-500 font-mono">{entry.cameras} cameras • {entry.alerts_caught} caught</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-heading font-black text-xl text-red-400">{entry.safety_score}</div>
                  <div className="text-[9px] font-mono uppercase tracking-wider text-zinc-500">points</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </DashboardLayout>
  );
}

function CameraCard({ camera }) {
  const st = CAM_STATUS_COLORS[camera.status];
  return (
    <Card data-testid={`camera-card-${camera.id}`} className="bg-zinc-900/50 border-zinc-800 p-4 hover:border-red-500/40 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded bg-red-500/10 border border-red-500/30 flex items-center justify-center flex-shrink-0">
            <Video className="w-4 h-4 text-red-500" />
          </div>
          <div className="min-w-0">
            <div className="font-mono text-xs text-zinc-500">{camera.id}</div>
            <div className="text-sm font-semibold text-zinc-100 truncate">{camera.coverage_note}</div>
          </div>
        </div>
        <span className={`text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded border ${st.bg} ${st.text} ${st.border} flex-shrink-0`}>
          {st.label}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-zinc-800">
        <div>
          <div className="text-[9px] font-mono uppercase text-zinc-500">Uptime</div>
          <div className="text-sm font-semibold text-zinc-100">{camera.uptime_hours}h</div>
        </div>
        <div>
          <div className="text-[9px] font-mono uppercase text-zinc-500">Alerts</div>
          <div className="text-sm font-semibold text-red-400">{camera.alerts_triggered}</div>
        </div>
      </div>
      <div className="mt-2 text-[10px] font-mono text-zinc-500 flex items-center gap-1">
        <MapPin className="w-3 h-3" /> {camera.lat.toFixed(4)}, {camera.lng.toFixed(4)}
      </div>
    </Card>
  );
}

function SubmitCameraForm({ onSubmit }) {
  const [coverage, setCoverage] = useState('');
  const [feedType, setFeedType] = useState('rtsp');
  const [rtspUrl, setRtspUrl] = useState('');
  const [lat, setLat] = useState(28.6139);
  const [lng, setLng] = useState(77.2090);
  const [fileName, setFileName] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!coverage || (feedType === 'rtsp' && !rtspUrl) || (feedType === 'uploaded_video' && !fileName)) {
      toast.error('Please fill in all required fields');
      return;
    }
    onSubmit({
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      feed_type: feedType,
      coverage_note: coverage,
    });
  };

  return (
    <Card className="bg-zinc-950 border-zinc-800 p-4 sm:p-6">
      <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-500 mb-1">// New Camera Submission</div>
      <h2 className="font-heading font-black text-2xl uppercase mb-6">Register a camera</h2>

      <form onSubmit={submit} className="space-y-5">
        <div>
          <Label className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500 mb-2 block">Location — click on map to pin</Label>
          <MapView
            points={[{ id: 'new', lat, lng, label: 'New camera', status: 'pending' }]}
            height={280}
            onMapClick={(ll) => { setLat(ll.lat); setLng(ll.lng); toast.success('Pin placed'); }}
          />
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Input value={lat.toFixed(4)} readOnly className="bg-zinc-900 border-zinc-800 h-10 font-mono text-xs" data-testid="camera-lat" />
            <Input value={lng.toFixed(4)} readOnly className="bg-zinc-900 border-zinc-800 h-10 font-mono text-xs" data-testid="camera-lng" />
          </div>
        </div>

        <div>
          <Label className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500 mb-2 block">Feed Type</Label>
          <RadioGroup value={feedType} onValueChange={setFeedType} className="grid grid-cols-2 gap-2">
            <label className={`flex items-center gap-2 p-3 rounded border cursor-pointer ${feedType === 'rtsp' ? 'border-red-500 bg-red-500/10' : 'border-zinc-800 bg-zinc-900'}`} data-testid="feedtype-rtsp">
              <RadioGroupItem value="rtsp" className="border-red-500 text-red-500" />
              <div>
                <div className="text-sm font-semibold text-zinc-100">RTSP Stream</div>
                <div className="text-[10px] font-mono text-zinc-500">Real IP camera</div>
              </div>
            </label>
            <label className={`flex items-center gap-2 p-3 rounded border cursor-pointer ${feedType === 'uploaded_video' ? 'border-red-500 bg-red-500/10' : 'border-zinc-800 bg-zinc-900'}`} data-testid="feedtype-upload">
              <RadioGroupItem value="uploaded_video" className="border-red-500 text-red-500" />
              <div>
                <div className="text-sm font-semibold text-zinc-100">Upload Video</div>
                <div className="text-[10px] font-mono text-zinc-500">Sample file / demo</div>
              </div>
            </label>
          </RadioGroup>
        </div>

        {feedType === 'rtsp' ? (
          <div>
            <Label className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500 mb-2 block">RTSP URL</Label>
            <Input
              data-testid="rtsp-url-input"
              value={rtspUrl}
              onChange={(e) => setRtspUrl(e.target.value)}
              placeholder="rtsp://192.168.1.100:554/stream"
              className="bg-zinc-900 border-zinc-800 h-11 font-mono text-xs focus-visible:ring-red-500"
            />
          </div>
        ) : (
          <div>
            <Label className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500 mb-2 block">Sample Video File</Label>
            <label className="block cursor-pointer">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
                className="hidden"
                data-testid="video-file-input"
              />
              <div className="p-4 border border-dashed border-zinc-800 rounded bg-zinc-900 hover:border-red-500/40 text-center">
                <Video className="w-6 h-6 mx-auto text-zinc-500 mb-2" />
                <div className="text-sm text-zinc-300">{fileName || 'Click to select a video file'}</div>
                <div className="text-[10px] font-mono text-zinc-500 mt-1">MP4, MOV, WEBM</div>
              </div>
            </label>
          </div>
        )}

        <div>
          <Label className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500 mb-2 block">Coverage Note</Label>
          <Textarea
            data-testid="coverage-note-input"
            value={coverage}
            onChange={(e) => setCoverage(e.target.value)}
            placeholder="e.g. Shop entrance, street corner, parking lot..."
            className="bg-zinc-900 border-zinc-800 focus-visible:ring-red-500 min-h-[80px]"
          />
        </div>

        <Button type="submit" data-testid="submit-camera-btn" className="w-full bg-red-600 hover:bg-red-700 text-white h-11 rounded-md font-semibold uppercase tracking-wider text-sm">
          Submit for Approval
        </Button>
      </form>
    </Card>
  );
}
