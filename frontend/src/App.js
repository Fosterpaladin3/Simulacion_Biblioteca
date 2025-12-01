// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

import Generos from "./components/Generos";
import Usuarios from "./components/Usuarios";
import Autores from "./components/Autores";
import Libros from "./components/Libros";
import Prestamos from "./components/Prestamos";

import "./index.css";

function App() {
  return (
    <Router>
      <div className="app-layout">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div>
            <div className="logo">
              <div className="dot" />
              <div>BibliaApp</div>
            </div>

            <nav className="menu">
              <Link to="/generos">Géneros</Link>
              <Link to="/libros">Libros</Link>
              <Link to="/prestamos">Préstamos</Link>
              <Link to="/usuarios">Usuarios</Link>
              <Link to="/autores">Autores</Link>
            </nav>
          </div>

          <div className="bottom">Cerrar sesión</div>
        </aside>

        {/* CONTENT */}
        <main className="content">
          {/* Header simplified (no finanzas) */}
          <div className="header" style={{ paddingBottom: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <h2 style={{ margin: 0 }}>BibliaApp</h2>
            </div>
            <div /> {/* placeholder to keep space aligned */}
          </div>

          {/* Main area: only render componentes (Generos será ruta por defecto) */}
          <div style={{ marginTop: 18 }}>
            <Switch>
              <Route exact path="/generos" component={Generos} />
              <Route exact path="/libros" component={Libros} />
              <Route exact path="/prestamos" component={Prestamos} />
              <Route exact path="/usuarios" component={Usuarios} />
              <Route exact path="/autores" component={Autores} />
              <Route exact path="/" component={Generos} />
            </Switch>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
