"use client";
// Bug B7: página de listagem como Client Component usando useEffect
// Deveria ser um Server Component async buscando os dados diretamente

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Acao } from "@/types/acao";

export default function AcoesPage() {
  const [acoes, setAcoes] = useState<Acao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/acoes")
      .then(r => r.json())
      .then(data => { setAcoes(data); setLoading(false); });
  }, []);

  if (loading) return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem", color: "#888" }}>
      Carregando cotações...
    </div>
  );

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "2rem" }}>Ações disponíveis</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #2a2a2a", color: "#888", fontSize: "0.75rem" }}>
            <th style={{ textAlign: "left", padding: "0.75rem 1rem" }}>TICKER</th>
            <th style={{ textAlign: "left", padding: "0.75rem 1rem" }}>NOME</th>
            <th style={{ textAlign: "right", padding: "0.75rem 1rem" }}>PREÇO</th>
            <th style={{ textAlign: "right", padding: "0.75rem 1rem" }}>VARIAÇÃO</th>
            <th style={{ textAlign: "right", padding: "0.75rem 1rem" }}>VOLUME</th>
            <th style={{ padding: "0.75rem 1rem" }}></th>
          </tr>
        </thead>
        <tbody>
          {acoes.map((acao: any) => (
            <tr key={acao.symbol ?? acao.ticker} style={{ borderBottom: "1px solid #1a1a1a" }}>
              <td style={{ padding: "1rem", fontWeight: 700, color: "#f59e0b" }}>{acao.symbol ?? acao.ticker}</td>
              <td style={{ padding: "1rem", color: "#888", fontSize: "0.85rem" }}>{acao.shortName ?? acao.nome}</td>
              <td style={{ padding: "1rem", textAlign: "right" }}>R$ {(acao.regularMarketPrice ?? acao.preco)?.toFixed(2) ?? "—"}</td>
              <td style={{ padding: "1rem", textAlign: "right" }} className={((acao.regularMarketChangePercent ?? acao.variacao) ?? 0) >= 0 ? "positivo" : "negativo"}>
                {((acao.regularMarketChangePercent ?? acao.variacao) ?? 0) >= 0 ? "▲" : "▼"} {Math.abs((acao.regularMarketChangePercent ?? acao.variacao) ?? 0).toFixed(2)}%
              </td>
              <td style={{ padding: "1rem", textAlign: "right", color: "#888", fontSize: "0.8rem" }}>{((acao.regularMarketVolume ?? acao.volume) ?? 0).toLocaleString("pt-BR")}</td>
              <td style={{ padding: "1rem" }}>
                {/* BUG B6: a rota utilizava "ticker" literalmente.
    CORREÇÃO: utilizar o ticker da ação para gerar a rota dinâmica. */}
                <Link
                  href={`/acoes/${acao.ticker}`}
                  style={{
                    background: "#1a2a1a",
                    border: "1px solid #22c55e",
                    color: "#22c55e",
                    padding: "0.35rem 0.75rem", 
                    borderRadius: 4,
                    textDecoration: "none",
                    fontSize: "0.8rem",
                  }}
                >
                  Ver →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
