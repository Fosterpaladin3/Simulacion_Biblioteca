import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Generos from "./components/Generos";
import Usuarios from "./components/Usuarios";
import Autores from "./components/Autores";
import Libros from "./components/Libros";
import Prestamos from "./components/Prestamos";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/Generos">Generos</Link> |
        <Link to="/usuarios">Usuarios</Link> |
        <Link to="/autores">Autores</Link> |
        <Link to="/libros">Libros</Link> |
        <Link to="/prestamos">Prestamos</Link> |
      </nav>

      <Routes>
        <Route path="/generos" element={<Generos />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/autores" element={<Autores />} />
        <Route path="/libros" element={<Libros />} />
        <Route path="/prestamos" element={<Prestamos />} />
      </Routes>
    </Router>
  );
}

export default App;