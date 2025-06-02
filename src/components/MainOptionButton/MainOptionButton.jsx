import { Link } from "react-router-dom";
function MainOptionButton({ icon, text, link }) {
  return (
    <Link
      to={link}
      class="card text-bg-primary text-center mb-3"
      style={{
        maxWidth: "58rem",
        minWidth: "200px",
        cursor: "pointer",
        textDecoration: "none",
      }}
    >
      <h6 class="card-header">{text}</h6>
      <i className={icon} style={{ fontSize: "60px" }}></i>
    </Link>
  );
}

export default MainOptionButton;
