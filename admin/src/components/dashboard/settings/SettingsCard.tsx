import Link from "next/link"; // Importar Link

interface SettingsCardProps {
  title: string;
  description: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  badgeText?: string;
  badgeColor?: string;
  primaryAction: string;
  primaryHref?: string; // Nova prop para o link
  secondaryAction?: string;
  secondaryIcon?: string;
}

export function SettingsCard({
  title,
  description,
  icon,
  iconBg,
  iconColor,
  badgeText,
  badgeColor,
  primaryAction,
  primaryHref, // Recebe o link
  secondaryAction,
  secondaryIcon,
}: SettingsCardProps) {
  // Função para renderizar o botão principal (Link ou Button)
  const renderPrimaryButton = () => {
    const className =
      "flex-1 py-2 px-3 rounded-lg bg-[var(--zephira-primary)]/10 text-[var(--zephira-primary)] text-sm font-bold hover:bg-[var(--zephira-primary)] hover:text-white transition-colors text-center";

    if (primaryHref) {
      return (
        <Link href={primaryHref} className={className}>
          {primaryAction}
        </Link>
      );
    }

    return <button className={className}>{primaryAction}</button>;
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-white/5 bg-white dark:bg-[#102220] p-6 hover:shadow-lg hover:border-[var(--zephira-primary)]/50 transition-all group cursor-pointer h-full">
      <div className="flex items-start justify-between">
        <div
          className={`p-3 rounded-lg ${iconBg} ${iconColor} group-hover:bg-[var(--zephira-primary)] group-hover:text-white transition-colors`}
        >
          <span className="material-symbols-outlined text-[28px]">{icon}</span>
        </div>
        {badgeText && (
          <span
            className={`px-2 py-1 rounded-full text-xs font-bold border ${badgeColor}`}
          >
            {badgeText}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2 flex-1">
        <h3 className="text-lg font-bold text-[var(--zephira-text)] dark:text-white group-hover:text-[var(--zephira-primary)] transition-colors">
          {title}
        </h3>
        <p className="text-[var(--zephira-muted)] text-sm leading-relaxed">
          {description}
        </p>
      </div>

      <div className="pt-4 mt-2 border-t border-gray-100 dark:border-white/5 flex gap-2">
        {renderPrimaryButton()}

        {secondaryAction && (
          <button
            className="size-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-white/10 text-[var(--zephira-muted)] hover:text-[var(--zephira-primary)] hover:border-[var(--zephira-primary)] transition-colors"
            title={secondaryAction}
          >
            <span className="material-symbols-outlined text-[20px]">
              {secondaryIcon || "add"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
