// ============================================================
// API DE COTAÇÃO
// ============================================================

// A API utiliza USD como moeda base.
// As taxas retornadas representam quanto vale 1 USD em cada moeda.

export async function GET() {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error("API de câmbio indisponível");
    }

    const data = await res.json();

    // BUG: o endpoint utilizava valores estáticos e desatualizados em vez de consultar a API de câmbio.
    // CORREÇÃO: utilizar as taxas retornadas pela open.er-api.com e adaptar para o formato esperado pelo frontend.
    return Response.json({
      fonte: "open.er-api.com",
      atualizadoEm: new Date().toISOString(),
      cotacoes: {
        USD: 1,
        EUR: data.rates.EUR,
        GBP: data.rates.GBP,
        ARS: data.rates.ARS,
        BRL: data.rates.BRL,
      },
    });
  } catch {
    return Response.json(
      {
        erro: "Não foi possível obter as cotações.",
      },
      {
        status: 503,
      }
    );
  }
}