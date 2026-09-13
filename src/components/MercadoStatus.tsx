// Server Component — busca status do mercado em URL externa

export default async function MercadoStatus() {

  let status = {
    status: "alta",
    mensagem: "Mercado operando normalmente",
    crash: false
  };

  try {

    const url =
      process.env.NEXT_PUBLIC_MERCADO_STATUS_URL ??
      "https://web-on-fire.vercel.app/api/status-mercado";

    // BUG CACHE: o fetch sem política de cache pode retornar um status desatualizado.
    // CORREÇÃO: no-store garante que o status do mercado seja consultado novamente.
    const res = await fetch(url, { cache: "no-store" });

    status = await res.json();

  } catch {

    // silencia erro de rede

  }

  const isCrash =
    status.status === "CRASH" || status.crash === true;

  return (
    <div
      style={{
        padding: "0.75rem 1.5rem",
        background: isCrash ? "#1a0000" : "#001a00",
        borderBottom: `2px solid ${
          isCrash ? "#ef4444" : "#22c55e"
        }`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span
        style={{
          color: isCrash ? "#ef4444" : "#22c55e",
          fontWeight: 700
        }}
      >
        {isCrash ? "🔴 CRASH NO MERCADO" : "🟢 MERCADO ABERTO"}
      </span>

      <span
        style={{
          color: "#888",
          fontSize: "0.8rem"
        }}
      >
        {status.mensagem}
      </span>
    </div>
  );
}