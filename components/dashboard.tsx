"use client";

import { useMemo, useState } from "react";
import {
  BarChart3, Bell, Bot, Building2, ChevronDown, CircleDollarSign, Home,
  Lightbulb, MessageSquareText, MoreVertical, RefreshCw, Send, Settings,
  Sparkles, Star, X, TrendingUp, Clock3, CircleCheck, Menu
} from "lucide-react";
import {
  CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis
} from "recharts";

type Review = {
  id: number;
  name: string;
  initials: string;
  rating: number;
  time: string;
  text: string;
  status: "Répondu" | "En attente";
  tags: string[];
  sentiment: "Positif" | "Négatif" | "Mitigé";
};

const reviews: Review[] = [
  { id: 1, name: "Sophie L.", initials: "SL", rating: 5, time: "Il y a 2 heures", text: "Excellent repas, service au top et cadre très agréable. Nous reviendrons avec plaisir !", status: "Répondu", tags: ["Repas", "Service", "Cadre"], sentiment: "Positif" },
  { id: 2, name: "Julien D.", initials: "JD", rating: 2, time: "Il y a 5 heures", text: "Bon restaurant mais l’attente était un peu longue malgré la réservation.", status: "En attente", tags: ["Attente", "Service", "Réservation"], sentiment: "Négatif" },
  { id: 3, name: "Claire M.", initials: "CM", rating: 1, time: "Il y a 1 jour", text: "Déçue par la qualité des plats. Le prix est trop élevé pour ce que c’est.", status: "En attente", tags: ["Qualité", "Prix", "Plats"], sentiment: "Négatif" },
];

const lineData = [
  { day: "12 mai", note: 4.0 }, { day: "13 mai", note: 4.2 }, { day: "14 mai", note: 4.15 },
  { day: "15 mai", note: 4.4 }, { day: "16 mai", note: 4.45 }, { day: "17 mai", note: 4.48 }, { day: "18 mai", note: 4.65 },
];
const pieData = [
  { name: "5 étoiles", value: 65 }, { name: "4 étoiles", value: 20 }, { name: "3 étoiles", value: 8 },
  { name: "2 étoiles", value: 4 }, { name: "1 étoile", value: 3 },
];
const pieColors = ["#22c55e", "#86d36d", "#facc15", "#fb923c", "#ef4444"];

function Stars({ rating }: { rating: number }) {
  return <div className="flex gap-0.5">{[1,2,3,4,5].map((n) => <Star key={n} size={17} className={n <= rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"} />)}</div>;
}

function StatCard({ title, value, note, icon }: { title: string; value: string; note: string; icon: React.ReactNode }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-4 flex items-center justify-between text-sm font-semibold text-slate-700"><span>{title}</span><span className="rounded-xl bg-indigo-50 p-2 text-indigo-600">{icon}</span></div>
    <div className="text-4xl font-bold tracking-tight">{value}</div>
    <div className="mt-3 text-xs text-emerald-600">{note}</div>
  </div>;
}

export function Dashboard() {
  const [selected, setSelected] = useState<Review>(reviews[1]);
  const [tone, setTone] = useState("Chaleureux");
  const [published, setPublished] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const response = useMemo(() => {
    if (selected.rating <= 2) return `Bonjour ${selected.name.split(" ")[0]},\n\nMerci d’avoir pris le temps de partager votre avis. Nous sommes désolés que votre expérience n’ait pas pleinement répondu à vos attentes. Votre remarque concernant ${selected.tags[0].toLowerCase()} a bien été prise en compte et nous aide à améliorer notre service.\n\nNous espérons avoir l’occasion de vous accueillir de nouveau et de vous offrir une meilleure expérience.\n\nL’équipe du Bistrot Parisien`;
    return `Bonjour ${selected.name.split(" ")[0]},\n\nMerci beaucoup pour votre message. Nous sommes ravis que vous ayez apprécié votre expérience chez nous. Vos encouragements font très plaisir à toute l’équipe.\n\nAu plaisir de vous accueillir à nouveau !\n\nL’équipe du Bistrot Parisien`;
  }, [selected]);

  const menu = [
    [Home, "Tableau de bord"], [MessageSquareText, "Avis"], [Bot, "Réponses"], [BarChart3, "Statistiques"],
    [Sparkles, "Analyse IA"], [Lightbulb, "Conseils"], [Settings, "Paramètres"], [CircleDollarSign, "Facturation"],
  ] as const;

  return <main className="min-h-screen bg-[#f5f8fd] lg:flex">
    <button onClick={() => setMobileMenu(!mobileMenu)} className="fixed left-4 top-4 z-50 rounded-xl bg-[#08234d] p-3 text-white shadow-lg lg:hidden"><Menu size={20}/></button>
    <aside className={`${mobileMenu ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-gradient-to-b from-[#092757] to-[#04162f] p-5 text-white transition-transform lg:static lg:translate-x-0`}>
      <div className="mb-8 flex items-center gap-3 text-2xl font-bold"><div className="rounded-full bg-indigo-500/20 p-2"><Bot className="text-indigo-300" /></div>EchoPilot</div>
      <nav className="space-y-2">{menu.map(([Icon, label], i) => <button key={label} className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${i===0 ? "bg-indigo-500 shadow-lg" : "text-slate-200 hover:bg-white/10"}`}><Icon size={19}/>{label}{label==="Avis" && <span className="ml-auto rounded-full bg-white/15 px-2 py-0.5 text-xs">12</span>}</button>)}</nav>
      <div className="mt-auto space-y-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-full bg-indigo-500 font-bold">R</div><div><div className="text-sm font-semibold">Le Bistrot Parisien</div><div className="text-xs text-slate-300">1 établissement</div></div><ChevronDown size={16} className="ml-auto"/></div></div>
        <div className="flex items-center gap-3 border-t border-white/10 pt-4"><div className="grid h-10 w-10 place-items-center rounded-full bg-amber-100 font-bold text-amber-800">TM</div><div><div className="text-sm font-semibold">Thomas Martin</div><div className="text-xs text-slate-300">Propriétaire</div></div></div>
      </div>
    </aside>

    <section className="min-w-0 flex-1 p-4 pt-20 lg:p-8">
      <header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h1 className="text-3xl font-bold">Bonjour Thomas 👋</h1><p className="mt-2 text-slate-500">Voici un aperçu de la réputation de votre établissement.</p></div><div className="flex gap-2"><button className="rounded-xl border bg-white p-3 text-slate-600"><Bell size={20}/></button><button className="flex items-center gap-2 rounded-xl border bg-white px-4 py-3 text-sm font-semibold"><Clock3 size={18}/>7 derniers jours<ChevronDown size={16}/></button></div></header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Note moyenne" value="4,6 ★" note="↑ 0,2 vs la période précédente" icon={<Star size={19}/>} />
        <StatCard title="Avis reçus" value="18" note="↑ 3 vs la période précédente" icon={<MessageSquareText size={19}/>} />
        <StatCard title="Avis en attente" value="12" note="Dont 4 avis négatifs" icon={<Clock3 size={19}/>} />
        <StatCard title="Taux de réponse" value="92%" note="Excellent !" icon={<CircleCheck size={19}/>} />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.8fr_1fr]">
        <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="mb-5 flex items-center justify-between"><h2 className="font-bold">Évolution de la note</h2><span className="text-xs text-slate-500">7 derniers jours</span></div><div className="h-64"><ResponsiveContainer width="100%" height="100%"><LineChart data={lineData}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="day" tick={{fontSize:12}}/><YAxis domain={[3.5,5]} tick={{fontSize:12}}/><Tooltip/><Line type="monotone" dataKey="note" stroke="#4f5df5" strokeWidth={3} dot={{r:4}}/></LineChart></ResponsiveContainer></div></div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm"><h2 className="mb-3 font-bold">Répartition des avis</h2><div className="h-52"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={pieData} dataKey="value" innerRadius={48} outerRadius={78}>{pieData.map((_, i)=><Cell key={i} fill={pieColors[i]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer></div><div className="grid grid-cols-2 gap-2 text-xs">{pieData.map((d,i)=><div key={d.name} className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{background:pieColors[i]}}/><span>{d.name}</span><b className="ml-auto">{d.value}%</b></div>)}</div></div>
      </div>

      <div className="mt-5 rounded-2xl border bg-white shadow-sm"><div className="flex items-center justify-between border-b p-5"><h2 className="font-bold">Avis récents</h2><button className="text-sm font-semibold text-indigo-600">Voir tous les avis →</button></div>{reviews.map(r=><button onClick={()=>{setSelected(r);setPublished(false)}} key={r.id} className={`flex w-full flex-col gap-3 border-b p-5 text-left last:border-0 hover:bg-slate-50 md:flex-row md:items-center ${selected.id===r.id?"bg-indigo-50/60":""}`}><div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-100 to-amber-100 text-xs font-bold">{r.initials}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-3"><b>{r.name}</b><Stars rating={r.rating}/><span className="text-xs text-slate-500">{r.time}</span></div><p className="mt-1 truncate text-sm text-slate-600">{r.text}</p></div><span className={`rounded-full px-3 py-1 text-xs font-semibold ${r.status==="Répondu"?"bg-emerald-100 text-emerald-700":"bg-orange-100 text-orange-700"}`}>{r.status}</span><MoreVertical size={18} className="text-slate-400"/></button>)}</div>
    </section>

    <aside className="w-full border-l bg-white p-5 lg:w-[390px]">
      <div className="flex items-center justify-between border-b pb-4"><h2 className="font-bold">Avis sélectionné</h2><X size={20} className="text-slate-500"/></div>
      <div className="py-5"><div className="flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-indigo-100 to-amber-100 font-bold">{selected.initials}</div><div><b>{selected.name}</b><Stars rating={selected.rating}/></div><span className="ml-auto text-xs text-slate-500">{selected.time}</span></div><p className="mt-4 text-sm leading-6 text-slate-700">{selected.text}</p></div>
      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4"><div className="mb-3 flex items-center gap-2 font-semibold text-indigo-700"><Sparkles size={18}/>Analyse IA</div><div className="flex flex-wrap gap-2">{selected.tags.map(t=><span key={t} className="rounded-full bg-white px-3 py-1 text-xs text-indigo-700">{t}</span>)}</div><div className="mt-3 text-xs text-slate-600">Sentiment global : <b className={selected.sentiment==="Positif"?"text-emerald-600":"text-red-600"}>{selected.sentiment}</b></div></div>
      <div className="mt-6"><h3 className="mb-3 font-bold">Générer une réponse</h3><label className="text-xs font-semibold text-slate-500">Ton de la réponse</label><select value={tone} onChange={e=>setTone(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm"><option>Chaleureux</option><option>Professionnel</option><option>Premium</option><option>Dynamique</option></select><textarea key={selected.id} defaultValue={response} className="mt-3 h-72 w-full resize-none rounded-xl border border-slate-200 p-4 text-sm leading-6 outline-none focus:border-indigo-500"/></div>
      <div className="mt-4 flex gap-3"><button onClick={()=>setPublished(false)} className="flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold"><RefreshCw size={17}/>Régénérer</button><button onClick={()=>setPublished(true)} className="flex flex-[1.4] items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200"><Send size={17}/>{published?"Réponse publiée":"Publier la réponse"}</button></div>
      {published && <div className="mt-3 rounded-xl bg-emerald-50 p-3 text-center text-sm font-semibold text-emerald-700">✓ Simulation réussie : la réponse est marquée comme publiée.</div>}
      <div className="mt-6 rounded-2xl bg-slate-50 p-4"><div className="flex items-center gap-2 font-semibold"><TrendingUp size={18} className="text-indigo-600"/>Conseil du jour</div><p className="mt-2 text-xs leading-5 text-slate-600">Répondez aux avis négatifs en moins de 24 heures pour montrer que vous prenez chaque retour au sérieux.</p></div>
    </aside>
  </main>;
}
