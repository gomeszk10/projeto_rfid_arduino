import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/img/logo.png";

export default function HeaderNav() {
  const navigate = useNavigate();

  return (
    <nav
      className="navbar"
      style={{
        margin: "12px 0px",
        backgroundColor: "#f8f9fa",
        borderRadius: "5px",
        border: "1px solid #dee2e6",
      }}
    >
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          <img
            src={logo}
            alt="Logo"
            width="46"
            height="34"
            style={{ marginRight: "10px" }}
          />
          RFID Access
        </Link>
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={() => navigate("/gestao")}
        >
          Voltar
        </button>
      </div>
    </nav>
  );
}