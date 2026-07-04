import { useState, useEffect } from "react";
import api from "../api/axiosClient";

export default function Upgrade() {
  const [elegibles, setElegibles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const cargar = async () => {
    try {
      setCargando(true);
      const { data } = await api.get("/upgrade");
      setElegibles(data);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const aplicarTodos = async () => {
    const cantidad = elegibles.filter(
      (e) => e.estadoElegibilidad === "Elegible",
    ).length;
    if (cantidad === 0) {
      alert("No hay clientes elegibles.");
      return;
    }
    if (
      !confirm(
        `Se aplicará upgrade de +5 Mbps a ${cantidad} cliente(s).\n¿Continuar?`,
      )
    )
      return;

    setProcesando(true);
    setMensaje(null);
    try {
      const { data } = await api.post("/upgrade/masivo");
      setMensaje({ tipo: "exito", texto: data.mensaje });
      cargar();
    } catch (e) {
      setMensaje({ tipo: "error", texto: e.message });
    } finally {
      setProcesando(false);
    }
  };

  const aplicarUno = async (idCliente, nombre, velNueva) => {
    if (!confirm(`Aplicar upgrade a ${nombre} → ${velNueva} Mbps?`)) return;
    try {
      const { data } = await api.post(`/upgrade/cliente/${idCliente}`);
      setMensaje({ tipo: "exito", texto: `${nombre}: ${data.mensaje}` });
      cargar();
    } catch (e) {
      setMensaje({ tipo: "error", texto: e.message });
    }
  };

  const elegiblesCount = elegibles.filter(
    (e) => e.estadoElegibilidad === "Elegible",
  ).length;
  const noElegiblesCount = elegibles.filter(
    (e) => e.estadoElegibilidad !== "Elegible",
  ).length;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h2 style={s.titulo}>Upgrade automático de velocidad</h2>
          <p style={s.subtitulo}>
            Clientes con 1+ años pagando a tiempo reciben +5 Mbps automáticos
            (tope 50 Mbps)
          </p>
        </div>
        <button
          style={s.btnPrimario}
          onClick={aplicarTodos}
          disabled={procesando || elegiblesCount === 0}
        >
          {procesando
            ? "Procesando..."
            : `⚡ Aplicar a ${elegiblesCount} clientes`}
        </button>
      </div>

      <div style={s.resumenGrid}>
        <div style={{ ...s.statCard, borderLeft: "4px solid #28a745" }}>
          <div style={s.statLabel}>Elegibles para upgrade</div>
          <div style={s.statValor}>{elegiblesCount}</div>
        </div>
        <div style={{ ...s.statCard, borderLeft: "4px solid #6c757d" }}>
          <div style={s.statLabel}>No elegibles (pagos atrasados)</div>
          <div style={s.statValor}>{noElegiblesCount}</div>
        </div>
      </div>

      {mensaje && (
        <div style={mensaje.tipo === "exito" ? s.exito : s.alerta}>
          {mensaje.texto}
        </div>
      )}

      {error && <div style={s.alerta}>{error}</div>}

      {cargando ? (
        <p style={{ color: "#aaa" }}>Cargando...</p>
      ) : elegibles.length === 0 ? (
        <div style={s.sinDatos}>
          No hay clientes que cumplan al menos 1 año con servicio de Internet.
        </div>
      ) : (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>
                {[
                  "Cliente",
                  "Contratación",
                  "Años cumplidos",
                  "Velocidad actual",
                  "Velocidad nueva",
                  "Facturas a tiempo",
                  "Estado",
                  "Acción",
                ].map((h) => (
                  <th key={h} style={s.th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {elegibles.map((e) => {
                const elegible = e.estadoElegibilidad === "Elegible";
                return (
                  <tr key={e.idCliente} style={s.tr}>
                    <td style={s.td}>
                      <div>
                        <strong>{e.nombre}</strong>
                      </div>
                      <div style={{ fontSize: 12, color: "#aaa" }}>
                        {e.codigo}
                      </div>
                    </td>
                    <td style={s.td}>
                      {new Date(e.fechaContratacion).toLocaleDateString(
                        "es-GT",
                      )}
                    </td>
                    <td style={s.td}>
                      <strong>{e.aniosCompletos}</strong>{" "}
                      {e.aniosCompletos === 1 ? "año" : "años"}
                    </td>
                    <td style={s.td}>{e.velocidadActual} Mbps</td>
                    <td style={s.td}>
                      <strong style={{ color: elegible ? "#28a745" : "#666" }}>
                        {e.velocidadNueva} Mbps
                      </strong>
                    </td>
                    <td style={s.td}>
                      {e.facturasATiempo} / {e.totalFacturas}
                    </td>
                    <td style={s.td}>
                      <span
                        style={{
                          ...s.badge,
                          background: elegible ? "#28a745" : "#6c757d",
                        }}
                      >
                        {e.estadoElegibilidad}
                      </span>
                    </td>
                    <td style={s.td}>
                      {elegible && (
                        <button
                          style={s.btnUpgrade}
                          onClick={() =>
                            aplicarUno(e.idCliente, e.nombre, e.velocidadNueva)
                          }
                        >
                          ⚡ Aplicar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const s = {
  page: { fontFamily: "Segoe UI, sans-serif", color: "#e0e0e0" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  titulo: { margin: 0, fontSize: 22 },
  subtitulo: { margin: "4px 0 0", fontSize: 13, color: "#aaa" },
  resumenGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 16,
    marginBottom: 20,
    maxWidth: 600,
  },
  statCard: { background: "#16213e", borderRadius: 8, padding: 16 },
  statLabel: {
    fontSize: 12,
    color: "#aaa",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  statValor: { fontSize: 24, fontWeight: 700 },
  alerta: {
    background: "#5c1a1a",
    color: "#f88",
    padding: "10px 14px",
    borderRadius: 6,
    marginBottom: 12,
    fontSize: 14,
  },
  exito: {
    background: "#0d3320",
    color: "#28a745",
    padding: "10px 14px",
    borderRadius: 6,
    marginBottom: 12,
    fontSize: 14,
  },
  sinDatos: {
    background: "#16213e",
    color: "#aaa",
    textAlign: "center",
    padding: 30,
    borderRadius: 8,
    fontSize: 14,
    fontStyle: "italic",
  },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 14 },
  th: {
    background: "#1a1a2e",
    color: "#aaa",
    padding: "10px 14px",
    textAlign: "left",
    borderBottom: "1px solid #333",
  },
  tr: { borderBottom: "1px solid #2a2a3e" },
  td: { padding: "10px 14px", verticalAlign: "middle" },
  badge: {
    padding: "3px 10px",
    borderRadius: 12,
    fontSize: 12,
    color: "#fff",
    fontWeight: 600,
  },
  btnPrimario: {
    background: "#28a745",
    color: "#fff",
    border: "none",
    padding: "10px 22px",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
  },
  btnUpgrade: {
    background: "#28a745",
    color: "#fff",
    border: "none",
    padding: "5px 12px",
    borderRadius: 5,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
  },
};
