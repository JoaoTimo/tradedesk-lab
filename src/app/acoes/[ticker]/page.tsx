// funcionou na minha maquina, params.ticker ta chegando certo
// Bug B4: params acessado sem await — Next.js 15 exige await params

import Link from "next/link";
import GraficoAcao from "@/components/GraficoAcao";

interface Props {
  params: Promise<{ ticker: string }>;
}

export default async function AcaoPage({ params }: Props) {
  // BUG B4: params é uma Promise e estava sendo acessado sem await.
  // CORREÇÃO: aguardar params antes de extrair o ticker.
  const { ticker } = await params;

  const res = await fetch(`http://localhost:3000/api/acoes/${ticker}`, { cache: "no-store" });
  const acao = await res.json();

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>
      <Link href="/acoes" style={{ color: "#888", textDecoration: "none", fontSize: "0.85rem" }}>← Voltar</Link>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", margin: "1.5rem 0" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#f59e0b" }}>{acao.symbol ?? acao.ticker ?? ticker}</h1>
          <p style={{ color: "#888" }}>{acao.shortName ?? acao.nome}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "2rem", fontWeight: 700 }}>
            R$ {(acao.regularMarketPrice ?? acao.preco)?.toFixed(2) ?? "—"}
          </div>
          <div className={((acao.regularMarketChangePercent ?? acao.variacao) ?? 0) >= 0 ? "positivo" : "negativo"}>
            {((acao.regularMarketChangePercent ?? acao.variacao) ?? 0) >= 0 ? "▲" : "▼"} {Math.abs((acao.regularMarketChangePercent ?? acao.variacao) ?? 0).toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Bug B3: onPrecoAtualizado é uma função — não pode ser passada de Server Component como prop para Client Component */}
      <GraficoAcao acao={acao} />

      <div style={{ marginTop: "2rem", textAlign: "right" }}>
        <Link
          href={`/acoes/${ticker}/boleta`}
          style={{ background: "#22c55e", color: "#000", padding: "0.75rem 2rem", borderRadius: 4, textDecoration: "none", fontWeight: 700 }}
        >
          COMPRAR
        </Link>
      </div>
    </div>
  );
}
