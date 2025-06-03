import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import GestaoCartoes from "./pages/GestaoCartoes";
import HistoricoAcessos from "./pages/HistoricoAcessos";
import CadastrarPessoa from "./pages/CadastrarPessoa";
import VerPessoa from "./pages/VerPessoa";
import VerCartoes from "./pages/VerCartoes";
import AssociarCartao from "./pages/AssociarCartao";
import EditarPessoa from "./pages/EditarPessoa";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRouse/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/gestao" element={<PrivateRoute><GestaoCartoes /></PrivateRoute>} />
        <Route path="/historico" element={<PrivateRoute><HistoricoAcessos /></PrivateRoute>} />
        <Route path="/gestao-cartoes" element={<PrivateRoute><GestaoCartoes /></PrivateRoute>} />
        <Route path="/cadastrar-pessoa" element={<PrivateRoute><CadastrarPessoa /></PrivateRoute>} />
        <Route path="/ver-pessoa" element={<PrivateRoute><VerPessoa /></PrivateRoute>} />
        <Route path="/ver-cartoes" element={<PrivateRoute><VerCartoes /></PrivateRoute>} />
        <Route path="/editar-pessoa/:id" element={<PrivateRoute><EditarPessoa /></PrivateRoute>} />
        <Route path="/associar-cartao" element={<PrivateRoute><AssociarCartao /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
