import React, { useState, useEffect } from "react";
import { 
  Shield, 
  Search, 
  Phone, 
  Mail, 
  Globe, 
  History, 
  Settings, 
  User, 
  MapPin, 
  Cpu, 
  Wifi, 
  Database,
  ChevronRight,
  Activity,
  Terminal,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ToolType = "dashboard" | "phone" | "email" | "ip" | "history" | "social" | "network" | "satellite";

export default function App() {
  const [activeTool, setActiveTool] = useState<ToolType>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <AuthView onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-200 font-sans selection:bg-emerald-500/30">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-0 h-full bg-[#111113] border-r border-white/5 transition-all duration-300 z-50",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            <Shield className="w-5 h-5 text-black" />
          </div>
          {isSidebarOpen && (
            <span className="font-bold text-lg tracking-tight text-white">NEXUS <span className="text-emerald-500">OSINT</span></span>
          )}
        </div>

        <nav className="p-4 space-y-2">
          <NavItem 
            icon={<Activity className="w-5 h-5" />} 
            label="Dashboard" 
            active={activeTool === "dashboard"} 
            onClick={() => setActiveTool("dashboard")}
            collapsed={!isSidebarOpen}
          />
          <div className="pt-4 pb-2 px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            {isSidebarOpen ? "Intelligence Modules" : "•••"}
          </div>
          <NavItem 
            icon={<Phone className="w-5 h-5" />} 
            label="Phone Lookup" 
            active={activeTool === "phone"} 
            onClick={() => setActiveTool("phone")}
            collapsed={!isSidebarOpen}
          />
          <NavItem 
            icon={<Mail className="w-5 h-5" />} 
            label="Email Trace" 
            active={activeTool === "email"} 
            onClick={() => setActiveTool("email")}
            collapsed={!isSidebarOpen}
          />
          <NavItem 
            icon={<Globe className="w-5 h-5" />} 
            label="IP / Geo Recon" 
            active={activeTool === "ip"} 
            onClick={() => setActiveTool("ip")}
            collapsed={!isSidebarOpen}
          />
          <NavItem 
            icon={<MapPin className="w-5 h-5" />} 
            label="Satellite Recon" 
            active={activeTool === "satellite"} 
            onClick={() => setActiveTool("satellite")}
            collapsed={!isSidebarOpen}
          />
          <NavItem 
            icon={<User className="w-5 h-5" />} 
            label="Social Search" 
            active={activeTool === "social"} 
            onClick={() => setActiveTool("social")}
            collapsed={!isSidebarOpen}
          />
          <NavItem 
            icon={<Wifi className="w-5 h-5" />} 
            label="Network / MAC" 
            active={activeTool === "network"} 
            onClick={() => setActiveTool("network")}
            collapsed={!isSidebarOpen}
          />
          
          <div className="pt-4 pb-2 px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            {isSidebarOpen ? "System" : "•••"}
          </div>
          <NavItem 
            icon={<History className="w-5 h-5" />} 
            label="Search History" 
            active={activeTool === "history"} 
            onClick={() => setActiveTool("history")}
            collapsed={!isSidebarOpen}
          />
          <NavItem 
            icon={<Settings className="w-5 h-5" />} 
            label="Settings" 
            active={activeTool === "dashboard"} 
            onClick={() => {}}
            collapsed={!isSidebarOpen}
          />
        </nav>

        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute bottom-6 right-[-12px] w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-black shadow-lg hover:scale-110 transition-transform"
        >
          <ChevronRight className={cn("w-4 h-4 transition-transform", isSidebarOpen && "rotate-180")} />
        </button>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "transition-all duration-300 min-h-screen p-8",
        isSidebarOpen ? "ml-64" : "ml-20"
      )}>
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight capitalize">
              {activeTool.replace("-", " ")}
            </h1>
            <p className="text-slate-400 mt-1">
              {getToolDescription(activeTool)}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-medium flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              System Online
            </div>
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <User className="w-5 h-5 text-slate-400" />
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTool}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderTool(activeTool)}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, onClick, collapsed }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void, collapsed: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative",
        active 
          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
          : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"
      )}
    >
      <div className={cn("transition-transform group-hover:scale-110", active && "text-emerald-500")}>
        {icon}
      </div>
      {!collapsed && <span className="font-medium text-sm">{label}</span>}
      {collapsed && (
        <div className="absolute left-full ml-4 px-2 py-1 bg-black border border-white/10 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
          {label}
        </div>
      )}
    </button>
  );
}

function getToolDescription(tool: ToolType) {
  switch (tool) {
    case "dashboard": return "System overview and intelligence summary.";
    case "phone": return "Advanced reverse phone lookup and carrier identification.";
    case "email": return "Trace email origin, validity, and linked accounts.";
    case "ip": return "Geolocation and network infrastructure analysis.";
    case "satellite": return "High-resolution multispectral satellite imagery analysis.";
    case "social": return "Scan social media platforms for usernames and profiles.";
    case "network": return "BSSID, MAC, and IMEI device tracking.";
    case "history": return "Review previous intelligence gathering sessions.";
    default: return "";
  }
}

function renderTool(tool: ToolType) {
  switch (tool) {
    case "dashboard": return <DashboardView />;
    case "phone": return <PhoneLookupView />;
    case "email": return <EmailLookupView />;
    case "ip": return <IPLookupView />;
    case "social": return <SocialSearchView />;
    case "network": return <NetworkLookupView />;
    case "satellite": return <SatelliteReconView />;
    case "history": return <HistoryView />;
    default: return <PlaceholderView tool={tool} />;
  }
}

function AuthView({ onLogin }: { onLogin: () => void }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-[#111113] border border-white/5 rounded-3xl p-8 shadow-2xl"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            <Shield className="w-7 h-7 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">NEXUS <span className="text-emerald-500">OSINT</span></h1>
          <p className="text-slate-500 text-sm mt-1">Advanced Intelligence Suite</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email" 
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              placeholder="operator@nexus.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Access Key</label>
            <input 
              type="password" 
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            onClick={onLogin}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98]"
          >
            {isRegister ? "Initialize Account" : "Access Terminal"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsRegister(!isRegister)}
            className="text-slate-500 hover:text-emerald-500 text-xs transition-colors"
          >
            {isRegister ? "Already have an access key? Login" : "Request new operator access"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function SatelliteReconView() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const handleScan = () => {
    setLoading(true);
    setImage(null);
    setTimeout(() => {
      setImage(`https://picsum.photos/seed/${query || "satellite"}/1200/800?blur=1`);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="max-w-5xl space-y-6">
      <div className="bg-[#111113] border border-white/5 rounded-2xl p-8">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Enter coordinates or location name"
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={handleScan}
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black font-bold px-8 rounded-xl transition-all flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Globe className="w-5 h-5" />}
            Satellite Scan
          </button>
        </div>
      </div>

      {loading && (
        <div className="bg-[#111113] border border-white/5 rounded-2xl p-24 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-500 mx-auto mb-4" />
          <p className="text-slate-400 font-mono text-sm animate-pulse">Establishing satellite uplink... Synchronizing orbits...</p>
        </div>
      )}

      {image && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
        >
          <img src={image} alt="Satellite Recon" className="w-full aspect-video object-cover grayscale brightness-75 contrast-125" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute top-6 left-6 flex flex-col gap-2">
            <div className="bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded text-[10px] font-mono text-emerald-500 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              LIVE FEED: SAT-092
            </div>
            <div className="bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded text-[10px] font-mono text-white">
              COORD: {Math.random().toFixed(4)}, {Math.random().toFixed(4)}
            </div>
          </div>
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
            <div>
              <h4 className="text-white font-bold text-xl uppercase tracking-widest">{query || "Target Area"}</h4>
              <p className="text-slate-400 text-xs font-mono">Multispectral Analysis Active</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 rounded bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-colors">
                <Search className="w-4 h-4" />
              </button>
              <button className="p-2 rounded bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-colors">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Scanline effect */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
        </motion.div>
      )}
    </div>
  );
}

function SocialSearchView() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const resp = await axios.post("/api/lookup/social", { username });
      setResults(resp.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="bg-[#111113] border border-white/5 rounded-2xl p-8">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Enter username (e.g. johndoe)"
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black font-bold px-8 rounded-xl transition-all flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            Scan
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((res, i) => (
            <div key={i} className="bg-[#111113] border border-white/5 rounded-xl p-4 flex items-center justify-between group hover:border-emerald-500/30 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white capitalize">{res.platform}</div>
                  <div className="text-[10px] text-slate-500">Potential Match</div>
                </div>
              </div>
              <a href={res.url} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white">
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NetworkLookupView() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleLookup = async () => {
    setLoading(true);
    try {
      const resp = await axios.post("/api/lookup/mac", { mac: query });
      setResult(resp.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="bg-[#111113] border border-white/5 rounded-2xl p-8">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Wifi className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Enter MAC address (e.g. 00:11:22:33:44:55)"
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={handleLookup}
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black font-bold px-8 rounded-xl transition-all flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            Identify
          </button>
        </div>
      </div>

      {result && (
        <ResultCard title="MAC Vendor Intelligence" data={result.vendor} />
      )}
    </div>
  );
}

function DorkingSection({ query, type }: { query: string, type: "email" | "phone" }) {
  const [dorks, setDorks] = useState<string[]>([]);

  useEffect(() => {
    axios.post("/api/tools/dork", { query, type }).then(res => setDorks(res.data.dorks));
  }, [query, type]);

  return (
    <div className="md:col-span-2 bg-[#111113] border border-white/5 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Terminal className="w-5 h-5 text-emerald-500" />
        Google Dorking Intelligence
      </h3>
      <div className="space-y-2">
        {dorks.map((dork, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/5 hover:border-emerald-500/30 transition-all group">
            <code className="text-xs text-slate-400 group-hover:text-emerald-500 transition-colors">{dork}</code>
            <a 
              href={`https://www.google.com/search?q=${encodeURIComponent(dork)}`} 
              target="_blank" 
              rel="noreferrer"
              className="text-slate-500 hover:text-white"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard title="Total Lookups" value="1,284" icon={<Search className="w-5 h-5" />} trend="+12% this week" />
      <StatCard title="Active APIs" value="32" icon={<Cpu className="w-5 h-5" />} trend="All systems operational" color="emerald" />
      <StatCard title="Threat Alerts" value="0" icon={<Shield className="w-5 h-5" />} trend="No active threats" />
      
      <div className="md:col-span-2 bg-[#111113] border border-white/5 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-emerald-500" />
          System Feed
        </h3>
        <div className="space-y-4 font-mono text-xs">
          <FeedItem time="13:58:32" msg="Initializing OSINT core modules..." status="ok" />
          <FeedItem time="13:58:35" msg="Connecting to NumLookup API gateway" status="ok" />
          <FeedItem time="13:58:38" msg="Verifying Abstract API credentials" status="ok" />
          <FeedItem time="14:00:01" msg="System ready. Awaiting user input." status="ready" />
        </div>
      </div>

      <div className="bg-[#111113] border border-white/5 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-500" />
          Recent Targets
        </h3>
        <div className="space-y-3">
          <TargetItem label="+1 (555) 012-3456" sub="Phone Lookup • USA" />
          <TargetItem label="admin@example.com" sub="Email Trace • Verified" />
          <TargetItem label="192.168.1.1" sub="IP Recon • Local" />
        </div>
      </div>
    </div>
  );
}

function PhoneLookupView() {
  const [number, setNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleLookup = async () => {
    setLoading(true);
    try {
      const resp = await axios.post("/api/lookup/phone", { number });
      setResult(resp.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="bg-[#111113] border border-white/5 rounded-2xl p-8">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Enter phone number (e.g. +1234567890)"
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
          </div>
          <button 
            onClick={handleLookup}
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black font-bold px-8 rounded-xl transition-all flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            Analyze
          </button>
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ResultCard title="Carrier Information" data={result.numlookup || result.veriphone} />
          <ResultCard title="Validation Details" data={result.abstract} />
          <DorkingSection query={number} type="phone" />
          {result.numlookup?.location && (
            <div className="md:col-span-2 bg-[#111113] border border-white/5 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Geolocation Data</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <DataPoint label="Country" value={result.numlookup.country_name} />
                <DataPoint label="City" value={result.numlookup.location} />
                <DataPoint label="Timezone" value={result.numlookup.timezones?.[0]} />
                <DataPoint label="Prefix" value={result.numlookup.prefix} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EmailLookupView() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleLookup = async () => {
    setLoading(true);
    try {
      const resp = await axios.post("/api/lookup/email", { email });
      setResult(resp.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="bg-[#111113] border border-white/5 rounded-2xl p-8">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="email" 
              placeholder="Enter email address"
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button 
            onClick={handleLookup}
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black font-bold px-8 rounded-xl transition-all flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            Trace
          </button>
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ResultCard title="Verification Status" data={result.hunter?.data || result.abstract} />
          <ResultCard title="Domain Intelligence" data={result.abstract?.domain_details} />
          <DorkingSection query={email} type="email" />
        </div>
      )}
    </div>
  );
}

function IPLookupView() {
  const [ip, setIp] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleLookup = async () => {
    setLoading(true);
    try {
      const resp = await axios.post("/api/lookup/ip", { ip });
      setResult(resp.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="bg-[#111113] border border-white/5 rounded-2xl p-8">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Enter IP address"
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
            />
          </div>
          <button 
            onClick={handleLookup}
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black font-bold px-8 rounded-xl transition-all flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            Locate
          </button>
        </div>
      </div>

      {result?.geo && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DataPointCard label="City" value={result.geo.city} icon={<MapPin className="w-4 h-4" />} />
            <DataPointCard label="ISP" value={result.geo.isp} icon={<Wifi className="w-4 h-4" />} />
            <DataPointCard label="Organization" value={result.geo.organization} icon={<Database className="w-4 h-4" />} />
          </div>
          
          <div className="bg-[#111113] border border-white/5 rounded-2xl p-6 h-96 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[url('https://picsum.photos/seed/map/1200/800')] bg-cover bg-center grayscale" />
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4 border border-emerald-500/40">
                <MapPin className="w-8 h-8 text-emerald-500 animate-bounce" />
              </div>
              <h4 className="text-xl font-bold text-white">{result.geo.latitude}, {result.geo.longitude}</h4>
              <p className="text-slate-400 mt-2">Coordinates mapped to {result.geo.city}, {result.geo.country_name}</p>
              <a 
                href={`https://www.google.com/maps?q=${result.geo.latitude},${result.geo.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-emerald-500 hover:underline text-sm font-medium"
              >
                View on Google Maps <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HistoryView() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/history").then(res => {
      setHistory(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>;

  return (
    <div className="bg-[#111113] border border-white/5 rounded-2xl overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-white/5 border-b border-white/5">
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Type</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Query</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Timestamp</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {history.map((item) => (
            <tr key={item.id} className="hover:bg-white/5 transition-colors group">
              <td className="px-6 py-4">
                <span className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                  item.type === "phone" ? "bg-blue-500/10 text-blue-500" :
                  item.type === "email" ? "bg-purple-500/10 text-purple-500" :
                  "bg-emerald-500/10 text-emerald-500"
                )}>
                  {item.type}
                </span>
              </td>
              <td className="px-6 py-4 font-mono text-sm text-white">{item.query}</td>
              <td className="px-6 py-4 text-sm text-slate-400">{new Date(item.timestamp).toLocaleString()}</td>
              <td className="px-6 py-4 text-right">
                <button className="text-slate-500 hover:text-white transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PlaceholderView({ tool }: { tool: string }) {
  return (
    <div className="bg-[#111113] border border-white/5 rounded-2xl p-12 text-center">
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
        <AlertCircle className="w-8 h-8 text-slate-500" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Module Under Development</h3>
      <p className="text-slate-400 max-w-md mx-auto">
        The {tool} intelligence module is currently being integrated into the Nexus OSINT suite. Check back soon for updates.
      </p>
    </div>
  );
}

function StatCard({ title, value, icon, trend, color = "white" }: any) {
  return (
    <div className="bg-[#111113] border border-white/5 rounded-2xl p-6 hover:border-emerald-500/30 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", color === "emerald" ? "bg-emerald-500/10 text-emerald-500" : "bg-white/5 text-slate-400")}>
          {icon}
        </div>
      </div>
      <h4 className="text-slate-400 text-sm font-medium">{title}</h4>
      <div className="text-2xl font-bold text-white mt-1">{value}</div>
      <div className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
        {trend.includes("+") ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Activity className="w-3 h-3" />}
        {trend}
      </div>
    </div>
  );
}

function FeedItem({ time, msg, status }: any) {
  return (
    <div className="flex gap-3 items-start">
      <span className="text-slate-600">[{time}]</span>
      <span className={cn(
        status === "ok" ? "text-slate-300" : "text-emerald-500 font-bold"
      )}>{msg}</span>
    </div>
  );
}

function TargetItem({ label, sub }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer group">
      <div>
        <div className="text-sm font-bold text-white group-hover:text-emerald-500 transition-colors">{label}</div>
        <div className="text-[10px] text-slate-500">{sub}</div>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
    </div>
  );
}

function ResultCard({ title, data }: any) {
  if (!data) return null;
  return (
    <div className="bg-[#111113] border border-white/5 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white mb-4 border-b border-white/5 pb-2">{title}</h3>
      <div className="space-y-2">
        {Object.entries(data).map(([key, val]: any) => {
          if (typeof val === "object" && val !== null) return null;
          return (
            <div key={key} className="flex justify-between text-sm">
              <span className="text-slate-500 capitalize">{key.replace(/_/g, " ")}</span>
              <span className="text-slate-200 font-mono">{String(val)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DataPoint({ label, value }: any) {
  return (
    <div>
      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</div>
      <div className="text-sm text-white font-medium">{value || "N/A"}</div>
    </div>
  );
}

function DataPointCard({ label, value, icon }: any) {
  return (
    <div className="bg-white/5 border border-white/5 rounded-xl p-4">
      <div className="flex items-center gap-2 text-slate-500 mb-1">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-sm text-white font-bold truncate">{value || "Unknown"}</div>
    </div>
  );
}
