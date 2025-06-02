import React, { useState } from "react";
import HeaderNav from "../components/HeaderNav/HeaderNav";
import { getDatabase, ref, push, get, child } from "firebase/database";
import { app } from "../firebase";

const db = getDatabase(app);

export default function CadastrarPessoa() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [mensagem, setMensagem] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    const telefoneLimpo = telefone.replace(/\D/g, "");

    if (!nome.trim() || !email.trim() || !telefone.trim()) {
      setMensagem({ tipo: "error", texto: "Preencha todos os campos." });
      return;
    }

    if (telefoneLimpo.length !== 11) {
      setMensagem({
        tipo: "error",
        texto: "O telefone deve ter exatamente 11 dígitos.",
      });
      return;
    }

    try {
      const snapshot = await get(child(ref(db), "pessoas"));

      let duplicado = false;

      if (snapshot.exists()) {
        const pessoas = snapshot.val();
        for (let key in pessoas) {
          const pessoa = pessoas[key];
          if (
            pessoa.email.trim().toLowerCase() === email.trim().toLowerCase() ||
            pessoa.telefone.replace(/\D/g, "") === telefoneLimpo
          ) {
            duplicado = true;
            break;
          }
        }
      }

      if (duplicado) {
        setMensagem({
          tipo: "error",
          texto: "Já existe uma pessoa com este e-mail ou telefone.",
        });
        return;
      }

      await push(ref(db, "pessoas"), {
        nome,
        email,
        telefone,
        criadoEm: new Date().toISOString(),
      });

      setMensagem({
        tipo: "success",
        texto: "Pessoa cadastrada com sucesso!",
      });
      setNome("");
      setEmail("");
      setTelefone("");
    } catch (error) {
      console.error("Erro ao cadastrar pessoa:", error);
      setMensagem({
        tipo: "error",
        texto: "Erro ao cadastrar pessoa, tente novamente.",
      });
    }
  }

  function formatarTelefone(value) {
    let input = value.replace(/\D/g, "").slice(0, 11); // Apenas números, máximo 11

    if (input.length <= 2) {
      return `(${input}`;
    } else if (input.length <= 7) {
      return `(${input.slice(0, 2)}) ${input.slice(2)}`;
    } else {
      return `(${input.slice(0, 2)}) ${input.slice(2, 7)}-${input.slice(7)}`;
    }
  }

  return (
    <>
      <HeaderNav />

      <div className="container mt-4">
        <h2 className="fw-semibold text-primary mb-4">Cadastrar Nova Pessoa</h2>

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
                  onChange={(e) => setNome(e.target.value)}
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
                  placeholder="(xx) xxxxx-xxxx"
                  value={telefone}
                  onChange={(e) =>
                    setTelefone(formatarTelefone(e.target.value))
                  }
                  required
                />
              </div>

              <button type="submit" className="btn btn-success mt-3">
                Cadastrar
              </button>
            </form>

            {mensagem && (
              <div
                className={`mt-3 alert ${
                  mensagem.tipo === "success"
                    ? "alert-success"
                    : "alert-danger"
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
