import { NextResponse } from "next/server";

import { ACOES_MOCK, ORDENS_MOCK } from "@/lib/mocks";

import type { Ordem } from "@/types/ordem";

export async function GET() {
  return NextResponse.json(ORDENS_MOCK);
}

export async function POST(req: Request) {
  const body = await req.json();

  // Bug B10: a API aceitava quantidade 0, negativa ou menor que o mínimo de 100 ações.
  // CORREÇÃO: validar a quantidade no backend antes de criar a ordem.
  if (
    !Number.isInteger(body.quantidade) ||
    body.quantidade < 100
  ) {
    return NextResponse.json(
      {
        erro: "A quantidade mínima para uma ordem é de 100 ações.",
      },
      { status: 400 }
    );
  }

  const ordem: Ordem = {
    id: crypto.randomUUID(),
    ticker: body.ticker,
    quantidade: body.quantidade,
    preco: body.preco,
    total: body.total,
    tipo: "compra",
    timestamp: new Date().toISOString(),
  };

  // Bug B12 ainda não será corrigido neste commit.
  // Ele será tratado separadamente para manter um bug por commit.
  ACOES_MOCK.push(ordem as any);

  return NextResponse.json(ordem, { status: 201 });
}