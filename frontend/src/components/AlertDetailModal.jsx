import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { STATUS_COLORS, formatTime } from '@/data/mockData';
import { MapPin, Camera, Zap, CheckCircle2, XCircle, Siren } from 'lucide-react';
import MapView from './MapView';

export default function AlertDetailModal({ alert, open, onOpenChange, onAction, allowActions = true }) {
  if (!alert) return null;
  const status = STATUS_COLORS[alert.status];
  const confPercent = Math.round(alert.confidence * 100);

  const actions = [
    { key: 'acknowledged', label: 'Acknowledge', icon: CheckCircle2, cls: 'bg-amber-600 hover:bg-amber-700' },
    { key: 'responding', label: 'Responding', icon: Siren, cls: 'bg-blue-600 hover:bg-blue-700' },
    { key: 'resolved', label: 'Resolved', icon: CheckCircle2, cls: 'bg-emerald-600 hover:bg-emerald-700' },
    { key: 'false_positive', label: 'False Positive', icon: XCircle, cls: 'bg-zinc-700 hover:bg-zinc-600' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100 max-w-4xl max-h-[90vh] overflow-y-auto p-0" data-testid="alert-detail-modal">
        <DialogHeader className="p-5 border-b border-zinc-800 sticky top-0 bg-zinc-950 z-10">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border ${status.bg} ${status.text} ${status.border}`}>
                  {status.label}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                  {formatTime(alert.timestamp)}
                </span>
              </div>
              <DialogTitle className="font-heading text-xl sm:text-2xl uppercase text-red-400">
                {alert.anomaly_type}
              </DialogTitle>
              <div className="mt-1 text-xs font-mono text-zinc-500">Alert ID: {alert.id}</div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Confidence</div>
              <div className={`font-heading font-black text-3xl ${confPercent > 85 ? 'text-red-400' : 'text-amber-400'}`}>
                {confPercent}%
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="p-5 grid md:grid-cols-2 gap-5">
          {/* Video clip */}
          <div className="space-y-3">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-500">// Incident Clip</div>
            <div className="relative aspect-video rounded overflow-hidden bg-black hud-corner">
              <video
                key={alert.id}
                data-testid="alert-video-player"
                src={alert.clip_url}
                poster={alert.snapshot_url}
                controls
                autoPlay
                loop
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 px-2 py-1 rounded bg-red-600/90 text-white text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white pulse-dot"></span> Evidence
              </div>
            </div>
            <div className="text-xs text-zinc-500 font-mono">Clip covers ~5s before + after trigger</div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-500 mb-2">// Incident Details</div>
              <div className="space-y-2.5">
                <div className="flex items-start gap-3 p-3 rounded bg-zinc-900 border border-zinc-800">
                  <MapPin className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Location</div>
                    <div className="text-sm text-zinc-100 font-medium">{alert.location}</div>
                    <div className="text-[10px] font-mono text-zinc-500 mt-0.5">{alert.lat.toFixed(4)}°N, {alert.lng.toFixed(4)}°E</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded bg-zinc-900 border border-zinc-800">
                  <Camera className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Source Camera</div>
                    <div className="text-sm text-zinc-100 font-medium">{alert.camera_id}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded bg-zinc-900 border border-zinc-800">
                  <Zap className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Detection Model</div>
                    <div className="text-sm text-zinc-100 font-medium">OnEye-V3 Vision Pipeline</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-500 mb-2">// Map</div>
              <MapView points={[{ id: alert.id, lat: alert.lat, lng: alert.lng, label: alert.location, status: 'new' }]} height={180} />
            </div>
          </div>
        </div>

        {allowActions && (
          <div className="p-5 border-t border-zinc-800 bg-zinc-950/80 sticky bottom-0">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-500 mb-3">// Triage Actions</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {actions.map((a) => (
                <Button
                  key={a.key}
                  data-testid={`alert-action-${a.key}`}
                  onClick={() => onAction && onAction(alert.id, a.key)}
                  className={`${a.cls} text-white h-10 text-xs uppercase tracking-wider font-semibold`}
                >
                  <a.icon className="w-3.5 h-3.5 mr-1.5" /> {a.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
