import { useEffect, useState } from "react";
import HeaderNav from "../components/HeaderNav/HeaderNav";
import UsedCardItem from "../components/UsedCardItem/UsedCardItem";
import { Link } from "react-router-dom";
import { getDatabase, ref, get } from "firebase/database";
import { app } from "../firebase";

const db = getDatabase(app);

export default function GestaoCartoes() {
  const [cartoesAtivos, setCartoesAtivos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [ordenacao, setOrdenacao] = useState("nome-asc");

  useEffect(() => {
    const buscarCartoesAtivosComPessoa = async () => {
      try {
        const cartoesSnap = await get(ref(db, "cartoes"));
        const pessoasSnap = await get(ref(db, "pessoas"));

        const cartoesData = cartoesSnap.val() || {};
        const pessoasData = pessoasSnap.val() || {};

        const lista = Object.entries(cartoesData)
          .filter(([_, cartao]) => cartao.liberado === true)
          .map(([id, cartao]) => {
            const pessoa = pessoasData[cartao.pessoaId] || {};
            return {
              id,
              cartaoId: cartao.cartaoId,
              nome: pessoa.nome || "Sem nome",
              email: pessoa.email || "Sem e-mail",
              telefone: pessoa.telefone || "Sem telefone",
              liberado: cartao.liberado,
              cadastrado_em: cartao.cadastrado_em,
            };
          });

        setCartoesAtivos(lista);
      } catch (error) {
        console.error("Erro ao buscar cartões ativos:", error);
      }
    };

    buscarCartoesAtivosComPessoa();
  }, []);

  const cartoesFiltrados = cartoesAtivos.filter((cartao) => {
    const termo = searchTerm.toLowerCase();
    const nome = cartao.nome?.toLowerCase() || "";
    const numero = cartao.cartaoId?.toLowerCase() || "";
    return nome.includes(termo) || numero.includes(termo);
  });

  const cartoesOrdenados = [...cartoesFiltrados].sort((a, b) => {
    switch (ordenacao) {
      case "nome-asc":
        return (a.nome || "").localeCompare(b.nome || "");
      case "nome-desc":
        return (b.nome || "").localeCompare(a.nome || "");
      case "cadastro-recente":
        return (
          new Date(b.cadastrado_em || 0).getTime() -
          new Date(a.cadastrado_em || 0).getTime()
        );
      case "cadastro-antigo":
        return (
          new Date(a.cadastrado_em || 0).getTime() -
          new Date(b.cadastrado_em || 0).getTime()
        );
      default:
        return 0;
    }
  });

  return (
    <>
      <HeaderNav />

      <div className="container my-5">
        <h2 className="fw-bold text-primary mb-4 text-center text-md-start">
          Gestão de Cartões e Pessoas
        </h2>

        <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-3 mb-5">
          <Link to="/cadastrar-pessoa" className="btn btn-outline-primary px-4 py-2 shadow-sm">
            Cadastrar Pessoa
          </Link>
          <Link to="/ver-pessoa" className="btn btn-outline-primary px-4 py-2 shadow-sm">
            Ver Pessoas
          </Link>
          <Link to="/ver-cartoes" className="btn btn-outline-primary px-4 py-2 shadow-sm">
            Ver Todos Cartões
          </Link>
          <Link to="/associar-cartao" className="btn btn-outline-primary px-4 py-2 shadow-sm">
            Associar Cartão a Pessoa
          </Link>
        </div>

        <div className="card shadow rounded-4 border-0">
          <div className="card-header bg-white border-bottom d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <h5 className="mb-0 text-secondary fw-semibold">
              Lista de Cartões Ativos
            </h5>

            <div className="dropdown">
              <button
                className="btn btn-primary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Ordenar por
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <button
                    className={`dropdown-item ${ordenacao === "nome-asc" ? "active" : ""}`}
                    onClick={() => setOrdenacao("nome-asc")}
                  >
                    Nome A-Z
                  </button>
                </li>
                <li>
                  <button
                    className={`dropdown-item ${ordenacao === "nome-desc" ? "active" : ""}`}
                    onClick={() => setOrdenacao("nome-desc")}
                  >
                    Nome Z-A
                  </button>
                </li>
                <li>
                  <button
                    className={`dropdown-item ${ordenacao === "cadastro-recente" ? "active" : ""}`}
                    onClick={() => setOrdenacao("cadastro-recente")}
                  >
                    Cadastro Mais Recente
                  </button>
                </li>
                <li>
                  <button
                    className={`dropdown-item ${ordenacao === "cadastro-antigo" ? "active" : ""}`}
                    onClick={() => setOrdenacao("cadastro-antigo")}
                  >
                    Cadastro Mais Antigo
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="card-body">
            <input
              className="form-control mb-4"
              type="search"
              placeholder="Procurar por nome ou cartão"
              aria-label="Buscar cartões"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {cartoesOrdenados.length === 0 ? (
              <p className="text-muted text-center my-5 fs-5">
                Nenhum cartão ativo encontrado.
              </p>
            ) : (
              <div className="list-group">
                {cartoesOrdenados.map((cartao, idx) => (
                  <UsedCardItem
                    key={cartao.cartaoId || cartao.id || idx}
                    numero={cartao.cartaoId || cartao.id}
                    nome={cartao.nome || "Sem nome"}
                    ativo={cartao.liberado}
                    timestamp={cartao.cadastrado_em}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
