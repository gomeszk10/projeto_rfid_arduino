import React, { useEffect, useState } from "react";
import HeaderNav from "../components/HeaderNav/HeaderNav";
import UsedCardItem from "../components/UsedCardItem/UsedCardItem";
import { getDatabase, ref, get } from "firebase/database";
import { app } from "../firebase";

const db = getDatabase(app);

export default function HistoricoAcessos() {
  const [acessos, setAcessos] = useState([]);
  const [cartoes, setCartoes] = useState({});
  const [loading, setLoading] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState("todos");

  // Normaliza o tipo (para filtro e comparação)
  const normalizarTipo = (tipo) => {
    if (!tipo) return "tipo desconhecido";
    return tipo
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  };

  // Formata o tipo para exibição
  const formatarTipo = (tipo) => {
    const tipoNorm = normalizarTipo(tipo);
    if (tipoNorm === "entrada") return "Entrada";
    if (tipoNorm === "saida") return "Saída";
    return "Tipo desconhecido";
  };

  useEffect(() => {
    const buscarAcessos = async () => {
      setLoading(true);
      try {
        const snapshot = await get(ref(db, "acessos"));
        const objAcessos = snapshot.exists() ? snapshot.val() : {};

        const snapshotCartoes = await get(ref(db, "cartoes"));
        const objCartoes = snapshotCartoes.exists() ? snapshotCartoes.val() : {};

        let lista = Object.values(objAcessos)
          .flatMap((acessosPessoa) => Object.values(acessosPessoa || {}))
          .sort((a, b) => new Date(b.data) - new Date(a.data));

        // Remove duplicados por uid+data
        const vistos = new Set();
        lista = lista.filter((acesso) => {
          const key = `${acesso.uid}-${acesso.data}`;
          if (vistos.has(key)) return false;
          vistos.add(key);
          return true;
        });

        setAcessos(lista);
        setCartoes(objCartoes);
      } catch (error) {
        setAcessos([]);
        setCartoes({});
      } finally {
        setLoading(false);
      }
    };

    buscarAcessos();
  }, []);

  // Filtro com tipo normalizado
  const acessosFiltrados = acessos.filter((acesso) => {
    if (filtroTipo === "todos") return true;
    return normalizarTipo(acesso.tipo) === filtroTipo;
  });

  return (
    <>
      <HeaderNav />
      <div className="container mt-4">
        <h4 className="fw-semibold text-primary mb-3">Histórico de Acessos</h4>

        <div className="mb-3">
          <label className="me-2">Filtrar por tipo:</label>
          <select
            className="form-select d-inline-block w-auto"
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="entrada">Entradas</option>
            <option value="saida">Saídas</option>
          </select>
        </div>

        {loading ? (
          <p>Carregando acessos...</p>
        ) : acessosFiltrados.length === 0 ? (
          <p>Nenhum acesso encontrado.</p>
        ) : (
          acessosFiltrados.map((acesso, idx) => (
            <UsedCardItem
              key={`${acesso.uid}-${acesso.data}-${idx}`}
              numero={acesso.uid}
              nome={acesso.nome}
              ativo={cartoes[acesso.uid]?.liberado ?? false}
              timestamp={acesso.data}
              tipo={formatarTipo(acesso.tipo)}
            />
          ))
        )}
      </div>
    </>
  );
}