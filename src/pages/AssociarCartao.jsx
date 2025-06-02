import React, { useEffect, useState } from "react";
import HeaderNav from "../components/HeaderNav/HeaderNav";
import { getDatabase, ref, get, update } from "firebase/database";
import { app } from "../firebase";

const db = getDatabase(app);

export default function AssociarCartao() {
  const [pessoas, setPessoas] = useState([]);
  const [cartoes, setCartoes] = useState([]);
  const [pessoaSelecionada, setPessoaSelecionada] = useState("");
  const [cartaoSelecionado, setCartaoSelecionado] = useState("");
  const [mensagem, setMensagem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const fetchDados = async () => {
      setLoading(true);
      try {
        const pessoasSnap = await get(ref(db, "pessoas"));
        const cartoesSnap = await get(ref(db, "cartoes"));

        const pessoasArray = Object.entries(pessoasSnap.val() || {}).map(
          ([id, data]) => ({ id, ...data })
        );

        const cartoesArray = Object.entries(cartoesSnap.val() || {}).map(
          ([id, data]) => ({ cartaoId: id, ...data })
        );

        setPessoas(pessoasArray);
        setCartoes(cartoesArray);
      } catch (error) {
        setMensagem({ tipo: "error", texto: "Erro ao carregar dados." });
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pessoaSelecionada || !cartaoSelecionado) {
      setMensagem({ tipo: "error", texto: "Selecione pessoa e cartão." });
      return;
    }

    setSalvando(true);
    try {
      await update(ref(db, `pessoas/${pessoaSelecionada}`), {
        cartaoId: cartaoSelecionado,
      });

      await update(ref(db, `cartoes/${cartaoSelecionado}`), {
        pessoaId: pessoaSelecionada,
      });

      setMensagem({ tipo: "success", texto: "Cartão associado com sucesso!" });
      setPessoaSelecionada("");
      setCartaoSelecionado("");
    } catch (error) {
      setMensagem({ tipo: "error", texto: "Erro ao associar cartão." });
    } finally {
      setSalvando(false);
    }
  };

  // Corrigido: agora considera cartões com pessoaId nulo, vazio ou inexistente como disponíveis
  const pessoasDisponiveis = pessoas.filter((p) => !p.cartaoId);
  const cartoesDisponiveis = cartoes.filter((c) => !c.pessoaId?.trim());

  return (
    <>
      <HeaderNav />
      <div className="container mt-4" style={{ maxWidth: "500px" }}>
        <h2 className="fw-semibold text-primary mb-4">
          Associar cartão a pessoa
        </h2>

        {loading ? (
          <p>Carregando dados...</p>
        ) : (
          <form onSubmit={handleSubmit}>
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

            <div className="mb-3">
              <label htmlFor="pessoa" className="form-label">
                Pessoa (sem cartão associado)
              </label>
              <select
                id="pessoa"
                className="form-select"
                value={pessoaSelecionada}
                onChange={(e) => setPessoaSelecionada(e.target.value)}
              >
                <option value="">Selecione a pessoa</option>
                {pessoasDisponiveis.map((pessoa) => (
                  <option key={pessoa.id} value={pessoa.id}>
                    {pessoa.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="cartao" className="form-label">
                Cartão RFID (não vinculado)
              </label>
              <select
                id="cartao"
                className="form-select"
                value={cartaoSelecionado}
                onChange={(e) => setCartaoSelecionado(e.target.value)}
              >
                <option value="">Selecione o cartão</option>
                {cartoesDisponiveis.map((cartao) => (
                  <option key={cartao.cartaoId} value={cartao.cartaoId}>
                    {cartao.cartaoId}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={salvando}
            >
              {salvando ? "Associando..." : "Associar"}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
