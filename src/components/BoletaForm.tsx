"use client";

import { useState } from "react";

import type { Acao } from "@/types/acao";

interface Props {
  acao: Acao;
}

export default function BoletaForm({ acao }: Props) {
  // CORREÇÃO B14 — SERVER VS CLIENT:
  // A quantidade era armazenada como string e depois convertida
  // implicitamente durante o cálculo.
  // Agora o estado armazena um número, evitando operações com
  // tipos diferentes e a necessidade de utilizar "as any".
  const [quantidade, setQuantidade] = useState<number>(0);

  const [enviado, setEnviado] = useState(false);

  // B13 já corrigido:
  // utiliza regularMarketPrice quando disponível e acao.preco como fallback.
  const precoAtual =
    (acao as any).regularMarketPrice ?? acao.preco;

  // CORREÇÃO B14:
  // O cálculo agora utiliza quantidade e precoAtual como números.
  // Não é necessário utilizar "as any" nem esconder possíveis NaN com || 0.
  const total = quantidade * precoAtual;

  async function handleCompra() {
    await fetch("/api/ordens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ticker: acao.ticker,
        quantidade: quantidade,
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
            onChange={(e) => setQuantidade(Number(e.target.value))}
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

          {/* CORREÇÃO B14:
              O total agora é calculado diretamente com dois números. */}
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