import { useState, useEffect } from "react";
import api from "../api/axiosClient";

const TIPO = { 1: "Internet", 2: "Cable" };
const TIPO_CABLE = { 1: "Básico", 2: "Premium" };
const COLOR_TIPO = { 1: "#0f3460", 2: "#533483" };

const FORM_VACIO = {
  idTipoServicio: 1,
  nombre: "",
  descripcion: "",
  velocidadMbps: 15,
  tipoServicioCable: 1,
  numeroCanales: 100,
  costoBase: "",
};

export default function Servicios() {
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(FORM_VACIO);
  const [guardando, setGuardando] = useState(false);
  const [msgError, setMsgError] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState("");

  const cargar = async () => {
    try {
      setCargando(true);
      const params = filtroTipo ? { tipo: filtroTipo } : {};
      const { data } = await api.get("/servicios", { params });
      setServicios(data);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  };
 
  useEffect(() => {
      cargar();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroTipo]);

  const abrirNuevo = () => {
    setEditando(null);
    setForm(FORM_VACIO);
    setMsgError(null);
    setModal(true);
  };

  const abrirEditar = (s) => {
    setEditando(s.idServicio);
    setForm({
      idTipoServicio: s.idTipoServicio,
      nombre: s.nombre || "",
      descripcion: s.descripcion || "",
      velocidadMbps: s.velocidadMbps || 15,
      tipoServicioCable: s.tipoServicioCable || 1,
      numeroCanales: s.numeroCanales || 100,
      costoBase: s.costoBase || "",
    });
    setMsgError(null);
    setModal(true);
  };

  const cerrar = () => {
    setModal(false);
    setMsgError(null);
  };

  const setF = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));

  const guardar = async () => {
    if (!form.nombre.trim()) {
      setMsgError("El nombre es obligatorio.");
      return;
    }
    if (!form.costoBase || Number(form.costoBase) <= 0) {
      setMsgError("El costo debe ser mayor a cero.");
      return;
    }

    const esInternet = Number(form.idTipoServicio) === 1;

    const payload = {
      idTipoServicio: Number(form.idTipoServicio),
      nombre: form.nombre,
      descripcion: form.descripcion || null,
      velocidadMbps: esInternet ? Number(form.velocidadMbps) : null,
      tipoServicioCable: esInternet ? null : Number(form.tipoServicioCable),
      numeroCanales: esInternet ? null : Number(form.numeroCanales),
      costoBase: Number(form.costoBase),
    };

    setGuardando(true);
    setMsgError(null);
    try {
      if (editando) {
        // En update no se manda idTipoServicio (no se puede cambiar el tipo)
        await api.put(`/servicios/${editando}`, {
          nombre: payload.nombre,
          descripcion: payload.descripcion,
          velocidadMbps: payload.velocidadMbps,
          tipoServicioCable: payload.tipoServicioCable,
          numeroCanales: payload.numeroCanales,
          costoBase: payload.costoBase,
        });
      } else {
        await api.post("/servicios", payload);
      }
      cerrar();
      cargar();
    } catch (e) {
      setMsgError(e.message);
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (id, nombre) => {
    if (!confirm(`¿Eliminar el servicio "${nombre}"?`)) return;
    try {
      await api.delete(`/servicios/${id}`);
      cargar();
    } catch (e) {
      alert(e.message);
    }
  };

  const esInternet = Number(form.idTipoServicio) === 1;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h2 style={s.titulo}>Servicios</h2>
        <div style={{ display: "flex", gap: 10 }}>
          {/* Filtro por tipo */}
          <select
            style={s.select}
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
          >
            <option value="">Todos los tipos</option>
            <option value="1">Internet</option>
            <option value="2">Cable</option>
          </select>
          <button style={s.btnPrimario} onClick={abrirNuevo}>
            + Nuevo servicio
          </button>
        </div>
      </div>

      {error && <div style={s.alerta}>{error}</div>}

      {cargando ? (
        <p style={{ color: "#aaa" }}>Cargando...</p>
      ) : (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>
                {["Nombre", "Tipo", "Detalle", "Costo base", "Acciones"].map(
                  (h) => (
                    <th key={h} style={s.th}>
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {servicios.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{ ...s.td, textAlign: "center", color: "#aaa" }}
                  >
                    No hay servicios registrados
                  </td>
                </tr>
              ) : (
                servicios.map((sv) => (
                  <tr key={sv.idServicio} style={s.tr}>
                    <td style={s.td}>
                      <strong>{sv.nombre}</strong>
                      {sv.descripcion && (
                        <div style={{ fontSize: 12, color: "#aaa" }}>
                          {sv.descripcion}
                        </div>
                      )}
                    </td>
                    <td style={s.td}>
                      <span
                        style={{
                          ...s.badge,
                          background: COLOR_TIPO[sv.idTipoServicio],
                        }}
                      >
                        {TIPO[sv.idTipoServicio]}
                      </span>
                    </td>
                    <td style={s.td}>
                      {sv.idTipoServicio === 1
                        ? `${sv.velocidadMbps} Mbps`
                        : `${TIPO_CABLE[sv.tipoServicioCable]} · ${sv.numeroCanales} canales`}
                    </td>
                    <td style={s.td}>Q {Number(sv.costoBase).toFixed(2)}</td>
                    <td style={s.td}>
                      <button
                        style={s.btnEditar}
                        onClick={() => abrirEditar(sv)}
                      >
                        Editar
                      </button>
                      <button
                        style={s.btnEliminar}
                        onClick={() => eliminar(sv.idServicio, sv.nombre)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Modal ── */}
      {modal && (
        <div style={s.overlay} onClick={cerrar}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={s.modalTitulo}>
              {editando ? "Editar servicio" : "Nuevo servicio"}
            </h3>

            {/* Tipo — solo editable en creación */}
            <div style={s.campo}>
              <label style={s.label}>Tipo de servicio</label>
              <div style={{ display: "flex", gap: 10 }}>
                {[
                  { v: 1, t: "Internet" },
                  { v: 2, t: "Cable" },
                ].map(({ v, t }) => (
                  <button
                    key={v}
                    disabled={!!editando}
                    onClick={() => setF("idTipoServicio", v)}
                    style={{
                      ...s.btnTipo,
                      background:
                        Number(form.idTipoServicio) === v
                          ? COLOR_TIPO[v]
                          : "#1a1a2e",
                      opacity: editando ? 0.6 : 1,
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div style={s.grid2}>
              <div style={{ ...s.campo, gridColumn: "1/-1" }}>
                <label style={s.label}>Nombre *</label>
                <input
                  style={s.input}
                  value={form.nombre}
                  onChange={(e) => setF("nombre", e.target.value)}
                />
              </div>

              <div style={{ ...s.campo, gridColumn: "1/-1" }}>
                <label style={s.label}>Descripción</label>
                <input
                  style={s.input}
                  value={form.descripcion}
                  onChange={(e) => setF("descripcion", e.target.value)}
                />
              </div>

              {/* Campos según tipo */}
              {esInternet ? (
                <div style={s.campo}>
                  <label style={s.label}>Velocidad</label>
                  <select
                    style={s.input}
                    value={form.velocidadMbps}
                    onChange={(e) =>
                      setF("velocidadMbps", Number(e.target.value))
                    }
                  >
                    <option value={15}>15 Mbps</option>
                    <option value={25}>25 Mbps</option>
                    <option value={50}>50 Mbps</option>
                  </select>
                </div>
              ) : (
                <>
                  <div style={s.campo}>
                    <label style={s.label}>Tipo de cable</label>
                    <select
                      style={s.input}
                      value={form.tipoServicioCable}
                      onChange={(e) =>
                        setF("tipoServicioCable", Number(e.target.value))
                      }
                    >
                      <option value={1}>Básico</option>
                      <option value={2}>Premium</option>
                    </select>
                  </div>
                  <div style={s.campo}>
                    <label style={s.label}>Número de canales</label>
                    <input
                      style={s.input}
                      type="number"
                      value={form.numeroCanales}
                      onChange={(e) => setF("numeroCanales", e.target.value)}
                    />
                  </div>
                </>
              )}

              <div style={s.campo}>
                <label style={s.label}>Costo base (Q) *</label>
                <input
                  style={s.input}
                  type="number"
                  step="0.01"
                  value={form.costoBase}
                  onChange={(e) => setF("costoBase", e.target.value)}
                />
              </div>
            </div>

            {msgError && <div style={s.alerta}>{msgError}</div>}

            <div style={s.modalFooter}>
              <button style={s.btnSecundario} onClick={cerrar}>
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

const s = {
  page: { fontFamily: "Segoe UI, sans-serif", color: "#e0e0e0" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  titulo: { margin: 0, fontSize: 22 },
  alerta: {
    background: "#5c1a1a",
    color: "#f88",
    padding: "10px 14px",
    borderRadius: 6,
    marginBottom: 12,
    fontSize: 14,
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
  select: {
    background: "#1a1a2e",
    color: "#ccc",
    border: "1px solid #333",
    borderRadius: 6,
    padding: "7px 12px",
    cursor: "pointer",
  },
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
  btnTipo: {
    color: "#fff",
    border: "1px solid #333",
    padding: "7px 20px",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: 600,
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
    maxWidth: 520,
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
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
};
