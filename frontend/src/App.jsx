import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Clientes from "./pages/Clientes";
import Servicios from "./pages/Servicios";
import Asignaciones from "./pages/Asignaciones";
import Facturas from "./pages/Facturas";
import Morosidad from "./pages/Morosidad";
import Upgrade from "./pages/Upgrade";
import Alarma from "./pages/Alarma";
import Nomina from "./pages/Nomina";

export default function App() {
  return (
    <BrowserRouter>
      <nav style={styles.nav}>
        <span style={styles.brand}>CableNet</span>
        <NavLink to="/clientes" style={navStyle}>
          Clientes
        </NavLink>
        <NavLink to="/servicios" style={navStyle}>
          Servicios
        </NavLink>
        <NavLink to="/asignaciones" style={navStyle}>
          Asignaciones
        </NavLink>
        <NavLink to="/facturas" style={navStyle}>
          Facturas
        </NavLink>
        <NavLink to="/morosidad" style={navStyle}>
          Morosidad
        </NavLink>
        <NavLink to="/upgrade" style={navStyle}>
          Upgrade
        </NavLink>
        <NavLink to="/alarma" style={navStyle}>
          Alarma
        </NavLink>
        <NavLink to="/nomina" style={navStyle}>
          Nomina
        </NavLink>
      </nav>

      <main style={styles.main}>
        <Routes>
          <Route path="/" element={<Clientes />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/asignaciones" element={<Asignaciones />} />
          <Route path="/facturas" element={<Facturas />} />
          <Route path="/morosidad" element={<Morosidad />} />
          <Route path="/upgrade" element={<Upgrade />} />
          <Route path="/alarma" element={<Alarma />} />
          <Route path="/nomina" element={<Nomina />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
const navStyle = ({ isActive }) => ({
  color: isActive ? "#fff" : "#ccc",
  textDecoration: "none",
  marginLeft: 20,
  fontWeight: isActive ? "bold" : "normal",
});

const styles = {
  nav: {
    background: "#1a1a2e",
    padding: "12px 24px",
    display: "flex",
    alignItems: "center",
  },
  brand: {
    color: "#e94560",
    fontWeight: "bold",
    fontSize: 20,
    marginRight: 20,
  },
  main: { padding: 24 },
};
