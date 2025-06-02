import React, { useEffect, useState } from "react";
import { getDatabase, ref, get } from "firebase/database";
import { app } from "../firebase";

import MainOptionButton from "../components/MainOptionButton/MainOptionButton";
import UsedCardItem from "../components/UsedCardItem/UsedCardItem";
import HeaderNav from "../components/HeaderNav/HeaderNav";

const db = getDatabase(app);

function Home() {
  const [acessos, setAcessos] = useState([]);
  const [cartoes, setCartoes] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAcessos = async () => {
      setLoading(true);
      try {
        // Busca acessos (dois níveis)
        const snapshotAcessos = await get(ref(db, "acessos"));
        const objAcessos = snapshotAcessos.exists() ? snapshotAcessos.val() : {};

        // Busca cartões
        const snapshotCartoes = await get(ref(db, "cartoes"));
        const objCartoes = snapshotCartoes.exists() ? snapshotCartoes.val() : {};

        // Junta todos os acessos em um array
        let listaAcessos = [];
        Object.values(objAcessos).forEach((acessosPessoa) => {
          Object.values(acessosPessoa).forEach((acesso) => {
            listaAcessos.push(acesso);
          });
        });

        // Ordena e pega os 10 mais recentes
        listaAcessos = listaAcessos
          .sort((a, b) => new Date(b.data) - new Date(a.data))
          .slice(0, 10);

        setAcessos(listaAcessos);
        setCartoes(objCartoes);
      } catch (error) {
        setAcessos([]);
        setCartoes({});
      } finally {
        setLoading(false);
      }
    };

    fetchAcessos();
  }, []);

  return (
    <>
      <HeaderNav />

      <div className="container mt-4">
        <h4 className="fw-semibold text-primary mb-3">Ações rápidas</h4>

        <div className="d-flex flex-wrap gap-3 mb-4">
          <MainOptionButton
            text="Gestão de cartões"
            icon="bi bi-person-badge-fill"
            link="/gestao"
          />
          <MainOptionButton
            text="Histórico de Acessos"
            icon="bi bi-clock-fill"
            link="/historico"
          />
        </div>

        <div className="card shadow-sm rounded-4 border-0">
          <div className="card-header bg-white px-4 pt-4 border-0">
            <h5 className="mb-0 text-dark">
              Últimos lidos
              <span className="ms-2 text-muted small">Máximo de 10</span>
            </h5>
          </div>

          <div className="card-body px-4">
            {loading ? (
              <p>Carregando acessos...</p>
            ) : acessos.length === 0 ? (
              <p>Nenhum acesso registrado.</p>
            ) : (
              acessos.map((acesso, idx) => {
                const cartao = cartoes[acesso.uid] || {};
                // Mostra tipo (entrada/saída)
                const tipoAcesso = (() => {
                  if (!acesso.tipo) return "Tipo desconhecido";
                  const tipo = acesso.tipo.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                  if (tipo === "entrada") return "Entrada";
                  if (tipo === "saida") return "Saída";
                  return "Tipo desconhecido";
                })();
                return (
                  <UsedCardItem
                    key={idx}
                    numero={acesso.uid}
                    nome={acesso.nome || "Sem titular"}
                    ativo={cartao.liberado ?? false}
                    timestamp={acesso.data}
                    tipo={tipoAcesso}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;