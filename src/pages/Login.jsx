import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import "../assets/css/login.css";
import "../assets/css/minimal.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !senha) {
      setErro("Preencha todos os campos.");
      return;
    }

    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      navigate("/"); // Redirecionar para a home após login
    } catch (error) {
      setErro("Email ou senha inválidos.");
    }
  };

  return (
    <div className="container">
      <div className="container-login">
        <div className="wrap-login">
          <form className="login-form" onSubmit={handleLogin}>
            <span className="login-form-title">Faça o login</span>

            <div className="wrap-input margin-top-35 margin-bottom-35">
              <input
                className={`input-form ${email ? "has-val" : ""}`}
                type="text"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
                placeholder=" "
              />
              <span className="focus-input-form" data-placeholder="E-mail"></span>
            </div>

            <div className="wrap-input margin-bottom-35">
              <input
                className={`input-form ${senha ? "has-val" : ""}`}
                type="password"
                name="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder=" "
              />
              <span className="focus-input-form" data-placeholder="Senha"></span>
            </div>

            {erro && (
              <div style={{ color: "red", marginBottom: "10px", textAlign: "center" }}>
                {erro}
              </div>
            )}

            <div className="container-login-form-btn">
              <button className="login-form-btn" type="submit">Login</button>
            </div>

            <ul className="login-utils">
              <li className="margin-top-8 margin-bottom-8">
                <span className="text1">Esqueceu sua </span>
                <button
                  type="button"
                  className="text2"
                  onClick={() => alert("Funcionalidade ainda não implementada")}
                >
                  senha?
                </button>
              </li>
              <li>
                <span className="text1">Não tem conta? </span>
                <Link to="/criar-conta" className="text2">Criar</Link>
              </li>
            </ul>
          </form>
        </div>

        <img
          src="/img/Login.png"
          alt="Login"
          width="300"
          height="300"
          className="margin-left-50"
        />
      </div>
    </div>
  );
}
