import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import GestaoCartoes from "./pages/GestaoCartoes";
import HistoricoAcessos from "./pages/HistoricoAcessos";
import CadastrarPessoa from "./pages/CadastrarPessoa";
import VerPessoa from "./pages/VerPessoa";
import VerCartoes from "./pages/VerCartoes";
import AssociarCartao from "./pages/AssociarCartao";
import EditarPessoa from "./pages/EditarPessoa";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gestao" element={<GestaoCartoes />} />
        <Route path="/historico" element={<HistoricoAcessos />} />
        <Route path="/gestao-cartoes" element={<GestaoCartoes />} />
        <Route path="/cadastrar-pessoa" element={<CadastrarPessoa />} />
        <Route path="/ver-pessoa" element={<VerPessoa />} />
        <Route path="/ver-cartoes" element={<VerCartoes />} />
        <Route path="/editar-pessoa/:id" element={<EditarPessoa />} />
        <Route path="/associar-cartao" element={<AssociarCartao />} />
      </Routes>
    </Router>
  );
}

export default App;