// Correção: o Header já é renderizado pelo layout raiz,
// portanto não deve ser renderizado novamente neste layout.
export default function ProtegidoLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "2rem"
        }}
      >
        {children}
      </div>
    </div>
  );
}