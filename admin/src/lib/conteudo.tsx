import type { ReactNode } from "react";

// Mesma formatação mínima que a loja usa pra mostrar o texto (ver
// e-commerce/src/lib/conteudo.tsx) — duplicado aqui só pra pré-visualização
// dentro do admin, sem puxar o outro app como dependência.

function renderizarInline(texto: string, chavePrefixo: string): ReactNode[] {
  const partes: ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let ultimoIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = regex.exec(texto))) {
    if (match.index > ultimoIndex) partes.push(texto.slice(ultimoIndex, match.index));
    if (match[1] !== undefined) {
      partes.push(<strong key={`${chavePrefixo}-${i++}`}>{match[1]}</strong>);
    } else {
      partes.push(
        <a key={`${chavePrefixo}-${i++}`} href={match[3]} className="underline">
          {match[2]}
        </a>,
      );
    }
    ultimoIndex = match.index + match[0].length;
  }
  if (ultimoIndex < texto.length) partes.push(texto.slice(ultimoIndex));
  return partes;
}

export function renderizarConteudo(texto: string): ReactNode {
  const blocos = texto.trim().split(/\n\s*\n/).filter(Boolean);
  return blocos.map((bloco, i) => {
    const linhas = bloco.split("\n").map((l) => l.trim()).filter(Boolean);
    if (linhas[0]?.startsWith("## ")) {
      return (
        <h3 key={i} className="font-black text-base mt-3 mb-1">
          {renderizarInline(linhas[0].slice(3), `h-${i}`)}
        </h3>
      );
    }
    if (linhas.length > 0 && linhas.every((l) => l.startsWith("- "))) {
      return (
        <ul key={i} className="list-disc pl-5 space-y-1">
          {linhas.map((l, j) => (
            <li key={j}>{renderizarInline(l.slice(2), `li-${i}-${j}`)}</li>
          ))}
        </ul>
      );
    }
    return (
      <p key={i} className="mb-2">
        {renderizarInline(linhas.join(" "), `p-${i}`)}
      </p>
    );
  });
}
