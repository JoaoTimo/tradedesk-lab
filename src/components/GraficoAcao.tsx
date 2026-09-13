"use client";

import type { Acao } from "@/types/acao";

interface Props {
  acao: Acao;
}

export default function GraficoAcao({ acao }: Props) {
  // CORREÇÃO B3 — SERVER VS CLIENT:
  // Removida a função onPrecoAtualizado das props.
  // Funções não serializáveis não devem ser passadas de um
  // Server Component para um Client Component.
  //
  // Como o gráfico é simulado, a atualização será tratada
  // localmente pelo próprio Client Component.

  // Gráfico fake — barras estáticas representando variação de preço
  const pontos = [36.1, 37.4, 38.0, 37.8, 38.2, 38.5, 38.42];

  function handleAtualizar() {
    console.log(`Atualizando gráfico de ${acao.ticker}`);
  }

  // Bug B8 permanece para um próximo commit:
  // dado sensível visível no DevTools
  const COMISSAO_SECRETA = 0.003;

  console.log("Comissão aplicada:", COMISSAO_SECRETA);

  return (
    <div className="card-terminal">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem"
        }}
      >
        <span
          style={{
            color: "#888",
            fontSize: "0.8rem"
          }}
        >
          Histórico intraday (simulado)
        </span>

        <button
          onClick={handleAtualizar}
          style={{
            background: "#1a1a1a",
            border: "1px solid #333",
            color: "#e5e5e5",
            padding: "0.25rem 0.75rem",
            borderRadius: 4,
            cursor: "pointer",
            fontSize: "0.75rem"
          }}
        >
          Atualizar
        </button>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "4px",
          height: "80px"
        }}
      >
        {pontos.map((p, i) => {
          const altura = ((p - 35) / 4) * 80;

          const cor =
            i === pontos.length - 1
              ? "#f59e0b"
              : p >= pontos[Math.max(0, i - 1)]
                ? "#22c55e"
                : "#ef4444";

          return (
            <div
              key={i}
              style={{
                flex: 1,
                background: cor,
                height: `${altura}px`,
                borderRadius: "2px 2px 0 0",
                opacity: 0.8
              }}
            />
          );
        })}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "0.5rem",
          fontSize: "0.7rem",
          color: "#555"
        }}
      >
        <span>09:00</span>
        <span>12:00</span>
        <span>17:30</span>
      </div>
    </div>
  );
}