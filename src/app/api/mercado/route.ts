import { NextResponse } from "next/server";

export async function GET() {
  // Bug B11: usa horário local do servidor sem timezone definido
  // B3 hora de Brasília = UTC-3, mas new Date().getHours() usa o timezone do servidor
  // Bug B11: o código utilizava new Date().getHours(), que depende do timezone
  // configurado no servidor e pode retornar um horário diferente do horário de Brasília.
  // CORREÇÃO: obter explicitamente a hora utilizando o timezone America/Sao_Paulo.
  const hora = Number(
    new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo",
      hour: "2-digit",
      hour12: false,
    }).format(new Date())
  );

  // Horário de funcionamento da B3: 10h–17h30 (horário de Brasília)
  const abertura = 10;
  const fechamento = 17;

  const isAberto = hora >= abertura && hora < fechamento;

  return NextResponse.json({
    status: isAberto ? "aberto" : "fechado",
    hora: hora,
    mensagem: isAberto
      ? `Mercado aberto — ${hora}h`
      : `Mercado fechado — abre às ${abertura}h`,
    abertura,
    fechamento,
  });
}
