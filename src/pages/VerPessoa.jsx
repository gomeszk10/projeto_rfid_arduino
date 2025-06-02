import React, { useEffect, useState } from "react";
import HeaderNav from "../components/HeaderNav/HeaderNav";
import { getDatabase, ref, get, remove } from "firebase/database";
import { app } from "../firebase";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const db = getDatabase(app);

export default function VerPessoas() {
  const [pessoas, setPessoas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selecionadas, setSelecionadas] = useState([]);
  const [excluindo, setExcluindo] = useState(false);

  useEffect(() => {
    async function fetchPessoas() {
      setLoading(true);
      try {
        const snapshot = await get(ref(db, "pessoas"));
        const lista = Object.entries(snapshot.val() || {}).map(([id, data]) => ({
          id,
          ...data,
        }));
        setPessoas(lista);
      } catch (error) {
        setPessoas([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPessoas();
  }, [excluindo]);

  const handleSelecionar = (id) => {
    setSelecionadas((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSelecionarTodos = () => {
    if (selecionadas.length === pessoas.length) {
      setSelecionadas([]);
    } else {
      setSelecionadas(pessoas.map((p) => p.id));
    }
  };

  const desvincularCartoes = async (pessoaId) => {
    const cartoesSnap = await get(ref(db, "cartoes"));
    if (cartoesSnap.exists()) {
      const cartoes = cartoesSnap.val();
      for (const [uid, dados] of Object.entries(cartoes)) {
        if (dados.pessoaId === pessoaId) {
          await remove(ref(db, `cartoes/${uid}/pessoaId`));
        }
      }
    }
  };

  const excluirSelecionadas = async () => {
    if (selecionadas.length === 0) return;

    const resultado = await Swal.fire({
      title: `Excluir ${selecionadas.length} pessoa(s)?`,
      text: "Essa ação é irreversível.",
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
      for (const id of selecionadas) {
        await remove(ref(db, `pessoas/${id}`));
        await desvincularCartoes(id);
      }
      setSelecionadas([]);
      await Swal.fire({
        title: "Excluídas!",
        text: "Pessoas removidas com sucesso.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        title: "Erro",
        text: "Erro ao excluir pessoas.",
        icon: "error",
      });
    } finally {
      setExcluindo(false);
    }
  };

  const excluirPessoa = async (id) => {
    const resultado = await Swal.fire({
      title: "Excluir esta pessoa?",
      text: "Essa ação não poderá ser desfeita.",
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
      await remove(ref(db, `pessoas/${id}`));
      await desvincularCartoes(id);
      setSelecionadas((prev) => prev.filter((sid) => sid !== id));
      await Swal.fire({
        title: "Excluída!",
        text: "Pessoa removida com sucesso.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        title: "Erro",
        text: "Erro ao excluir pessoa.",
        icon: "error",
      });
    } finally {
      setExcluindo(false);
    }
  };

  if (loading) {
    return <p>Carregando pessoas...</p>;
  }

  return (
    <>
      <HeaderNav />
      <div className="container mt-4">
        <h2 className="fw-semibold text-primary mb-4">Lista de Pessoas</h2>

        <div className="mb-3 d-flex gap-2">
          <input
            type="checkbox"
            checked={selecionadas.length === pessoas.length && pessoas.length > 0}
            onChange={handleSelecionarTodos}
          />
          <span className="me-auto">Selecionar todos</span>
          <button
            className="btn btn-danger btn-sm"
            disabled={selecionadas.length === 0 || excluindo}
            onClick={excluirSelecionadas}
          >
            Excluir selecionadas
          </button>
        </div>

        {pessoas.length === 0 ? (
          <p>Nenhuma pessoa cadastrada.</p>
        ) : (
          <div className="row g-3">
            {pessoas.map((pessoa) => (
              <div className="col-md-6 col-lg-4" key={pessoa.id}>
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <div className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={selecionadas.includes(pessoa.id)}
                        onChange={() => handleSelecionar(pessoa.id)}
                      />
                      <label className="form-check-label">Selecionar</label>
                    </div>
                    <h5 className="card-title mb-1">{pessoa.nome}</h5>
                    <p className="mb-1">
                      <strong>Telefone:</strong> {pessoa.telefone || "—"}
                    </p>
                    <p className="mb-2">
                      <strong>Email:</strong> {pessoa.email || "—"}
                    </p>
                    <div className="d-flex justify-content-between">
                      <Link
                        to={`/editar-pessoa/${pessoa.id}`}
                        className="btn btn-sm btn-outline-primary"
                      >
                        Editar
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => excluirPessoa(pessoa.id)}
                        disabled={excluindo}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
