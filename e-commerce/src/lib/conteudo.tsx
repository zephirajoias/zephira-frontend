import Link from "next/link";
import type { ReactNode } from "react";

// Formatação mínima pro texto que a loja edita no admin (campo de texto
// simples, sem editor visual): linha em branco separa parágrafos,
// "## " vira subtítulo, linhas começando com "- " viram lista,
// **negrito** e [texto](link) funcionam dentro de qualquer bloco.
// Ver back-end PAGINA_INSTITUCIONAL / apps/admin PaginasInstitucionaisPage.

function renderizarInline(texto: string, chavePrefixo: string): ReactNode[] {
  const partes: ReactNode[] = [];
  // **negrito** ou [texto](link), nessa ordem de prioridade por posição.
  const regex = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let ultimoIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = regex.exec(texto))) {
    if (match.index > ultimoIndex) {
      partes.push(texto.slice(ultimoIndex, match.index));
    }
    if (match[1] !== undefined) {
      partes.push(<strong key={`${chavePrefixo}-${i++}`}>{match[1]}</strong>);
    } else {
      const href = match[3];
      const interno = href.startsWith("/");
      partes.push(
        interno ? (
          <Link key={`${chavePrefixo}-${i++}`} href={href}>
            {match[2]}
          </Link>
        ) : (
          <a key={`${chavePrefixo}-${i++}`} href={href} target="_blank" rel="noopener noreferrer">
            {match[2]}
          </a>
        ),
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
      return <h2 key={i}>{renderizarInline(linhas[0].slice(3), `h-${i}`)}</h2>;
    }

    if (linhas.length > 0 && linhas.every((l) => l.startsWith("- "))) {
      return (
        <ul className="lista" key={i}>
          {linhas.map((l, j) => (
            <li key={j}>{renderizarInline(l.slice(2), `li-${i}-${j}`)}</li>
          ))}
        </ul>
      );
    }

    return <p key={i}>{renderizarInline(linhas.join(" "), `p-${i}`)}</p>;
  });
}
