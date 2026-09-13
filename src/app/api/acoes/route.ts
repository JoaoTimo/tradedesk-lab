import { NextResponse } from "next/server";

import { ACOES_MOCK } from "@/lib/mocks";

const TICKERS = "PETR4,VALE3,ITUB4,MGLU3,BBDC4";

// Para usar dados reais da brapi.dev:
//
// 1. Crie conta gratuita em https://brapi.dev/account e copie seu token
//
// 2. Crie .env.local na raiz do projeto com: BRAPI_TOKEN=seu_token_aqui
//
// 3. Substitua a linha do fetch abaixo por:
//
// const res = await fetch(
//   `https://brapi.dev/api/quote/${TICKERS}?token=${process.env.BRAPI_TOKEN}&fundamental=false`,
//   ...
// )

// Campos retornados pela brapi:
// symbol | shortName | regularMarketPrice | regularMarketChangePercent | regularMarketVolume

export async function GET() {
  try {
    const res = await fetch(
      `https://brapi.dev/api/quote/${TICKERS}?fundamental=false`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) throw new Error("brapi offline");

    const data = await res.json();

    return NextResponse.json(data.results);
  } catch {
    // BUG: o catch retornava um objeto contendo "acoes", mas a HomePage espera diretamente um array para usar .slice() e .map().
    // CORREÇÃO: retornar ACOES_MOCK diretamente para manter o mesmo formato de resposta da API quando a BRAPI estiver indisponível.
    return NextResponse.json(ACOES_MOCK);
  }
}