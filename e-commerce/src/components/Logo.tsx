// Wordmark provisório: não havia arquivo de logo em src/assets, o que quebrava o build.
// Troque por <Image src="/logo.png" .../> assim que tiver o arquivo oficial em public/.
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-black uppercase tracking-[0.15em] text-bg-dark ${className}`}
    >
      Zephira
    </span>
  );
}
