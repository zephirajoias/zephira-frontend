// Interface para tipar o componente (opcional, mas bom pra TypeScript)
interface StatusProps {
  cssStatus?: string; // ex: "success", "warning", "danger"
  label?: string; // O texto que aparece (ex: "Pago"). Se não vier, usamos um padrão.
}

function StatusBadge({ cssStatus, label }: StatusProps) {
  // Normaliza para minúsculo para evitar erros (Success vs success)
  const statusKey = cssStatus?.toLowerCase() || "default";

  // Mapeamento de Estilos (Cores Neon/Vidro)
  const styles: Record<string, string> = {
    success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-500 border-amber-500/20", // Para pendente
    danger: "bg-red-500/10 text-red-500 border-red-500/20", // Para erro/cancelado
    info: "bg-blue-500/10 text-blue-500 border-blue-500/20", // Para enviado
    default: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  };

  const defaultLabels: Record<string, string> = {
    success: "Aprovado",
    warning: "Pendente",
    danger: "Cancelado",
    info: "Processando",
    default: "Desconhecido",
  };

  const currentStyle = styles[statusKey] || styles.default;
  const displayText = label || defaultLabels[statusKey] || statusKey;

  return (
    <span
      className={`
      inline-flex items-center gap-1.5 px-2.5 py-1 
      rounded-full text-xs font-bold border 
      ${currentStyle}
    `}
    >
      {/* Bolinha brilhante */}
      <span className="size-1.5 rounded-full bg-current opacity-70"></span>
      {displayText}
    </span>
  );
}

export default StatusBadge;
