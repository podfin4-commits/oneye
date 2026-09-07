// Mock data for OnEye - CCTV Anomaly Detection Platform

// Pre-seeded demo accounts (mock login)
export const DEMO_ACCOUNTS = [
  { email: 'admin@oneye.gov', password: 'admin123', role: 'admin', name: 'Central Command', id: 'u-admin-1' },
  { email: 'police@oneye.gov', password: 'police123', role: 'police', name: 'Officer R. Mehta', station_id: 'st-001', name_station: 'Sector 21 Police Station', id: 'u-police-1' },
  { email: 'contributor@oneye.gov', password: 'contrib123', role: 'contributor', name: 'A. Sharma', id: 'u-contrib-1' },
];

export const POLICE_STATIONS = [
  { id: 'st-001', name: 'Sector 21 Police Station', lat: 28.6139, lng: 77.2090, jurisdiction: 'Central Delhi', officers: 42 },
  { id: 'st-002', name: 'Marine Drive Precinct', lat: 18.9430, lng: 72.8235, jurisdiction: 'South Mumbai', officers: 38 },
  { id: 'st-003', name: 'MG Road Station', lat: 12.9756, lng: 77.6069, jurisdiction: 'Bengaluru Central', officers: 51 },
  { id: 'st-004', name: 'Salt Lake Precinct', lat: 22.5726, lng: 88.4180, jurisdiction: 'Kolkata East', officers: 29 },
];

export const CAMERAS = [
  { id: 'cam-001', contributor_id: 'u-contrib-1', contributor_name: 'A. Sharma', lat: 28.6145, lng: 77.2095, feed_type: 'rtsp', status: 'active', coverage_note: 'Shop entrance - Connaught Place', uptime_hours: 428, alerts_triggered: 7, station_id: 'st-001' },
  { id: 'cam-002', contributor_id: 'u-contrib-1', contributor_name: 'A. Sharma', lat: 28.6150, lng: 77.2080, feed_type: 'uploaded_video', status: 'pending', coverage_note: 'Parking lot - Block C', uptime_hours: 0, alerts_triggered: 0, station_id: 'st-001' },
  { id: 'cam-003', contributor_id: 'u-contrib-2', contributor_name: 'K. Iyer', lat: 18.9440, lng: 72.8240, feed_type: 'rtsp', status: 'active', coverage_note: 'Café front - Marine Drive', uptime_hours: 812, alerts_triggered: 12, station_id: 'st-002' },
  { id: 'cam-004', contributor_id: 'u-contrib-3', contributor_name: 'S. Rao', lat: 12.9760, lng: 77.6075, feed_type: 'rtsp', status: 'active', coverage_note: 'ATM lobby - MG Road', uptime_hours: 1204, alerts_triggered: 21, station_id: 'st-003' },
  { id: 'cam-005', contributor_id: 'u-contrib-4', contributor_name: 'N. Banerjee', lat: 22.5730, lng: 88.4190, feed_type: 'uploaded_video', status: 'active', coverage_note: 'Street corner - Salt Lake Sector V', uptime_hours: 340, alerts_triggered: 4, station_id: 'st-004' },
  { id: 'cam-006', contributor_id: 'u-contrib-5', contributor_name: 'D. Kumar', lat: 28.6120, lng: 77.2110, feed_type: 'rtsp', status: 'rejected', coverage_note: 'Rooftop - obscured view', uptime_hours: 0, alerts_triggered: 0, station_id: 'st-001' },
  { id: 'cam-007', contributor_id: 'u-contrib-6', contributor_name: 'V. Nair', lat: 12.9770, lng: 77.6060, feed_type: 'rtsp', status: 'pending', coverage_note: 'Warehouse gate - MG Road', uptime_hours: 0, alerts_triggered: 0, station_id: 'st-003' },
];

// Public sample video clips for alerts (short mp4s)
const SAMPLE_CLIPS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
];

const SNAPSHOTS = [
  'https://images.unsplash.com/photo-1702682502494-3891f9e3ec59?w=800&q=70',
  'https://images.unsplash.com/photo-1718030361987-d00c9504d1a1?w=800&q=70',
  'https://images.unsplash.com/photo-1708807472445-d33589e6b090?w=800&q=70',
  'https://images.unsplash.com/photo-1652145595413-0a79398e5888?w=800&q=70',
  'https://images.unsplash.com/photo-1606022831434-91293aebf25a?w=800&q=70',
];

const ANOMALY_TYPES = ['Weapon Detected', 'Theft in Progress', 'Assault', 'Suspicious Loitering', 'Trespassing', 'Vandalism'];

const now = Date.now();
const mkTs = (minsAgo) => new Date(now - minsAgo * 60000).toISOString();

export const ALERTS = [
  { id: 'alert-001', camera_id: 'cam-001', station_id: 'st-001', anomaly_type: 'Weapon Detected', confidence: 0.96, snapshot_url: SNAPSHOTS[0], clip_url: SAMPLE_CLIPS[0], status: 'new', timestamp: mkTs(4), location: 'Connaught Place, Delhi', lat: 28.6145, lng: 77.2095 },
  { id: 'alert-002', camera_id: 'cam-003', station_id: 'st-002', anomaly_type: 'Theft in Progress', confidence: 0.89, snapshot_url: SNAPSHOTS[1], clip_url: SAMPLE_CLIPS[1], status: 'acknowledged', timestamp: mkTs(18), location: 'Marine Drive, Mumbai', lat: 18.9440, lng: 72.8240 },
  { id: 'alert-003', camera_id: 'cam-004', station_id: 'st-003', anomaly_type: 'Assault', confidence: 0.93, snapshot_url: SNAPSHOTS[2], clip_url: SAMPLE_CLIPS[2], status: 'responding', timestamp: mkTs(32), location: 'MG Road, Bengaluru', lat: 12.9760, lng: 77.6075 },
  { id: 'alert-004', camera_id: 'cam-005', station_id: 'st-004', anomaly_type: 'Suspicious Loitering', confidence: 0.72, snapshot_url: SNAPSHOTS[3], clip_url: SAMPLE_CLIPS[3], status: 'resolved', timestamp: mkTs(75), location: 'Salt Lake, Kolkata', lat: 22.5730, lng: 88.4190 },
  { id: 'alert-005', camera_id: 'cam-001', station_id: 'st-001', anomaly_type: 'Trespassing', confidence: 0.81, snapshot_url: SNAPSHOTS[4], clip_url: SAMPLE_CLIPS[4], status: 'new', timestamp: mkTs(9), location: 'Connaught Place, Delhi', lat: 28.6145, lng: 77.2095 },
  { id: 'alert-006', camera_id: 'cam-003', station_id: 'st-002', anomaly_type: 'Vandalism', confidence: 0.78, snapshot_url: SNAPSHOTS[1], clip_url: SAMPLE_CLIPS[0], status: 'false_positive', timestamp: mkTs(140), location: 'Marine Drive, Mumbai', lat: 18.9440, lng: 72.8240 },
  { id: 'alert-007', camera_id: 'cam-004', station_id: 'st-003', anomaly_type: 'Weapon Detected', confidence: 0.94, snapshot_url: SNAPSHOTS[0], clip_url: SAMPLE_CLIPS[2], status: 'resolved', timestamp: mkTs(220), location: 'MG Road, Bengaluru', lat: 12.9760, lng: 77.6075 },
  { id: 'alert-008', camera_id: 'cam-001', station_id: 'st-001', anomaly_type: 'Theft in Progress', confidence: 0.87, snapshot_url: SNAPSHOTS[1], clip_url: SAMPLE_CLIPS[3], status: 'resolved', timestamp: mkTs(310), location: 'Connaught Place, Delhi', lat: 28.6145, lng: 77.2095 },
];

// System analytics
export const ANALYTICS = {
  total_alerts: 1284,
  active_cameras: 342,
  pending_approvals: 2,
  avg_response_time_min: 6.4,
  alerts_by_type: [
    { type: 'Theft', count: 412 },
    { type: 'Weapon', count: 218 },
    { type: 'Assault', count: 187 },
    { type: 'Loitering', count: 264 },
    { type: 'Trespass', count: 141 },
    { type: 'Vandalism', count: 62 },
  ],
  alerts_by_day: [
    { day: 'Mon', alerts: 142, resolved: 128 },
    { day: 'Tue', alerts: 168, resolved: 152 },
    { day: 'Wed', alerts: 189, resolved: 171 },
    { day: 'Thu', alerts: 201, resolved: 190 },
    { day: 'Fri', alerts: 234, resolved: 215 },
    { day: 'Sat', alerts: 178, resolved: 165 },
    { day: 'Sun', alerts: 172, resolved: 156 },
  ],
  hotspots: [
    { zone: 'Connaught Place', incidents: 87 },
    { zone: 'MG Road', incidents: 74 },
    { zone: 'Marine Drive', incidents: 62 },
    { zone: 'Salt Lake', incidents: 41 },
  ],
};

export const LEADERBOARD = [
  { id: 'u-contrib-4', name: 'S. Rao', cameras: 3, alerts_caught: 21, safety_score: 942 },
  { id: 'u-contrib-3', name: 'K. Iyer', cameras: 2, alerts_caught: 12, safety_score: 768 },
  { id: 'u-contrib-1', name: 'A. Sharma', cameras: 2, alerts_caught: 7, safety_score: 512 },
  { id: 'u-contrib-4b', name: 'N. Banerjee', cameras: 1, alerts_caught: 4, safety_score: 348 },
  { id: 'u-contrib-6', name: 'V. Nair', cameras: 1, alerts_caught: 0, safety_score: 60 },
];

export const STATUS_COLORS = {
  new: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/50', label: 'NEW' },
  acknowledged: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/50', label: 'ACKNOWLEDGED' },
  responding: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/50', label: 'RESPONDING' },
  resolved: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/50', label: 'RESOLVED' },
  false_positive: { bg: 'bg-zinc-500/20', text: 'text-zinc-400', border: 'border-zinc-500/50', label: 'FALSE POSITIVE' },
};

export const CAM_STATUS_COLORS = {
  active: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/40', label: 'ACTIVE' },
  pending: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/40', label: 'PENDING' },
  rejected: { bg: 'bg-zinc-600/20', text: 'text-zinc-400', border: 'border-zinc-500/40', label: 'REJECTED' },
};

export const formatTime = (iso) => {
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 60000;
  if (diff < 1) return 'just now';
  if (diff < 60) return `${Math.floor(diff)}m ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return d.toLocaleDateString();
};
