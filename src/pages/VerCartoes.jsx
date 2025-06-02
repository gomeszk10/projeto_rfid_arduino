import React, { useEffect, useState } from "react";
import { getDatabase, ref, get, update, remove } from "firebase/database";
import UsedCardItem from "../components/UsedCardItem/UsedCardItem";
import { app } from "../firebase";
import HeaderNav from "../components/HeaderNav/HeaderNav";
import Swal from "sweetalert2";

const db = getDatabase(app);

export default function VerTodosCartoes() {
  const [cartoes, setCartoes] = useState([]);
  const [pessoas, setPessoas] = useState({});
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [mensagem, setMensagem] = useState(null);
  const [excluindo, setExcluindo] = useState(false);

  useEffect(() => {
    async function fetchCartoesEPessoas() {
      setLoading(true);
      try {
        const cartoesSnap = await get(ref(db, "cartoes"));
        const listaCartoes = Object.entries(cartoesSnap.val() || {}).map(([id, data]) => ({
          id,
          ...data,
        }));

        const pessoasSnap = await get(ref(db, "pessoas"));
        const pessoasObj = pessoasSnap.exists() ? pessoasSnap.val() : {};

        setCartoes(listaCartoes);
        setPessoas(pessoasObj);
      } catch (error) {
        setMensagem({ tipo: "error", texto: "Erro ao carregar os dados." });
        setCartoes([]);
        setPessoas({});
      } finally {
        setLoading(false);
      }
    }
    fetchCartoesEPessoas();
  }, []);

  const alternarStatusCartao = async (id, statusAtual) => {
    try {
      await update(ref(db, `cartoes/${id}`), {
        liberado: !statusAtual,
      });

      setCartoes((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, liberado: !statusAtual } : c
        )
      );

      setMensagem({
        tipo: "success",
        texto: `Cartão ${!statusAtual ? "ativado" : "inativado"} com sucesso.`,
      });
    } catch (error) {
      setMensagem({
        tipo: "error",
        texto: "Erro ao atualizar o status do cartão.",
      });
    }
  };

const excluirCartao = async (id) => {
  const resultado = await Swal.fire({
    title: "Deseja mesmo excluir este cartão?",
    text: "Esta ação não poderá ser desfeita!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Excluir",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
  });

  if (!resultado.isConfirmed) return;

  setExcluindo(true);
  try {
    const cartaoRef = ref(db, `cartoes/${id}`);
    const cartaoSnap = await get(cartaoRef);

    if (cartaoSnap.exists()) {
      const cartaoData = cartaoSnap.val();

      // Se o cartão estiver vinculado a uma pessoa, desvincula
      if (cartaoData.pessoaId) {
        await update(ref(db, `pessoas/${cartaoData.pessoaId}`), {
          cartaoId: null,
        });
      }
    }

    // Agora pode remover o cartão
    await remove(cartaoRef);

    setCartoes((prev) => prev.filter((c) => c.id !== id));

    await Swal.fire({
      title: "Excluído!",
      text: "Cartão deletado com sucesso.",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (error) {
    Swal.fire({
      title: "Erro",
      text: "Erro ao excluir o cartão.",
      icon: "error",
    });
  } finally {
    setExcluindo(false);
  }
};




  const cartoesFiltrados = cartoes.filter(
    (cartao) =>
      (cartao.cartaoId ?? "").toLowerCase().includes(filtro.toLowerCase()) ||
      (cartao.pessoaId ?? "").toLowerCase().includes(filtro.toLowerCase()) ||
      (cartao.pessoaId &&
        pessoas[cartao.pessoaId]?.nome?.toLowerCase().includes(filtro.toLowerCase()))
  );

  return (
    <>
      <HeaderNav />
      <div className="container mt-4" style={{ maxWidth: "800px" }}>
        <h2 className="fw-semibold text-primary mb-4">Todos os Cartões</h2>

        <input
          type="search"
          className="form-control mb-4"
          placeholder="Buscar por RFID, pessoaId ou nome"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          aria-label="Buscar cartões"
        />

        {mensagem && (
          <div
            className={`alert ${
              mensagem.tipo === "error" ? "alert-danger" : "alert-success"
            }`}
            role="alert"
          >
            {mensagem.texto}
          </div>
        )}

        {loading ? (
          <div>Carregando cartões...</div>
        ) : cartoesFiltrados.length === 0 ? (
          <div>Nenhum cartão encontrado.</div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {cartoesFiltrados.map((cartao) => (
              <div key={cartao.id} className="border rounded p-3 shadow-sm">
                <UsedCardItem
                  numero={cartao.cartaoId || cartao.id}
                  nome={
                    cartao.pessoaId && pessoas[cartao.pessoaId]
                      ? pessoas[cartao.pessoaId].nome
                      : "Sem pessoa"
                  }
                  ativo={cartao.liberado}
                  timestamp={cartao.cadastrado_em}
                />
                <div className="d-flex gap-2 mt-2">
                  <button
                    className={`btn btn-sm ${cartao.liberado ? "btn-danger" : "btn-success"}`}
                    onClick={() => alternarStatusCartao(cartao.id, cartao.liberado)}
                  >
                    {cartao.liberado ? "Inativar" : "Ativar"}
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => excluirCartao(cartao.id)}
                    disabled={excluindo}
                  >
                    Deletar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}