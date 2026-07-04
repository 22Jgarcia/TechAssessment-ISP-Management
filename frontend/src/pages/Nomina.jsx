import { useState, useEffect } from "react";
import api from "../api/axiosClient";

const FORM_VACIO = {
  codigo: "",
  nombres: "",
  apellidos: "",
  dpi: "",
  idTipoPuesto: 1,
  salarioBase: "",
  fechaIngreso: "",
};

const PUESTOS = [
  { id: 1, n: "Secretaria" },
  { id: 2, n: "Instalador" },
  { id: 3, n: "Técnico" },
  { id: 4, n: "Guardia" },
  { id: 5, n: "Administrador" },
];

export default function Nomina() {
  const [tab, setTab] = useState("nomina"); // 'nomina' | 'empleados'
  const [nomina, setNomina] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(FORM_VACIO);
  const [guardando, setGuardando] = useState(false);
  const [msgError, setMsgError] = useState(null);

  const cargar = async () => {
    try {
      setCargando(true);
      const [n, e] = await Promise.all([
        api.get("/nomina/calcular"),
        api.get("/nomina/empleados"),
      ]);
      setNomina(n.data);
      setEmpleados(e.data);
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const abrirNuevo = () => {
    setEditando(null);
    setForm(FORM_VACIO);
    setMsgError(null);
    setModal(true);
  };

  const abrirEditar = (e) => {
    setEditando(e.idEmpleado);
    setForm({
      codigo: e.codigo,
      nombres: e.nombres,
      apellidos: e.apellidos,
      dpi: e.dpi || "",
      idTipoPuesto: e.idTipoPuesto,
      salarioBase: e.salarioBase,
      fechaIngreso: e.fechaIngreso?.substring(0, 10) || "",
    });
    setMsgError(null);
    setModal(true);
  };

  const guardar = async () => {
    setGuardando(true);
    setMsgError(null);
    try {
      const payload = {
        codigo: form.codigo,
        nombres: form.nombres,
        apellidos: form.apellidos,
        dpi: form.dpi || null,
        idTipoPuesto: Number(form.idTipoPuesto),
        salarioBase: Number(form.salarioBase),
        fechaIngreso: form.fechaIngreso,
      };
      if (editando) {
        await api.put(`/nomina/empleados/${editando}`, {
          nombres: payload.nombres,
          apellidos: payload.apellidos,
          dpi: payload.dpi,
          idTipoPuesto: payload.idTipoPuesto,
          salarioBase: payload.salarioBase,
        });
      } else {
        await api.post("/nomina/empleados", payload);
      }
      setModal(false);
      cargar();
    } catch (e) {
      setMsgError(e.message);
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (id, nombre) => {
    if (!confirm(`¿Eliminar al empleado ${nombre}?`)) return;
    try {
      await api.delete(`/nomina/empleados/${id}`);
      cargar();
    } catch (e) {
      alert(e.message);
    }
  };

  const totalNomina = nomina.reduce((a, n) => a + Number(n.liquidoAPagar), 0);
  const totalIGSS = nomina.reduce((a, n) => a + Number(n.cuotaIGSS), 0);
  const totalISR = nomina.reduce((a, n) => a + Number(n.retencionISR), 0);
  const totalPasivo = nomina.reduce(
    (a, n) => a + Number(n.pasivoLaboralMensual),
    0,
  );

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h2 style={s.titulo}>Nómina</h2>
          <p style={s.subtitulo}>
            Pago mensual de empleados con IGSS, ISR y pasivo laboral
          </p>
        </div>
        {tab === "empleados" && (
          <button style={s.btnPrimario} onClick={abrirNuevo}>
            + Nuevo empleado
          </button>
        )}
      </div>

      {/* Tabs */}
      <div style={s.tabs}>
        <button
          style={tab === "nomina" ? s.tabActivo : s.tab}
          onClick={() => setTab("nomina")}
        >
          📊 Nómina del mes
        </button>
        <button
          style={tab === "empleados" ? s.tabActivo : s.tab}
          onClick={() => setTab("empleados")}
        >
          👥 Empleados
        </button>
      </div>

      {/* TAB NÓMINA */}
      {tab === "nomina" && (
        <>
          <div style={s.resumenGrid}>
            <div style={{ ...s.statCard, borderLeft: "4px solid #28a745" }}>
              <div style={s.statLabel}>Líquido a pagar</div>
              <div style={s.statValor}>Q {totalNomina.toFixed(2)}</div>
            </div>
            <div style={{ ...s.statCard, borderLeft: "4px solid #17a2b8" }}>
              <div style={s.statLabel}>Cuota IGSS</div>
              <div style={s.statValor}>Q {totalIGSS.toFixed(2)}</div>
            </div>
            <div style={{ ...s.statCard, borderLeft: "4px solid #ffc107" }}>
              <div style={s.statLabel}>Retención ISR</div>
              <div style={s.statValor}>Q {totalISR.toFixed(2)}</div>
            </div>
            <div style={{ ...s.statCard, borderLeft: "4px solid #7e57c2" }}>
              <div style={s.statLabel}>Pasivo laboral</div>
              <div style={s.statValor}>Q {totalPasivo.toFixed(2)}</div>
            </div>
          </div>

          {cargando ? (
            <p style={{ color: "#aaa" }}>Cargando...</p>
          ) : (
            <div style={s.tableWrap}>
              <table style={s.table}>
                <thead>
                  <tr>
                    {[
                      "Empleado",
                      "Puesto",
                      "Salario",
                      "Bonif.",
                      "Total dev.",
                      "IGSS",
                      "ISR",
                      "Pasivo lab.",
                      "Líquido a pagar",
                    ].map((h) => (
                      <th key={h} style={s.th}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {nomina.map((n) => (
                    <tr key={n.idEmpleado} style={s.tr}>
                      <td style={s.td}>
                        <div>
                          <strong>{n.nombreCompleto}</strong>
                        </div>
                        <div style={{ fontSize: 12, color: "#aaa" }}>
                          {n.codigo}
                        </div>
                      </td>
                      <td style={s.td}>{n.puesto}</td>
                      <td style={s.td}>Q {Number(n.salarioBase).toFixed(2)}</td>
                      <td style={s.td}>
                        Q {Number(n.bonificacion).toFixed(2)}
                      </td>
                      <td style={s.td}>
                        Q {Number(n.totalDevengado).toFixed(2)}
                      </td>
                      <td style={s.td}>
                        <span style={{ color: "#17a2b8" }}>
                          − Q {Number(n.cuotaIGSS).toFixed(2)}
                        </span>
                      </td>
                      <td style={s.td}>
                        <span style={{ color: "#ffc107" }}>
                          − Q {Number(n.retencionISR).toFixed(2)}
                        </span>
                      </td>
                      <td style={s.td}>
                        <span style={{ color: "#7e57c2", fontSize: 12 }}>
                          Q {Number(n.pasivoLaboralMensual).toFixed(2)}
                        </span>
                      </td>
                      <td style={s.td}>
                        <strong style={{ color: "#28a745", fontSize: 15 }}>
                          Q {Number(n.liquidoAPagar).toFixed(2)}
                        </strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* TAB EMPLEADOS */}
      {tab === "empleados" &&
        (cargando ? (
          <p style={{ color: "#aaa" }}>Cargando...</p>
        ) : (
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr>
                  {[
                    "Código",
                    "Nombre",
                    "DPI",
                    "Puesto",
                    "Salario base",
                    "Ingreso",
                    "Acciones",
                  ].map((h) => (
                    <th key={h} style={s.th}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {empleados.map((e) => (
                  <tr key={e.idEmpleado} style={s.tr}>
                    <td style={s.td}>{e.codigo}</td>
                    <td style={s.td}>
                      {e.nombres} {e.apellidos}
                    </td>
                    <td style={s.td}>{e.dpi || "—"}</td>
                    <td style={s.td}>{e.nombrePuesto}</td>
                    <td style={s.td}>Q {Number(e.salarioBase).toFixed(2)}</td>
                    <td style={s.td}>
                      {new Date(e.fechaIngreso).toLocaleDateString("es-GT")}
                    </td>
                    <td style={s.td}>
                      <button
                        style={s.btnEditar}
                        onClick={() => abrirEditar(e)}
                      >
                        Editar
                      </button>
                      <button
                        style={s.btnEliminar}
                        onClick={() =>
                          eliminar(e.idEmpleado, `${e.nombres} ${e.apellidos}`)
                        }
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

      {/* Modal */}
      {modal && (
        <div style={s.overlay} onClick={() => setModal(false)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={s.modalTitulo}>
              {editando ? "Editar empleado" : "Nuevo empleado"}
            </h3>

            <div style={s.grid2}>
              <Campo
                label="Código *"
                disabled={!!editando}
                value={form.codigo}
                onChange={(v) => setForm({ ...form, codigo: v })}
              />
              <Campo
                label="DPI"
                value={form.dpi}
                onChange={(v) => setForm({ ...form, dpi: v })}
              />
              <Campo
                label="Nombres *"
                value={form.nombres}
                onChange={(v) => setForm({ ...form, nombres: v })}
              />
              <Campo
                label="Apellidos *"
                value={form.apellidos}
                onChange={(v) => setForm({ ...form, apellidos: v })}
              />
              <div style={s.campo}>
                <label style={s.label}>Puesto</label>
                <select
                  style={s.input}
                  value={form.idTipoPuesto}
                  onChange={(e) =>
                    setForm({ ...form, idTipoPuesto: e.target.value })
                  }
                >
                  {PUESTOS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.n}
                    </option>
                  ))}
                </select>
              </div>
              <Campo
                label="Salario base *"
                type="number"
                value={form.salarioBase}
                onChange={(v) => setForm({ ...form, salarioBase: v })}
              />
              <Campo
                label="Fecha ingreso *"
                type="date"
                value={form.fechaIngreso}
                onChange={(v) => setForm({ ...form, fechaIngreso: v })}
                disabled={!!editando}
              />
            </div>

            {msgError && <div style={s.alerta}>{msgError}</div>}

            <div style={s.modalFooter}>
              <button style={s.btnSecundario} onClick={() => setModal(false)}>
                Cancelar
              </button>
              <button
                style={s.btnPrimario}
                onClick={guardar}
                disabled={guardando}
              >
                {guardando ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Campo({ label, value, onChange, type = "text", disabled = false }) {
  return (
    <div style={s.campo}>
      <label style={s.label}>{label}</label>
      <input
        style={{ ...s.input, opacity: disabled ? 0.6 : 1 }}
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

const s = {
  page: { fontFamily: "Segoe UI, sans-serif", color: "#e0e0e0" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  titulo: { margin: 0, fontSize: 22 },
  subtitulo: { margin: "4px 0 0", fontSize: 13, color: "#aaa" },
  tabs: {
    display: "flex",
    gap: 4,
    borderBottom: "1px solid #333",
    marginBottom: 20,
  },
  tab: {
    background: "transparent",
    color: "#aaa",
    border: "none",
    padding: "10px 18px",
    cursor: "pointer",
    fontSize: 14,
    borderBottom: "2px solid transparent",
  },
  tabActivo: {
    background: "transparent",
    color: "#e94560",
    border: "none",
    padding: "10px 18px",
    cursor: "pointer",
    fontSize: 14,
    borderBottom: "2px solid #e94560",
    fontWeight: 600,
  },
  resumenGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 14,
    marginBottom: 20,
  },
  statCard: { background: "#16213e", borderRadius: 8, padding: 14 },
  statLabel: {
    fontSize: 11,
    color: "#aaa",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  statValor: { fontSize: 20, fontWeight: 700 },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th: {
    background: "#1a1a2e",
    color: "#aaa",
    padding: "10px 14px",
    textAlign: "left",
    borderBottom: "1px solid #333",
  },
  tr: { borderBottom: "1px solid #2a2a3e" },
  td: { padding: "10px 14px", verticalAlign: "middle" },
  btnPrimario: {
    background: "#e94560",
    color: "#fff",
    border: "none",
    padding: "8px 18px",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: 600,
  },
  btnSecundario: {
    background: "#333",
    color: "#ccc",
    border: "none",
    padding: "8px 18px",
    borderRadius: 6,
    cursor: "pointer",
  },
  btnEditar: {
    background: "#0f3460",
    color: "#fff",
    border: "none",
    padding: "5px 12px",
    borderRadius: 5,
    cursor: "pointer",
    marginRight: 6,
    fontSize: 13,
  },
  btnEliminar: {
    background: "#5c1a1a",
    color: "#f88",
    border: "none",
    padding: "5px 12px",
    borderRadius: 5,
    cursor: "pointer",
    fontSize: 13,
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  modal: {
    background: "#16213e",
    borderRadius: 10,
    padding: 28,
    width: "100%",
    maxWidth: 560,
  },
  modalTitulo: { margin: "0 0 20px", fontSize: 18 },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 20,
  },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" },
  campo: { marginBottom: 14 },
  label: { display: "block", fontSize: 12, color: "#aaa", marginBottom: 4 },
  input: {
    width: "100%",
    boxSizing: "border-box",
    background: "#0f3460",
    border: "1px solid #333",
    borderRadius: 5,
    padding: "7px 10px",
    color: "#fff",
    fontSize: 14,
  },
  alerta: {
    background: "#5c1a1a",
    color: "#f88",
    padding: "10px 14px",
    borderRadius: 6,
    marginBottom: 12,
    fontSize: 14,
  },
};
