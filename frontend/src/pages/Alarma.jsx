import { useState, useEffect } from "react";
import api from "../api/axiosClient";

const MES = [
  "",
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const COLOR_ESTADO = {
  Pagado: "#28a745",
  "Pendiente de pago": "#ffc107",
  "Pago parcial": "#17a2b8",
  "Por facturar": "#6c757d",
  "Bloqueado por morosidad": "#dc3545",
  "Cubierto por anticipado": "#7e57c2",
};

const HOY = new Date();

export default function Alarma() {
  const [mes, setMes] = useState(HOY.getMonth() + 1);
  const [anio, setAnio] = useState(HOY.getFullYear());
  const [clientes, setClientes] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [cargando, setCargando] = useState(true);

  const cargar = async () => {
    try {
      setCargando(true);
      const [list, res] = await Promise.all([
        api.get("/alarma", { params: { mes, anio } }),
        api.get("/alarma/resumen", { params: { mes, anio } }),
      ]);
      setClientes(list.data);
      setResumen(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, [mes, anio]);

  const imprimir = () => window.print();

  return (
    <div style={s.page} className="alarma-imprimible">
      <div className="print-only" style={{ display: "none" }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>
          CableNet S.A. — Reporte de cobro mensual
        </h1>
        <p style={{ margin: "4px 0 16px", fontSize: 13 }}>
          Período: {MES[mes]} {anio} · Generado:{" "}
          {new Date().toLocaleDateString("es-GT")}
        </p>
      </div>
      <div style={s.header} className="no-print">
        <div>
          <h2 style={s.titulo}>Alarma de cobro mensual</h2>
          <p style={s.subtitulo}>
            Clientes a los que les toca pagar en {MES[mes]} {anio}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <select
            style={s.select}
            value={mes}
            onChange={(e) => setMes(Number(e.target.value))}
          >
            {MES.slice(1).map((m, i) => (
              <option key={i + 1} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
          <select
            style={s.select}
            value={anio}
            onChange={(e) => setAnio(Number(e.target.value))}
          >
            {[2024, 2025, 2026, 2027].map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <button style={s.btnImprimir} onClick={imprimir}>
            🖨 Imprimir
          </button>
        </div>
      </div>

      {/* KPIs */}
      {resumen && (
        <div style={s.resumenGrid}>
          <div style={{ ...s.statCard, borderLeft: "4px solid #6c757d" }}>
            <div style={s.statLabel}>Total clientes</div>
            <div style={s.statValor}>{resumen.clientesTotales}</div>
          </div>
          <div style={{ ...s.statCard, borderLeft: "4px solid #28a745" }}>
            <div style={s.statLabel}>Pagados</div>
            <div style={s.statValor}>{resumen.clientesPagados}</div>
          </div>
          <div style={{ ...s.statCard, borderLeft: "4px solid #ffc107" }}>
            <div style={s.statLabel}>Pendientes</div>
            <div style={s.statValor}>
              {resumen.clientesPendientes + resumen.clientesPorFacturar}
            </div>
          </div>
          <div style={{ ...s.statCard, borderLeft: "4px solid #dc3545" }}>
            <div style={s.statLabel}>Bloqueados</div>
            <div style={s.statValor}>{resumen.clientesBloqueados}</div>
          </div>
          <div style={{ ...s.statCard, borderLeft: "4px solid #17a2b8" }}>
            <div style={s.statLabel}>Cobrado</div>
            <div style={{ ...s.statValor, color: "#28a745" }}>
              Q {Number(resumen.montoCobrado).toFixed(2)}
            </div>
          </div>
          <div style={{ ...s.statCard, borderLeft: "4px solid #e94560" }}>
            <div style={s.statLabel}>Pendiente de cobrar</div>
            <div style={{ ...s.statValor, color: "#e94560" }}>
              Q {Number(resumen.montoPendiente).toFixed(2)}
            </div>
          </div>
        </div>
      )}

      {cargando ? (
        <p style={{ color: "#aaa" }}>Cargando...</p>
      ) : clientes.length === 0 ? (
        <div style={s.sinDatos}>
          ✓ No hay clientes pendientes de pago en este período.
        </div>
      ) : (
        <div style={s.tableWrap} className="alarma-imprimible">
          <table style={s.table}>
            <thead>
              <tr>
                {[
                  "Cliente",
                  "Contacto",
                  "Factura",
                  "Monto a pagar",
                  "Saldo",
                  "Estado de cobro",
                  "Días vencido",
                ].map((h) => (
                  <th key={h} style={s.th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr key={c.idCliente} style={s.tr}>
                  <td style={s.td}>
                    <div>
                      <strong>{c.nombre}</strong>
                    </div>
                    <div style={{ fontSize: 12, color: "#aaa" }}>
                      {c.codigo}
                    </div>
                  </td>
                  <td style={s.td}>
                    <div style={{ fontSize: 13 }}>{c.telefono || "—"}</div>
                    <div style={{ fontSize: 12, color: "#aaa" }}>
                      {c.correo || "—"}
                    </div>
                  </td>
                  <td style={s.td}>
                    {c.idFactura ? (
                      <>
                        <div style={{ fontSize: 13 }}>
                          <strong>
                            {c.serie}-{c.numeroFactura}
                          </strong>
                        </div>
                        <div style={{ fontSize: 12, color: "#aaa" }}>
                          {new Date(c.fechaFactura).toLocaleDateString("es-GT")}
                        </div>
                      </>
                    ) : (
                      <span style={{ color: "#aaa", fontStyle: "italic" }}>
                        Sin factura
                      </span>
                    )}
                  </td>
                  <td style={s.td}>
                    <strong>Q {Number(c.montoAPagar).toFixed(2)}</strong>
                    {c.tieneDescuentoPaquete && (
                      <div style={{ fontSize: 11, color: "#28a745" }}>
                        −10% paquete
                      </div>
                    )}
                  </td>
                  <td style={s.td}>
                    {c.saldoPendiente !== null ? (
                      <strong
                        style={{
                          color: c.saldoPendiente > 0 ? "#e94560" : "#28a745",
                        }}
                      >
                        Q {Number(c.saldoPendiente).toFixed(2)}
                      </strong>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td style={s.td}>
                    <span
                      style={{
                        ...s.badge,
                        background: COLOR_ESTADO[c.estadoCobro] || "#6c757d",
                      }}
                    >
                      {c.estadoCobro}
                    </span>
                  </td>
                  <td style={s.td}>
                    {c.diasVencido > 0 ? (
                      <strong style={{ color: "#dc3545" }}>
                        {c.diasVencido} días
                      </strong>
                    ) : (
                      <span style={{ color: "#aaa" }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
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
    marginBottom: 20,
    flexWrap: "wrap",
    gap: 14,
  },
  titulo: { margin: 0, fontSize: 22 },
  subtitulo: { margin: "4px 0 0", fontSize: 13, color: "#aaa" },
  select: {
    background: "#1a1a2e",
    color: "#ccc",
    border: "1px solid #333",
    borderRadius: 6,
    padding: "8px 14px",
    fontSize: 14,
    cursor: "pointer",
  },
  btnImprimir: {
    background: "#0f3460",
    color: "#fff",
    border: "none",
    padding: "8px 18px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 14,
  },
  resumenGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 14,
    marginBottom: 24,
  },
  statCard: { background: "#16213e", borderRadius: 8, padding: 14 },
  statLabel: {
    fontSize: 11,
    color: "#aaa",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  statValor: { fontSize: 22, fontWeight: 700 },
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
    whiteSpace: "nowrap",
  },
};
