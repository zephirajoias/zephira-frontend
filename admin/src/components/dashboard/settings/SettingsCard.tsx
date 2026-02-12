// components/dashboard/settings/SettingsCard.tsx
import { cn } from "@/lib/utils";
import Link from "next/link";

interface SettingsCardProps {
  title: string;
  description: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  primaryAction: string;
  primaryHref: string;
  badgeText?: string;
  secondaryAction?: string;
}

export function SettingsCard({
  title,
  description,
  icon,
  iconBg,
  iconColor,
  primaryAction,
  primaryHref,
  badgeText,
}: SettingsCardProps) {
  return (
    <div className="group bg-white dark:bg-[#102220] p-6 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[220px]">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div
            className={cn(
              "size-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300",
              iconBg,
            )}
          >
            <span
              className={cn("material-symbols-outlined text-2xl", iconColor)}
            >
              {icon}
            </span>
          </div>
          {badgeText && (
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              {badgeText}
            </span>
          )}
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-50 dark:border-white/5">
        <Link
          href={primaryHref}
          className="flex items-center gap-2 text-sm font-black text-[#11d4c4] hover:gap-3 transition-all"
        >
          {primaryAction}
          <span className="material-symbols-outlined text-base">
            arrow_forward
          </span>
        </Link>
      </div>
    </div>
  );
}
