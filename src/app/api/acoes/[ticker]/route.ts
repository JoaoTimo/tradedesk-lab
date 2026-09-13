import { NextResponse } from "next/server";

import { ACOES_MOCK } from "@/lib/mocks";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {

  const { ticker } = await params;

  try {

    const res = await fetch(
      `https://brapi.dev/api/quote/${ticker}?fundamental=false`,
      {
        next: { revalidate: 30 },
      }
    );

    if (!res.ok) throw new Error("brapi offline");

    const data = await res.json();

    // BUG B9 — API ROUTES:
    // Quando o ticker não existe na BRAPI, data.results fica vazio.
    // O código original retornava {} com status 200.
    //
    // CORREÇÃO:
    // Retornar uma resposta de recurso não encontrado (404),
    // informando que a ação solicitada não foi encontrada.

    if (!data.results || data.results.length === 0) {
      return NextResponse.json(
        { error: "Ação não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(data.results[0]);

  } catch {

    const acao = ACOES_MOCK.find(
      a => a.ticker === ticker.toUpperCase()
    );

    // BUG B9 — API ROUTES:
    // Caso a BRAPI esteja indisponível e o ticker também não
    // exista nos dados Mock, o código original retornava {} com 200.
    //
    // CORREÇÃO:
    // Retornar status 404 para informar corretamente que o recurso
    // solicitado não foi encontrado.

    if (!acao) {
      return NextResponse.json(
        { error: "Ação não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(acao);
  }
}