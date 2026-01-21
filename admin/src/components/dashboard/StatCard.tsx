interface StatCardProps {
  title: string;
  value: string | number;
  trend: string | number; // Aceita string formatada ("+55%") ou numero puro
  trendLabel: string;
  icon: string;
  isWarning?: boolean;
}

export function StatCard({
  title,
  value,
  trend,
  trendLabel,
  icon,
  isWarning,
}: StatCardProps) {
  // 1. Sanitização do TREND
  // Converte para string e remove tudo que não for dígito, ponto ou sinal de menos.
  // Ex: "+80%" vira "80". Ex: "-10%" vira "-10".
  const trendStr = String(trend || "");
  const trendNumeric = parseFloat(trendStr.replace(/[^0-9.-]/g, ""));

  // 2. Regra de Negócio: > 50 Green, <= 50 Red
  // Verifica se é um número válido E se é maior que 50
  const isPerformanceGood = !isNaN(trendNumeric) && trendNumeric > 50;

  // 3. Definição de Cores
  const trendColor = isWarning
    ? "text-red-500"
    : isPerformanceGood
    ? "text-emerald-500" // Verde se > 50
    : "text-red-500"; // Vermelho se <= 50

  // 4. Ícone Dinâmico
  // Se for maior que 50, seta para cima. Se não, para baixo (ou alerta)
  const trendIcon = isWarning
    ? "priority_high"
    : isPerformanceGood
    ? "trending_up"
    : "trending_down";

  const iconBg = isWarning
    ? "bg-orange-500/10 text-orange-500"
    : "bg-[var(--zephira-primary)]/10 text-[var(--zephira-primary)]";

  return (
    <div className="bg-white dark:bg-[var(--zephira-dark)] p-6 rounded-xl border border-gray-200 dark:border-white/5 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-[var(--zephira-muted)] font-medium text-sm">
          {title}
        </p>
        <span
          className={`material-symbols-outlined p-1.5 rounded-lg text-[20px] ${iconBg}`}
        >
          {icon}
        </span>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-[var(--zephira-text)] dark:text-white">
          {value}
        </h3>
        <div className="flex items-center gap-1 mt-1">
          <span
            className={`material-symbols-outlined text-[16px] ${trendColor}`}
          >
            {trendIcon}
          </span>
          {/* Exibe o trend formatado original, mas com a cor calculada */}
          <p className={`${trendColor} text-sm font-medium`}>{trend}</p>
          <p className="text-[var(--zephira-muted)] text-sm ml-1">
            {trendLabel}
          </p>
        </div>
      </div>
    </div>
  );
}
