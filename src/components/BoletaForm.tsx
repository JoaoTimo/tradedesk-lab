"use client";

import { useState } from "react";

import type { Acao } from "@/types/acao";

interface Props {
  acao: Acao;
}

export default function BoletaForm({ acao }: Props) {
  const [quantidade, setQuantidade] = useState(""); // Bug B14: string, não number
  const [enviado, setEnviado] = useState(false);

  // CORREÇÃO B13 — API / DADOS:
  // O preço pode estar disponível como regularMarketPrice quando
  // os dados vêm da BRAPI, ou como preco quando vêm do mock.
  // Usamos regularMarketPrice como primeira opção e preco como fallback.
  const precoAtual =
    (acao as any).regularMarketPrice ?? acao.preco;

  // Bug B14: quantidade (string) * preco (number) = NaN → || 0 esconde o bug
  const total = (quantidade as any) * precoAtual || 0;

  async function handleCompra() {
    await fetch("/api/ordens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ticker: acao.ticker,
        quantidade: Number(quantidade),
        preco: precoAtual,
        total,
        tipo: "compra",
      }),
    });

    setEnviado(true);
  }

  if (enviado) {
    return (
      <div
        className="card-terminal"
        style={{
          textAlign: "center",
          color: "#22c55e"
        }}
      >
        ✅ Ordem enviada!
      </div>
    );
  }

  return (
    <div className="card-terminal">
      <h3
        style={{
          marginBottom: "1rem",
          color: "#f59e0b"
        }}
      >
        Boleta de Compra
      </h3>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem"
        }}
      >
        <div>
          <label
            style={{
              fontSize: "0.75rem",
              color: "#888"
            }}
          >
            Ativo
          </label>

          <div
            style={{
              fontSize: "1.1rem",
              fontWeight: 700
            }}
          >
            {acao.ticker}
          </div>
        </div>

        <div>
          <label
            style={{
              fontSize: "0.75rem",
              color: "#888"
            }}
          >
            Preço atual
          </label>

          {/* CORREÇÃO B13:
              Utiliza o preço retornado pela BRAPI quando disponível
              e acao.preco como fallback. */}
          <div
            style={{
              fontSize: "1.1rem"
            }}
          >
            {precoAtual === undefined
              ? "Preço indisponível"
              : `R$ ${precoAtual}`}
          </div>
        </div>

        <div>
          <label
            style={{
              fontSize: "0.75rem",
              color: "#888",
              display: "block",
              marginBottom: "0.25rem"
            }}
          >
            Quantidade
          </label>

          <input
            type="number"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)} // Bug B14: e.target.value é string
            placeholder="Ex: 100"
            min="1"
            style={{
              width: "100%",
              background: "#0d0d0d",
              border: "1px solid #333",
              color: "#e5e5e5",
              padding: "0.5rem",
              borderRadius: 4,
              fontFamily: "monospace"
            }}
          />
        </div>

        <div>
          <label
            style={{
              fontSize: "0.75rem",
              color: "#888"
            }}
          >
            Total estimado
          </label>

          {/* Bug B14: ainda será corrigido no próximo commit */}
          <div
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "#f59e0b"
            }}
          >
            R$ {total.toFixed(2)}
          </div>
        </div>

        <button
          onClick={handleCompra}
          style={{
            background: "#22c55e",
            color: "#000",
            border: "none",
            padding: "0.75rem",
            borderRadius: 4,
            fontWeight: 700,
            cursor: "pointer",
            fontSize: "0.9rem"
          }}
        >
          CONFIRMAR COMPRA
        </button>
      </div>
    </div>
  );
}