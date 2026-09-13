import Link from "next/link";

import MercadoStatus from "@/components/MercadoStatus";

// ERRO B1 — COMPONENTES:
// O Header estava sendo importado e renderizado nesta página,
// porém ele já é renderizado pelo layout.tsx.
//
// CORREÇÃO:
// Removemos o import do Header e sua utilização abaixo.
// Dessa forma, evitamos que o componente apareça duplicado.

export default async function HomePage() {

  // Busca destaques do dia
  let acoes: any[] = [];

  try {

    const res = await fetch(
      "http://localhost:3000/api/acoes",
      { cache: "no-store" }
    );

    acoes = await res.json();

  } catch {
    acoes = [];
  }

  return (
    <>
      <MercadoStatus />

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "2rem"
        }}
      >

        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            marginBottom: "0.25rem"
          }}
        >
          Destaques do dia
        </h1>

        <p
          style={{
            color: "#666",
            fontSize: "0.8rem",
            marginBottom: "2rem"
          }}
        >
          Acompanhe as principais movimentações do mercado
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "1rem"
          }}
        >

          {acoes.slice(0, 5).map((a: any) => (

            <Link
              key={a.symbol ?? a.ticker}
              href={`/acoes/${a.symbol ?? a.ticker}`}
              style={{ textDecoration: "none" }}
            >

              <div
                className="card-terminal"
                style={{ cursor: "pointer" }}
              >

                <div
                  style={{
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "#f59e0b"
                  }}
                >
                  {a.symbol ?? a.ticker}
                </div>

                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#888",
                    marginBottom: "0.5rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}
                >
                  {a.shortName ?? a.nome}
                </div>

                <div
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 700
                  }}
                >
                  R$ {(a.regularMarketPrice ?? a.preco)?.toFixed(2) ?? "—"}
                </div>

                <div
                  style={{ fontSize: "0.8rem" }}
                  className={
                    ((a.regularMarketChangePercent ?? a.variacao) ?? 0) >= 0
                      ? "positivo"
                      : "negativo"
                  }
                >
                  {((a.regularMarketChangePercent ?? a.variacao) ?? 0) >= 0
                    ? "▲"
                    : "▼"}{" "}
                  {Math.abs(
                    (a.regularMarketChangePercent ?? a.variacao) ?? 0
                  ).toFixed(2)}
                  %
                </div>

              </div>

            </Link>

          ))}

        </div>

      </div>
    </>
  );
}