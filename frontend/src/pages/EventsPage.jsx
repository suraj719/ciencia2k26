import { useState, useMemo, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, MapPin, Users, Trophy, Calendar, ExternalLink, Zap, Code, Smile, CheckCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { technicalEvents, nonTechnicalEvents, specialEvents, featuredCategoryEvents } from "../constants/eventsData";
import { AuthContext } from "../context/AuthContext";

const TABS = [
    { key: "featured", label: "Featured Events", icon: Trophy, color: "amber", events: featuredCategoryEvents },
    { key: "technical", label: "Technical", icon: Code, color: "indigo", events: technicalEvents },
    { key: "nontechnical", label: "Non-Technical", icon: Smile, color: "rose", events: nonTechnicalEvents },
    { key: "special", label: "Special", icon: Zap, color: "amber", events: specialEvents },
];

const TAB_STYLES = {
    indigo: { active: "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30", dot: "bg-indigo-400", badge: "bg-indigo-600 text-white border-transparent shadow-sm", glow: "hover:border-indigo-500/50 hover:shadow-indigo-500/10" },
    rose: { active: "bg-rose-600 text-white shadow-lg shadow-rose-500/30", dot: "bg-rose-400", badge: "bg-rose-600 text-white border-transparent shadow-sm", glow: "hover:border-rose-500/50 hover:shadow-rose-500/10" },
    amber: { active: "bg-amber-500 text-black shadow-lg shadow-amber-500/30", dot: "bg-amber-400", badge: "bg-amber-500 text-black border-transparent shadow-sm", glow: "hover:border-amber-500/50 hover:shadow-amber-500/10" },
};

const getDepts = (events) => [...new Set(events.map(e => e.dept).filter(Boolean))].sort();

const EventCard = ({ event, tabColor, isRegistered }) => {
    const styles = TAB_STYLES[tabColor];
    const hasRegister = event.registrationRequired;
    const hasPrize = event.prizes?.length > 0;
    const hasBudget = event.budget > 0;

    return (
        <div className={`group relative bg-slate-900/60 border border-white/8 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:border-white/20 hover:shadow-xl hover:-translate-y-1 ${styles.glow}`}>
            {/* Image */}
            <div className="relative h-44 overflow-hidden">
                <img
                    src={event.image || "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80"}
                    alt={event.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80"; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

                {/* Dept badge */}
                {event.dept && (
                    <span className={`absolute top-3 left-3 text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${styles.badge}`}>
                        {event.dept}
                    </span>
                )}
                {/* Featured badge */}
                {event.featured && (
                    <span className="absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full bg-amber-400 text-black flex items-center gap-1">
                        <Zap size={10} /> Featured
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
                <p className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-1">{event.tagline}</p>
                <h3 className="font-heading text-xl text-white mb-2 group-hover:text-indigo-300 transition-colors leading-tight">
                    {event.name}
                </h3>
                <p className="text-sm text-slate-400 mb-4 line-clamp-2 flex-grow">{event.description}</p>

                {/* Meta info */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {event.teamSize && (
                        <span className="flex items-center gap-1 text-xs text-slate-400 bg-white/5 px-2 py-1 rounded-full">
                            <Users size={11} /> {event.teamSize}
                        </span>
                    )}
                    {event.venue && (
                        <span className="flex items-center gap-1 text-xs text-slate-400 bg-white/5 px-2 py-1 rounded-full">
                            <MapPin size={11} /> {event.venue}
                        </span>
                    )}
                    {event.date && (
                        <span className="flex items-center gap-1 text-xs text-slate-400 bg-white/5 px-2 py-1 rounded-full">
                            <Calendar size={11} /> {event.date}
                        </span>
                    )}
                </div>

                {/* Prizes / Budget */}
                {!(event.category === "Non-Technical" || event.category === "Special") && (hasPrize || hasBudget) && (
                    <div className="flex items-center gap-2 mb-4">
                        <Trophy size={14} className="text-amber-400 flex-shrink-0" />
                        {hasPrize ? (
                            <span className="text-sm text-amber-300 font-semibold">{event.prizes.join(" · ")}</span>
                        ) : (
                            <span className="text-sm text-slate-400">Prize Pool: ₹{(event.budget % 1000 === 500 ? event.budget - 500 : event.budget).toLocaleString()}</span>
                        )}
                    </div>
                )}

                {/* Action button */}
                <div className="mt-auto">
                    {isRegistered ? (
                        <Link
                            to={`/event/${event.id}`}
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400 text-sm font-semibold rounded-xl transition-all duration-200"
                        >
                            <CheckCircle size={16} /> Registered
                        </Link>
                    ) : hasRegister ? (
                        <Link
                            to={`/event/${event.id}`}
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25"
                        >
                            View Details <ExternalLink size={14} />
                        </Link>
                    ) : event.href ? (
                        <a
                            href={event.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-green-500/20 border border-green-500/30 text-green-300 text-sm font-medium rounded-xl hover:bg-green-500/30 transition-all duration-200"
                        >
                            View Location <ExternalLink size={14} />
                        </a>
                    ) : (
                        <div className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white/5 border border-white/10 text-slate-400 text-sm font-medium rounded-xl cursor-default">
                            Open to All — No Registration
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const EventsPage = () => {
    const { token } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState("featured");
    const [search, setSearch] = useState("");
    const [deptFilter, setDeptFilter] = useState("all");
    const [registeredEventIds, setRegisteredEventIds] = useState([]);

    // Fetch user registrations
    useEffect(() => {
        const fetchRegistrations = async () => {
            if (!token) return;
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/registrations/my`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setRegisteredEventIds(data.map(r => r.eventId));
                }
            } catch (err) {
                console.error("Fetch registrations error:", err);
            }
        };
        fetchRegistrations();
    }, [token]);

    const currentTab = TABS.find(t => t.key === activeTab);
    const depts = useMemo(() => getDepts(currentTab.events), [activeTab]);

    const filtered = useMemo(() => {
        return currentTab.events.filter(e => {
            const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.description?.toLowerCase().includes(search.toLowerCase());
            const matchDept = deptFilter === "all" || e.dept === deptFilter;
            return matchSearch && matchDept;
        });
    }, [activeTab, search, deptFilter]);

    const handleTabChange = (key) => {
        setActiveTab(key);
        setDeptFilter("all");
        setSearch("");
    };

    return (
        <div className="min-h-screen bg-[#030712]">
            <Navbar />

            {/* Hero */}
            <div className="relative pt-28 pb-16 bg-pattern-dots border-b-4 border-black overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none" />
                <div className="container mx-auto px-4 text-center relative z-10">
                    <p className="font-mono text-indigo-400 text-sm uppercase tracking-[0.3em] mb-4">Ciencia 2K26 · CVR College</p>
                    <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl text-white drop-shadow-[4px_4px_0_#000] mb-6">
                        ALL <span className="text-[#ec4899]">EVENTS</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-body">
                        {technicalEvents.length + nonTechnicalEvents.length + specialEvents.length}+ events across Technical, Non-Technical & Special categories.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">

                {/* Tabs */}
                <div className="flex flex-wrap gap-3 justify-center mb-10">
                    {TABS.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.key;
                        const styles = TAB_STYLES[tab.color];
                        return (
                            <button
                                key={tab.key}
                                onClick={() => handleTabChange(tab.key)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 border ${isActive
                                    ? `${styles.active} border-transparent`
                                    : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                                    }`}
                            >
                                <Icon size={16} />
                                {tab.label}
                                <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? "bg-white/20" : "bg-white/10 text-slate-400"}`}>
                                    {tab.events.length}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Search + Filter row */}
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                    </div>
                    {depts.length > 1 && (
                        <div className="relative">
                            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <select
                                value={deptFilter}
                                onChange={e => setDeptFilter(e.target.value)}
                                className="pl-8 pr-8 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none cursor-pointer"
                            >
                                <option value="all">All Departments</option>
                                {depts.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                    )}
                </div>

                {/* Results count */}
                <p className="text-slate-500 text-sm mb-6">
                    Showing <span className="text-white font-semibold">{filtered.length}</span> events
                    {deptFilter !== "all" && <> in <span className="text-indigo-400">{deptFilter}</span></>}
                    {search && <> matching "<span className="text-indigo-400">{search}</span>"</>}
                </p>

                {/* Grid */}
                {filtered.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filtered.map(event => (
                            <EventCard key={event.id} event={event} tabColor={currentTab.color} isRegistered={registeredEventIds.includes(event.id)} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-slate-500">
                        <Search size={40} className="mx-auto mb-4 opacity-30" />
                        <p className="text-lg">No events found.</p>
                        <button
                            onClick={() => { setSearch(""); setDeptFilter("all"); }}
                            className="mt-4 text-sm text-indigo-400 hover:text-indigo-300 underline"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default EventsPage;
