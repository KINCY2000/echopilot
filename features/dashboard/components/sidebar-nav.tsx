import {
  BarChart3,
  Bot,
  ChevronDown,
  CircleDollarSign,
  Home,
  Lightbulb,
  type LucideIcon,
  MessageSquareText,
  Settings,
  Sparkles,
} from "lucide-react";

type MenuItem = {
  icon: LucideIcon;
  label: string;
  badge?: number;
};

const MENU_ITEMS: MenuItem[] = [
  { icon: Home, label: "Tableau de bord" },
  { icon: MessageSquareText, label: "Avis", badge: 12 },
  { icon: Bot, label: "Réponses" },
  { icon: BarChart3, label: "Statistiques" },
  { icon: Sparkles, label: "Analyse IA" },
  { icon: Lightbulb, label: "Conseils" },
  { icon: Settings, label: "Paramètres" },
  { icon: CircleDollarSign, label: "Facturation" },
];

/**
 * Navigation content shared between the desktop sidebar and the mobile
 * sheet. Purely presentational — routing wired up in Module 3 (Auth) once
 * real pages exist for each section.
 */
export function SidebarNav() {
  return (
    <div className="flex h-full flex-col p-5 text-white">
      <div className="mb-8 flex items-center gap-3 text-2xl font-bold">
        <div className="rounded-full bg-indigo-500/20 p-2">
          <Bot className="text-indigo-300" />
        </div>
        EchoPilot
      </div>

      <nav className="space-y-2">
        {MENU_ITEMS.map(({ icon: Icon, label, badge }, i) => (
          <button
            key={label}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${
              i === 0 ? "bg-indigo-500 shadow-lg" : "text-slate-200 hover:bg-white/10"
            }`}
          >
            <Icon size={19} />
            {label}
            {badge !== undefined && (
              <span className="ml-auto rounded-full bg-white/15 px-2 py-0.5 text-xs">{badge}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-full bg-indigo-500 font-bold">R</div>
            <div>
              <div className="text-sm font-semibold">Le Bistrot Parisien</div>
              <div className="text-xs text-slate-300">1 établissement</div>
            </div>
            <ChevronDown size={16} className="ml-auto" />
          </div>
        </div>
        <div className="flex items-center gap-3 border-t border-white/10 pt-4">
          <div className="grid size-10 place-items-center rounded-full bg-amber-100 font-bold text-amber-800">
            TM
          </div>
          <div>
            <div className="text-sm font-semibold">Thomas Martin</div>
            <div className="text-xs text-slate-300">Propriétaire</div>
          </div>
        </div>
      </div>
    </div>
  );
}
