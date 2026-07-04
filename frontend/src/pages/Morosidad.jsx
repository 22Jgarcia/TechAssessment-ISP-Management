import { useState, useEffect } from "react";
import api from "../api/axiosClient";

const COLOR_ACCION = {
  Suspender: "#dc3545",
  Alerta: "#ffc107",
  "Al día": "#28a745",
};

const MES = [
  "",
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

export default function Morosidad() {
  const [morosos, setMorosos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  // ── Cargar morosos ────────────────────────────────────────
  const cargar = async () => {
    try {
      setCargando(true);
      const { data } = await api.get("/morosidad");
      setMorosos(data);
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

  // ── Aplicar suspensión masiva ─────────────────────────────
  const aplicarSuspension = async () => {
    const cantidad = morosos.filter(
      (m) => m.accionRequerida === "Suspender",
    ).length;
    if (cantidad === 0) {
      alert("No hay clientes que requieran suspensión.");
      return;
    }
    if (
      !confirm(
        `Se van a suspender ${cantidad} cliente(s) con 3 o más meses sin pagar.\n` +
          `Esto bloqueará sus facturas y suspenderá sus servicios.\n\n¿Continuar?`,
      )
    )
      return;

    setProcesando(true);
    setMensaje(null);
    try {
      const { data } = await api.post("/morosidad/suspender");
      setMensaje({ tipo: "exito", texto: data.mensaje });
      cargar();
    } catch (e) {
      setMensaje({ tipo: "error", texto: e.message });
    } finally {
      setProcesando(false);
    }
  };

  // ── Reactivar cliente individual ──────────────────────────
  const reactivar = async (idCliente, nombre) => {
    if (
      !confirm(
        `¿Reactivar al cliente "${nombre}"?\n` +
          `Solo se permite si ya pagó todas sus deudas.`,
      )
    )
      return;
    try {
      const { data } = await api.post(`/morosidad/reactivar/${idCliente}`);
      setMensaje({ tipo: "exito", texto: data.mensaje });
      cargar();
    } catch (e) {
      setMensaje({ tipo: "error", texto: e.message });
    }
  };

  // ── Resumen del banner ────────────────────────────────────
  const totalSuspender = morosos.filter(
    (m) => m.accionRequerida === "Suspender",
  ).length;
  const totalAlerta = morosos.filter(
    (m) => m.accionRequerida === "Alerta",
  ).length;
  const totalDeuda = morosos.reduce((sum, m) => sum + Number(m.deudaTotal), 0);

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h2 style={s.titulo}>Control de morosidad</h2>
          <p style={s.subtitulo}>
            Clientes con facturas pendientes anteriores al mes actual
          </p>
        </div>
        <button
          style={s.btnSuspender}
          onClick={aplicarSuspension}
          disabled={procesando || totalSuspender === 0}
        >
          {procesando
            ? "Procesando..."
            : `⚠ Suspender ${totalSuspender} cliente${totalSuspender === 1 ? "" : "s"}`}
        </button>
      </div>

      {/* Resumen visual */}
      <div style={s.resumenGrid}>
        <div style={{ ...s.statCard, borderLeft: "4px solid #dc3545" }}>
          <div style={s.statLabel}>Para suspender (3+ meses)</div>
          <div style={s.statValor}>{totalSuspender}</div>
        </div>
        <div style={{ ...s.statCard, borderLeft: "4px solid #ffc107" }}>
          <div style={s.statLabel}>En alerta (2 meses)</div>
          <div style={s.statValor}>{totalAlerta}</div>
        </div>
        <div style={{ ...s.statCard, borderLeft: "4px solid #e94560" }}>
          <div style={s.statLabel}>Deuda total acumulada</div>
          <div style={s.statValor}>Q {totalDeuda.toFixed(2)}</div>
        </div>
      </div>

      {/* Mensaje de resultado */}
      {mensaje && (
        <div style={mensaje.tipo === "exito" ? s.exitoMsg : s.alerta}>
          {mensaje.texto}
        </div>
      )}

      {error && <div style={s.alerta}>{error}</div>}

      {cargando ? (
        <p style={{ color: "#aaa" }}>Cargando...</p>
      ) : morosos.length === 0 ? (
        <div style={s.sinDatos}>✓ No hay clientes morosos en este momento.</div>
      ) : (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>
                {[
                  "Cliente",
                  "Contacto",
                  "Meses adeudados",
                  "Período",
                  "Deuda total",
                  "Acción requerida",
                  "Estado actual",
                  "Operaciones",
                ].map((h) => (
                  <th key={h} style={s.th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {morosos.map((m) => {
                const primerMes = new Date(m.primerMesDeuda);
                const ultimoMes = new Date(m.ultimoMesDeuda);
                return (
                  <tr key={m.idCliente} style={s.tr}>
                    <td style={s.td}>
                      <div>
                        <strong>{m.nombre}</strong>
                      </div>
                      <div style={{ fontSize: 12, color: "#aaa" }}>
                        {m.codigo}
                      </div>
                    </td>
                    <td style={s.td}>
                      <div style={{ fontSize: 13 }}>{m.telefono || "—"}</div>
                      <div style={{ fontSize: 12, color: "#aaa" }}>
                        {m.correo || "—"}
                      </div>
                    </td>
                    <td style={s.td}>
                      <span
                        style={{
                          ...s.contadorMeses,
                          background:
                            m.mesesAdeudados >= 3 ? "#dc3545" : "#ffc107",
                        }}
                      >
                        {m.mesesAdeudados}{" "}
                        {m.mesesAdeudados === 1 ? "mes" : "meses"}
                      </span>
                    </td>
                    <td style={s.td}>
                      <div style={{ fontSize: 13 }}>
                        {MES[primerMes.getMonth() + 1]}{" "}
                        {primerMes.getFullYear()}
                      </div>
                      <div style={{ fontSize: 12, color: "#aaa" }}>
                        a {MES[ultimoMes.getMonth() + 1]}{" "}
                        {ultimoMes.getFullYear()}
                      </div>
                    </td>
                    <td style={s.td}>
                      <strong style={{ color: "#e94560" }}>
                        Q {Number(m.deudaTotal).toFixed(2)}
                      </strong>
                    </td>
                    <td style={s.td}>
                      <span
                        style={{
                          ...s.badge,
                          background: COLOR_ACCION[m.accionRequerida],
                        }}
                      >
                        {m.accionRequerida}
                      </span>
                    </td>
                    <td style={s.td}>
                      <span style={{ fontSize: 13, color: "#aaa" }}>
                        {m.estadoActual}
                      </span>
                    </td>
                    <td style={s.td}>
                      {m.estadoActual === "Suspendido" && (
                        <button
                          style={s.btnReactivar}
                          onClick={() => reactivar(m.idCliente, m.nombre)}
                        >
                          Reactivar
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
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 16,
    marginBottom: 20,
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
  exitoMsg: {
    background: "#0d3320",
    color: "#28a745",
    padding: "10px 14px",
    borderRadius: 6,
    marginBottom: 12,
    fontSize: 14,
  },
  sinDatos: {
    background: "#0d3320",
    color: "#28a745",
    textAlign: "center",
    padding: 30,
    borderRadius: 8,
    fontSize: 16,
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
  contadorMeses: {
    padding: "4px 10px",
    borderRadius: 6,
    fontSize: 13,
    color: "#fff",
    fontWeight: 700,
    display: "inline-block",
  },
  btnSuspender: {
    background: "#dc3545",
    color: "#fff",
    border: "none",
    padding: "10px 22px",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
  },
  btnReactivar: {
    background: "#28a745",
    color: "#fff",
    border: "none",
    padding: "5px 12px",
    borderRadius: 5,
    cursor: "pointer",
    fontSize: 13,
  },
};
