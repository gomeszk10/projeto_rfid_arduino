export default function UsedCardItem({ numero, nome, ativo, timestamp, tipo }) {
  const formatarDataHora = (ts) => {
    if (!ts) return "Data indisponível";
    const data = new Date(ts);
    if (isNaN(data.getTime())) return "Data inválida";
    return data.toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  // Classe da borda conforme status e tipo
  let bordaClasse = "border";
  if (!ativo) {
    bordaClasse += " border-secondary"; // Cinza
  } else if (tipo?.toLowerCase() === "saída" || tipo?.toLowerCase() === "saida") {
    bordaClasse += " border-danger"; // Vermelho
  } else {
    bordaClasse += " border-success"; // Verde
  }

  // Ícones para tipo (usado só se tipo existir)
  const iconTipo =
    tipo?.toLowerCase() === "entrada" ? (
      <i className="bi bi-box-arrow-in-right text-success me-2"></i>
    ) : tipo?.toLowerCase() === "saída" || tipo?.toLowerCase() === "saida" ? (
      <i className="bi bi-box-arrow-right text-danger me-2"></i>
    ) : null;

  return (
    <div
      className={`card p-3 mb-3 position-relative shadow-sm rounded-3 ${bordaClasse}`}
      style={{ minWidth: "280px" }}
    >
      {/* Badge de status */}
      <span
        className={`position-absolute top-0 end-0 m-2 badge rounded-pill ${
          ativo ? "bg-success" : "bg-secondary"
        }`}
        style={{ fontSize: "0.75rem", fontWeight: "600", letterSpacing: "0.05em" }}
      >
        {ativo ? "Ativo" : "Inativo"}
      </span>

      <h5 className="mb-2 fw-bold text-dark">
        {nome || "Sem nome"}
      </h5>
      <h5>Número: {numero}</h5>

      {/* Só mostra o tipo se existir */}
      {tipo && (
        <p className="mb-2 d-flex align-items-center text-secondary" style={{ fontWeight: "600" }}>
          {iconTipo}
          <span>{tipo}</span>
        </p>
      )}

      <p className="mb-0 text-muted" style={{ fontSize: "0.85rem" }}>
        <i className="bi bi-clock me-1"></i>
        {formatarDataHora(timestamp)}
      </p>
    </div>
  );
}