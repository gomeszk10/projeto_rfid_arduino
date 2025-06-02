import React, { useEffect, useState } from "react";
import HeaderNav from "../components/HeaderNav/HeaderNav";
import { useParams, useNavigate } from "react-router-dom";
import { getDatabase, ref, get, update } from "firebase/database";
import { app } from "../firebase";

const db = getDatabase(app);

export default function EditarPessoa() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [mensagem, setMensagem] = useState(null);

  useEffect(() => {
    async function fetchPessoa() {
      try {
        const snapshot = await get(ref(db, `pessoas/${id}`));
        if (snapshot.exists()) {
          const data = snapshot.val();
          setNome(data.nome || "");
          setEmail(data.email || "");
          setTelefone(data.telefone || "");
        }
      } catch (error) {
        setMensagem({ tipo: "erro", texto: "Erro ao carregar dados da pessoa." });
      }
    }
    fetchPessoa();
  }, [id]);

  // Apenas letras e espaços para o nome
  const handleNomeChange = (e) => {
    const value = e.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, "");
    setNome(value);
  };

  // Máscara para telefone (DD)XXXXX-XXXX
  const handleTelefoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 11);
    if (value.length > 2) value = `(${value.slice(0, 2)})${value.slice(2)}`;
    if (value.length > 9) value = `${value.slice(0, 9)}-${value.slice(9)}`;
    setTelefone(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação do nome (apenas letras e pelo menos 2 caracteres)
    if (!/^[A-Za-zÀ-ÿ\s]{2,}$/.test(nome)) {
      setMensagem({ tipo: "erro", texto: "Nome inválido. Use apenas letras." });
      return;
    }

    // Validação do email
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email)) {
      setMensagem({ tipo: "erro", texto: "Email inválido." });
      return;
    }

    // Validação do telefone (11 dígitos)
    const telefoneNumeros = telefone.replace(/\D/g, "");
    if (telefoneNumeros.length !== 11) {
      setMensagem({ tipo: "erro", texto: "Telefone deve conter 11 números (incluindo DDD)." });
      return;
    }

    try {
      await update(ref(db, `pessoas/${id}`), {
        nome,
        email,
        telefone,
      });
      setMensagem({ tipo: "sucesso", texto: "Pessoa atualizada com sucesso!" });
      setTimeout(() => navigate("/ver-pessoa"), 1200);
    } catch (error) {
      setMensagem({ tipo: "erro", texto: "Erro ao atualizar pessoa." });
    }
  };

  return (
    <>
      <HeaderNav />

      <div className="container mt-4">
        <h2 className="fw-semibold text-primary mb-4">Editar Pessoa</h2>

        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="nome" className="form-label">
                  Nome completo
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="nome"
                  placeholder="Digite o nome"
                  value={nome}
                  onChange={handleNomeChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Digite o email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="telefone" className="form-label">
                  Telefone
                </label>
                <input
                  type="tel"
                  className="form-control"
                  id="telefone"
                  placeholder="(xx)xxxxx-xxxx"
                  value={telefone}
                  onChange={handleTelefoneChange}
                  maxLength={14}
                  required
                />
              </div>

              <button type="submit" className="btn btn-success mt-3">
                Salvar
              </button>
            </form>

            {mensagem && (
              <div
                className={`mt-3 alert ${
                  mensagem.tipo === "sucesso" ? "alert-success" : "alert-danger"
                }`}
                role="alert"
              >
                {mensagem.texto}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}