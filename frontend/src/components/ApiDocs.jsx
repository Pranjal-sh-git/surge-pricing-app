import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Terminal, Code2, BookOpen, Layers, CheckCircle, 
  AlertTriangle, ArrowLeft, Copy, Key, Plus, Trash2, 
  Eye, EyeOff, Lock, Activity, Check, ExternalLink, ShieldAlert
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const ApiDocs = ({ onOpenAuth }) => {
  const { user, generateApiKey, revokeApiKey } = useAuth();
  
  const [activeTab, setActiveTab] = useState('js'); // js, python, curl
  const [copiedText, setCopiedText] = useState(false);
  const [copiedKeyId, setCopiedKeyId] = useState(null);
  
  const [activeSection, setActiveSection] = useState(user ? 'keys' : 'docs'); // keys, docs
  const [keyName, setKeyName] = useState('');
  const [revealedKeys, setRevealedKeys] = useState({}); // keyId -> boolean
  const [showKeyForm, setShowKeyForm] = useState(false);

  const copyToClipboard = (text, type = 'code', keyId = null) => {
    navigator.clipboard.writeText(text);
    if (type === 'key') {
      setCopiedKeyId(keyId);
      setTimeout(() => setCopiedKeyId(null), 2000);
    } else {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  const handleCreateKey = (e) => {
    e.preventDefault();
    generateApiKey(keyName || 'Default API Key');
    setKeyName('');
    setShowKeyForm(false);
  };

  const toggleRevealKey = (id) => {
    setRevealedKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const formatKey = (keyString, isRevealed) => {
    if (isRevealed) return keyString;
    return `${keyString.slice(0, 8)}••••••••••••••••${keyString.slice(-4)}`;
  };

  const formatDateTime = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return '—';
    }
  };

  const apiKeys = user?.apiKeys || [];

  const codeSnippets = {
    js: `// Fetch Surge Multiplier & Fare Estimate
const getSurgeEstimate = async () => {
  const response = await fetch('http://localhost:5000/api/predict-surge', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${apiKeys[0]?.key || 'YOUR_API_KEY'}'
    },
    body: JSON.stringify({
      distance_km: 8.5,
      pickup_hour: 18,       // 6:00 PM peak hour
      pickup_day: 4,         // Friday
      pickup_month: 11,      // November (Diwali season)
      cab_type_encoded: 1,   // Uber India
      name_encoded: 2,       // Sedan Tier
      city_encoded: 2,       // Bangalore
      is_bad_weather: 0,
      is_festival: 1         // Diwali Active
    })
  });

  const data = await response.json();
  console.log('Surge Multiplier:', data.predicted_surge);
  console.log('Estimated Fare:', data.estimated_fare);
};`,
    python: `# Python Inference Call using requests
import requests

url = "http://localhost:5000/api/predict-surge"
headers = {
    "Authorization": "Bearer ${apiKeys[0]?.key || 'YOUR_API_KEY'}"
}
payload = {
    "distance_km": 8.5,
    "pickup_hour": 18,
    "pickup_day": 4,
    "pickup_month": 11,
    "cab_type_encoded": 1,
    "name_encoded": 2,
    "city_encoded": 2,
    "is_bad_weather": 0,
    "is_festival": 1
}

response = requests.post(url, json=payload, headers=headers)
data = response.json()

print(f"Predicted Surge: {data['predicted_surge']}x")
print(f"Estimated Fare: ₹{data['estimated_fare']}")`,
    curl: `curl -X POST http://localhost:5000/api/predict-surge \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${apiKeys[0]?.key || 'YOUR_API_KEY'}" \\
  -d '{
    "distance_km": 8.5,
    "pickup_hour": 18,
    "pickup_day": 4,
    "pickup_month": 11,
    "cab_type_encoded": 1,
    "name_encoded": 2,
    "city_encoded": 2,
    "is_bad_weather": 0,
    "is_festival": 1
  }'`
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans py-24 px-6 lg:px-8 relative overflow-hidden">
      {/* Background Grid Pattern & Glows */}
      <div className="absolute inset-0 opacity-[0.05]" 
        style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />
      <div className="absolute top-[-20%] left-[-20%] w-[800px] h-[800px] bg-[#1DB954]/10 rounded-full blur-[150px] -z-10" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[800px] h-[800px] bg-[#00f3ff]/10 rounded-full blur-[150px] -z-10" />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        
        {/* Navigation / Header */}
        <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-6">
          <a href="#/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#1DB954] font-medium text-sm transition-all group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </a>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#1DB954] flex items-center justify-center">
              <Zap size={12} className="text-black" strokeWidth={2.5} />
            </span>
            <span className="text-sm font-display font-bold text-white tracking-tight">
              Surge<span className="text-[#1DB954]">IQ</span> DevPortal
            </span>
          </div>
        </div>

        {/* Title Section */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full border border-[#F59E0B]/30 bg-[#F59E0B]/10 text-xs text-[#F59E0B] font-bold uppercase tracking-widest">
            <BookOpen size={12} />
            Developer Resources
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-white mb-4">
            API Access & <span className="text-gradient">Integrations.</span>
          </h1>
          <p className="text-[#B3B3B3] text-sm md:text-base max-w-3xl leading-relaxed">
            Integrate SurgeIQ's XGBoost machine learning model predictions into your own ridesharing applications. 
            Generate sandbox tokens, review technical specifications, and trigger test estimations.
          </p>
        </div>

        {/* If user is not logged in, show a beautiful sign-in banner */}
        {!user && (
          <div className="mb-8 p-6 rounded-3xl bg-[#181818]/60 border border-yellow-500/20 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 flex-shrink-0">
                <Lock size={20} />
              </div>
              <div>
                <h3 className="text-white font-bold text-base leading-tight">API Key Generation Locked</h3>
                <p className="text-zinc-400 text-xs mt-1 max-w-xl">
                  You are viewing the public API documentation. Sign in to your account to generate custom sandbox credentials, track active tokens, and monitor pricing query logs.
                </p>
              </div>
            </div>
            <button 
              onClick={onOpenAuth}
              className="px-5 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-black uppercase tracking-wider flex-shrink-0 transition-all cursor-pointer shadow-lg shadow-yellow-500/10"
            >
              Sign In to Generate Keys
            </button>
          </div>
        )}

        {/* Navigation Tabs (Only if logged in) */}
        {user && (
          <div className="flex border-b border-white/5 mb-8 p-1 rounded-xl bg-white/[0.02] max-w-md">
            <button
              onClick={() => setActiveSection('keys')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer
                ${activeSection === 'keys'
                  ? 'bg-white/10 text-white shadow-lg'
                  : 'text-zinc-500 hover:text-white'
                }`}
            >
              <Key size={12} />
              Credentials & Metrics
            </button>
            <button
              onClick={() => setActiveSection('docs')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer
                ${activeSection === 'docs'
                  ? 'bg-white/10 text-white shadow-lg'
                  : 'text-zinc-500 hover:text-white'
                }`}
            >
              <Terminal size={12} />
              Documentation Reference
            </button>
          </div>
        )}

        {/* SECTION 1: Credentials & Metrics (Only for Auth Users) */}
        {user && activeSection === 'keys' && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-12 gap-8 items-start">
              {/* API Keys Table */}
              <div className="md:col-span-8 p-6 rounded-3xl bg-[#181818]/40 border border-white/10 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                  <div>
                    <h3 className="text-lg font-bold text-white leading-none">Sandbox API Keys</h3>
                    <span className="text-[10px] text-zinc-500 mt-1 block">Active secret credentials for API authentications</span>
                  </div>
                  <button
                    onClick={() => setShowKeyForm(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1DB954] text-black text-xs font-black uppercase tracking-wider hover:bg-[#1ed760] hover:shadow-[0_0_16px_rgba(29,185,84,0.3)] transition-all cursor-pointer"
                  >
                    <Plus size={12} strokeWidth={2.5} />
                    Generate Key
                  </button>
                </div>

                {/* Key name generation form overlay/inline */}
                {showKeyForm && (
                  <motion.form 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleCreateKey} 
                    className="mb-6 p-4 rounded-2xl bg-black/40 border border-[#1DB954]/20 space-y-3"
                  >
                    <label className="block text-[10px] text-zinc-400 uppercase font-black tracking-wider">Key Label / Name</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={keyName}
                        onChange={(e) => setKeyName(e.target.value)}
                        placeholder="e.g. My Rideshare Client"
                        className="flex-1 px-3 py-2 rounded-xl bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-[#1DB954]"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#1DB954] text-black text-xs font-bold rounded-xl hover:bg-[#1ed760] transition-colors"
                      >
                        Create
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowKeyForm(false)}
                        className="px-4 py-2 border border-white/10 text-xs text-zinc-400 hover:text-white rounded-xl"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.form>
                )}

                {/* Keys list */}
                {apiKeys.length === 0 ? (
                  <div className="py-12 text-center text-zinc-500">
                    <Key size={32} className="mx-auto mb-3 opacity-30 text-zinc-400" />
                    <p className="text-sm font-semibold text-white/95">No API Keys Generated</p>
                    <p className="text-xs text-zinc-600 mt-1 max-w-sm mx-auto">
                      Click the "Generate Key" button above to create a sandbox credentials key for your project.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-white/5 text-zinc-400">
                          <th className="py-2 font-bold">Key Name</th>
                          <th className="py-2 font-bold">Secret Token</th>
                          <th className="py-2 font-bold">Created</th>
                          <th className="py-2 font-bold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-zinc-300">
                        {apiKeys.map((k) => (
                          <tr key={k.id} className="group hover:bg-white/[0.01] transition-colors">
                            <td className="py-3 font-semibold text-white">{k.name}</td>
                            <td className="py-3 font-mono text-[11px] text-zinc-400 select-all">
                              {formatKey(k.key, revealedKeys[k.id])}
                            </td>
                            <td className="py-3 text-zinc-500 font-mono text-[10px]">{formatDateTime(k.createdAt)}</td>
                            <td className="py-3 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  onClick={() => toggleRevealKey(k.id)}
                                  className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer"
                                  title={revealedKeys[k.id] ? "Hide Key" : "Reveal Key"}
                                >
                                  {revealedKeys[k.id] ? <EyeOff size={12} /> : <Eye size={12} />}
                                </button>
                                <button
                                  onClick={() => copyToClipboard(k.key, 'key', k.id)}
                                  className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-zinc-400 hover:text-[#1DB954] transition-all cursor-pointer"
                                  title="Copy Key"
                                >
                                  {copiedKeyId === k.id ? <span className="text-[10px] font-bold text-[#1DB954]">Copied!</span> : <Copy size={12} />}
                                </button>
                                <button
                                  onClick={() => revokeApiKey(k.id)}
                                  className="w-7 h-7 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-zinc-500 hover:text-red-400 transition-all cursor-pointer"
                                  title="Delete Key"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Usage Metrics Panel */}
              <div className="md:col-span-4 space-y-6">
                <div className="p-5 rounded-2xl bg-[#181818]/60 border border-white/10 backdrop-blur-xl">
                  <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Activity size={14} className="text-[#00f3ff]" /> Sandbox Analytics
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-[10px] text-zinc-500 mb-1 font-bold">
                        <span>API QUOTA USAGE</span>
                        <span>14.2%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#00f3ff] to-[#1DB954] rounded-full" style={{ width: '14.2%' }} />
                      </div>
                      <span className="text-[9px] text-zinc-600 mt-1 block">1,420 of 10,000 requests / month</span>
                    </div>

                    <div className="h-px bg-white/5" />

                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                        <span className="text-[9px] text-zinc-500 uppercase block">Latency</span>
                        <span className="text-sm font-bold text-[#1DB954]">124 ms</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                        <span className="text-[9px] text-zinc-500 uppercase block">Success</span>
                        <span className="text-sm font-bold text-[#00f3ff]">99.85%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-[#1DB954]/20 bg-[#1DB954]/[0.02] flex items-start gap-2.5">
                  <CheckCircle size={14} className="text-[#1DB954] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-white">Interactive Console</span>
                    <p className="text-[10px] text-zinc-400 mt-0.5 leading-relaxed">
                      You can test endpoints in real-time. Head over to our documentation tab, grab your API Key and execute a query via our code sandboxes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: Documentation Reference (Always visible if not logged in, otherwise on tab select) */}
        {(!user || activeSection === 'docs') && (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Endpoint description */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Base URL */}
              <div className="p-5 rounded-2xl bg-[#181818]/60 border border-white/10 backdrop-blur-xl">
                <h3 className="text-white font-bold text-base mb-2 flex items-center gap-2">
                  <Terminal size={16} className="text-[#1DB954]" /> Base URL
                </h3>
                <div className="p-3 bg-black/40 rounded-xl border border-white/5 font-mono text-xs text-[#00f3ff] break-all select-all">
                  http://localhost:5000
                </div>
              </div>

              {/* Endpoint: POST /api/predict-surge */}
              <div className="p-6 rounded-3xl bg-[#181818]/40 border border-white/10 backdrop-blur-xl space-y-6">
                
                <div className="flex flex-wrap items-center gap-3 border-b border-white/5 pb-4">
                  <span className="px-3 py-1 bg-[#00f3ff]/15 border border-[#00f3ff]/30 text-[#00f3ff] text-xs font-black rounded-lg">POST</span>
                  <span className="font-mono text-sm font-bold text-white">/api/predict-surge</span>
                  <span className="ml-auto text-xs text-zinc-400 font-medium">Predict surge multiplier & fare</span>
                </div>

                {/* Authentication header note */}
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2.5 text-xs text-zinc-300">
                  <Lock size={14} className="text-zinc-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-white block">Bearer Authentication</span>
                    Pass your API token in the request header keys:
                    <span className="block font-mono text-[#F59E0B] text-[10px] mt-1">Authorization: Bearer sq_live_...</span>
                  </div>
                </div>

                {/* Request Parameters */}
                <div>
                  <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                    <Layers size={14} className="text-[#1DB954]" /> Request Payload (JSON)
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-white/5 text-zinc-400">
                          <th className="py-2 font-bold">Field</th>
                          <th className="py-2 font-bold">Type</th>
                          <th className="py-2 font-bold">Required</th>
                          <th className="py-2 font-bold">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-zinc-300 font-medium">
                        <tr>
                          <td className="py-3 font-mono text-[#00f3ff]">distance_km</td>
                          <td className="py-3 text-zinc-400">float</td>
                          <td className="py-3 text-red-500 font-black">Yes</td>
                          <td className="py-3 text-zinc-400">Ride distance in kilometers. Must be &gt; 0.</td>
                        </tr>
                        <tr>
                          <td className="py-3 font-mono text-[#00f3ff]">pickup_hour</td>
                          <td className="py-3 text-zinc-400">int</td>
                          <td className="py-3 text-zinc-500">No</td>
                          <td className="py-3 text-zinc-400">Hour of the day (0-23). Defaults to current hour.</td>
                        </tr>
                        <tr>
                          <td className="py-3 font-mono text-[#00f3ff]">pickup_day</td>
                          <td className="py-3 text-zinc-400">int</td>
                          <td className="py-3 text-zinc-500">No</td>
                          <td className="py-3 text-zinc-400">Day of the week (0=Mon, 6=Sun). Defaults to current day.</td>
                        </tr>
                        <tr>
                          <td className="py-3 font-mono text-[#00f3ff]">pickup_month</td>
                          <td className="py-3 text-zinc-400">int</td>
                          <td className="py-3 text-zinc-500">No</td>
                          <td className="py-3 text-zinc-400">Month of the year (1-12). Defaults to current month.</td>
                        </tr>
                        <tr>
                          <td className="py-3 font-mono text-[#00f3ff]">cab_type</td>
                          <td className="py-3 text-zinc-400">int</td>
                          <td className="py-3 text-zinc-500">No</td>
                          <td className="py-3 text-zinc-400">Operator encoding: 0 = Ola, 1 = Uber India.</td>
                        </tr>
                        <tr>
                          <td className="py-3 font-mono text-[#00f3ff]">ride_tier</td>
                          <td className="py-3 text-zinc-400">int</td>
                          <td className="py-3 text-zinc-500">No</td>
                          <td className="py-3 text-zinc-400">Vehicle tier encoding: 0 = Auto, 1 = Mini, 2 = Sedan, 3 = Prime Sedan, 4 = Prime SUV, 5 = Bike.</td>
                        </tr>
                        <tr>
                          <td className="py-3 font-mono text-[#00f3ff]">city_encoded</td>
                          <td className="py-3 text-zinc-400">int</td>
                          <td className="py-3 text-zinc-500">No</td>
                          <td className="py-3 text-zinc-400">City encoding: 0=Mumbai, 1=Delhi, 2=Bangalore, 3=Hyderabad, 4=Chennai, 5=Pune. (Default: 2)</td>
                        </tr>
                        <tr>
                          <td className="py-3 font-mono text-[#00f3ff]">simulate_rain</td>
                          <td className="py-3 text-zinc-400">boolean</td>
                          <td className="py-3 text-zinc-500">No</td>
                          <td className="py-3 text-zinc-400">Simulate bad weather multiplier (+0.2x).</td>
                        </tr>
                        <tr>
                          <td className="py-3 font-mono text-[#00f3ff]">is_festival</td>
                          <td className="py-3 text-zinc-400">int</td>
                          <td className="py-3 text-zinc-500">No</td>
                          <td className="py-3 text-zinc-400">Indicates festival season (Diwali, Holi) for peak hikes (0 or 1).</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Response Fields */}
                <div className="border-t border-white/5 pt-4">
                  <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                    <CheckCircle size={14} className="text-[#1DB954]" /> Response Fields (JSON)
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="font-mono text-[#1DB954] font-bold">predicted_surge</span>
                      <p className="text-zinc-400 mt-1">Float representing predicted surge multiplier (e.g., 1.45)</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="font-mono text-[#1DB954] font-bold">estimated_fare</span>
                      <p className="text-zinc-400 mt-1">Final trip cost calculated after applying the predicted surge multiplier</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="font-mono text-[#1DB954] font-bold">base_fare / rate_per_km</span>
                      <p className="text-zinc-400 mt-1">Tier-specific base rate and per-km pricing applied</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="font-mono text-[#1DB954] font-bold">surge_active</span>
                      <p className="text-zinc-400 mt-1">Boolean flag indicating whether surge multiplier is &gt; 1.0</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Right: Code editor view & Response JSON */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Code Snippets Editor */}
              <div className="rounded-2xl border border-white/10 bg-[#161616] overflow-hidden shadow-2xl flex flex-col h-[360px]">
                
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#1a1a1a] border-b border-white/5">
                  <div className="flex gap-2">
                    {['js', 'python', 'curl'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer
                          ${activeTab === tab
                            ? 'bg-[#1DB954] text-black shadow-lg shadow-[#1DB954]/20'
                            : 'text-zinc-400 hover:text-white hover:bg-white/5'
                          }
                        `}
                      >
                        {tab === 'js' ? 'JavaScript' : tab}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => copyToClipboard(codeSnippets[activeTab])}
                    className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-zinc-400 hover:text-[#1DB954] transition-all cursor-pointer"
                    title="Copy Code"
                  >
                    {copiedText ? <span className="text-[10px] font-bold text-[#1DB954]">Copied!</span> : <Copy size={13} />}
                  </button>
                </div>

                <div className="flex-1 p-4 overflow-auto font-mono text-[11px] leading-relaxed text-[#a5d6ff] bg-[#0c0c0c] select-text">
                  <pre className="whitespace-pre">{codeSnippets[activeTab]}</pre>
                </div>

              </div>

              {/* Expected JSON Response */}
              <div className="rounded-2xl border border-white/10 bg-[#161616] overflow-hidden shadow-2xl">
                
                <div className="px-4 py-2.5 bg-[#1a1a1a] border-b border-white/5 flex items-center gap-2">
                  <Code2 size={13} className="text-[#00f3ff]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Response JSON (200 OK)</span>
                </div>

                <div className="p-4 font-mono text-[11px] leading-relaxed text-[#79c0ff] bg-[#0c0c0c] select-text">
                  <pre>{`{
  "status": "success",
  "predicted_surge": 1.45,
  "base_fare": 30.0,
  "rate_per_km": 13.0,
  "distance_km": 8.5,
  "estimated_fare": 203.73,
  "surge_active": true
}`}</pre>
                </div>

              </div>

              {/* Status alerts */}
              <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/[0.03] flex items-start gap-3">
                <AlertTriangle size={16} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-xs font-bold text-yellow-500">Cross-Origin Resource Sharing (CORS)</span>
                  <p className="text-[10px] text-zinc-400 mt-0.5 leading-relaxed">
                    The Flask backend enables CORS for local servers on ports 5173 and 5174. If calling the API from a custom domain, ensure your domain is whitelisted in CORS headers within backend/app.py.
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
