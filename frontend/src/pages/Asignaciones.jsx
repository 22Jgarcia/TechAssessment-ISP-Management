import { useState, useEffect } from "react";
import api from "../api/axiosClient";

export default function Asignaciones() {
  const [clientes, setClientes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [cobertura, setCobertura] = useState(null);
  const [clienteId, setClienteId] = useState("");
  const [cargando, setCargando] = useState(false);
  const [modal, setModal] = useState(null); // 'internet' | 'cable' | null
  const [form, setForm] = useState({
    idServicio: "",
    direccionInstalacion: "",
  });
  const [guardando, setGuardando] = useState(false);
  const [msgError, setMsgError] = useState(null);

  // ── Cargar clientes al montar ─────────────────────────────
  useEffect(() => {
    api
      .get("/clientes")
      .then((r) => setClientes(r.data))
      .catch(() => {});
  }, []);

  // ── Cargar resumen cuando cambia el cliente ───────────────
  useEffect(() => {
    if (!clienteId) {
      setResumen(null);
      return;
    }
    cargarResumen(clienteId);
  }, [clienteId]);

  const cargarResumen = async (id) => {
    setCargando(true);
    try {
      const { data } = await api.get(`/clientes/${id}/servicios`);
      setResumen(data);
      const cob = await api.get(`/facturas/cobertura/${id}`);
      setCobertura(cob.data);
    } catch {
      setResumen(null);
    } finally {
      setCargando(false);
    }
  };

  // ── Abrir modal de asignación ─────────────────────────────
  const abrirModal = async (tipo) => {
    setMsgError(null);
    setForm({ idServicio: "", direccionInstalacion: "" });
    // tipo 1=Internet, 2=Cable
    const { data } = await api.get("/servicios", { params: { tipo } });
    setServicios(data);
    setModal(tipo === 1 ? "internet" : "cable");
  };

  const cerrar = () => {
    setModal(null);
    setMsgError(null);
  };

  // ── Asignar servicio ──────────────────────────────────────
  const asignar = async () => {
    if (!form.idServicio) {
      setMsgError("Selecciona un servicio.");
      return;
    }
    setGuardando(true);
    setMsgError(null);
    try {
      const endpoint = `/clientes/${clienteId}/servicios/${modal}`;
      await api.post(endpoint, {
        idCliente: Number(clienteId),
        idServicio: Number(form.idServicio),
        direccionInstalacion: form.direccionInstalacion || null,
      });
      cerrar();
      cargarResumen(clienteId);
    } catch (e) {
      setMsgError(e.message);
    } finally {
      setGuardando(false);
    }
  };

  // ── Quitar servicio ───────────────────────────────────────
  const quitar = async (tipo) => {
    const nombre = tipo === "internet" ? "Internet" : "Cable";
    if (!confirm(`¿Quitar el servicio de ${nombre} a este cliente?`)) return;
    try {
      await api.delete(`/clientes/${clienteId}/servicios/${tipo}`);
      cargarResumen(clienteId);
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div style={s.page}>
      <h2 style={s.titulo}>Asignación de servicios</h2>

      {/* ── Selector de cliente ── */}
      <div style={s.selectorCard}>
        <label style={s.label}>Selecciona un cliente</label>
        <select
          style={s.select}
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
        >
          <option value="">— Seleccionar —</option>
          {clientes.map((c) => (
            <option key={c.idCliente} value={c.idCliente}>
              {c.codigo} — {c.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* ── Resumen del contrato ── */}
      {cargando && <p style={{ color: "#aaa" }}>Cargando...</p>}

      {!cargando && resumen && (
        <div style={s.resumenWrap}>
          {/* Cabecera cliente */}
          <div style={s.clienteCard}>
            <div>
              <div style={s.clienteNombre}>{resumen.nombre}</div>
              <div style={s.clienteCodigo}>
                {resumen.codigo} · {resumen.estadoNombre}
              </div>
            </div>
          </div>

          {/* Servicios lado a lado */}
          <div style={s.serviciosGrid}>
            {/* Internet */}
            <div style={s.servicioCard}>
              <div style={s.servicioHeader}>
                <span style={{ ...s.tipoBadge, background: "#0f3460" }}>
                  Internet
                </span>
                <button style={s.btnAsignar} onClick={() => abrirModal(1)}>
                  {resumen.internet ? "Cambiar" : "+ Asignar"}
                </button>
              </div>

              {resumen.internet ? (
                <div style={s.servicioDetalle}>
                  <div style={s.servicioNombre}>
                    {resumen.internet.nombreServicio}
                  </div>
                  <div style={s.servicioInfo}>
                    {resumen.internet.velocidadMbps} Mbps
                  </div>
                  <div style={s.servicioCosto}>
                    Q {Number(resumen.internet.costoMensual).toFixed(2)} / mes
                  </div>
                  <div style={s.servicioFecha}>
                    Desde:{" "}
                    {new Date(
                      resumen.internet.fechaContratacion,
                    ).toLocaleDateString("es-GT")}
                  </div>
                  <button
                    style={s.btnQuitar}
                    onClick={() => quitar("internet")}
                  >
                    Quitar servicio
                  </button>
                </div>
              ) : (
                <div style={s.sinServicio}>Sin servicio asignado</div>
              )}
            </div>

            {/* Cable */}
            <div style={s.servicioCard}>
              <div style={s.servicioHeader}>
                <span style={{ ...s.tipoBadge, background: "#533483" }}>
                  Cable
                </span>
                <button style={s.btnAsignar} onClick={() => abrirModal(2)}>
                  {resumen.cable ? "Cambiar" : "+ Asignar"}
                </button>
              </div>

              {resumen.cable ? (
                <div style={s.servicioDetalle}>
                  <div style={s.servicioNombre}>
                    {resumen.cable.nombreServicio}
                  </div>
                  <div style={s.servicioInfo}>
                    {resumen.cable.direccionInstalacion ||
                      "Sin dirección de instalación"}
                  </div>
                  <div style={s.servicioCosto}>
                    Q {Number(resumen.cable.costoMensual).toFixed(2)} / mes
                  </div>
                  <div style={s.servicioFecha}>
                    Desde:{" "}
                    {new Date(
                      resumen.cable.fechaContratacion,
                    ).toLocaleDateString("es-GT")}
                  </div>
                  <button style={s.btnQuitar} onClick={() => quitar("cable")}>
                    Quitar servicio
                  </button>
                </div>
              ) : (
                <div style={s.sinServicio}>Sin servicio asignado</div>
              )}
            </div>
          </div>

          {/* Resumen de cobro */}
          <div style={s.totalCard}>
            <div style={s.totalFila}>
              <span style={{ color: "#aaa" }}>Subtotal</span>
              <span>Q {Number(resumen.subtotal).toFixed(2)}</span>
            </div>

            {resumen.tieneDescuentoPaquete && (
              <div style={{ ...s.totalFila, color: "#28a745" }}>
                <span>Descuento paquete ({resumen.porcentajeDescuento}%)</span>
                <span>- Q {Number(resumen.montoDescuento).toFixed(2)}</span>
              </div>
            )}

            <div style={s.separador} />

            <div style={{ ...s.totalFila, ...s.totalFinal }}>
              <span>Total mensual</span>
              <span style={{ color: "#e94560" }}>
                Q {Number(resumen.total).toFixed(2)}
              </span>
            </div>

            {resumen.tieneDescuentoPaquete && (
              <div style={s.descuentoBanner}>
                ✓ Descuento paquete doble aplicado (Cable + Internet)
              </div>
            )}
          </div>
          {/* Cobertura por pago anticipado */}
          {cobertura.length > 0 && (
            <div style={s.coberturaCard}>
              <div style={s.seccionTituloCobertura}>
                📅 Cobertura por pago anticipado
              </div>
              {cobertura.map((c) => {
                const fin = new Date(c.fechaFin);
                const vigente = fin >= new Date();
                return (
                  <div
                    key={c.idFactura}
                    style={{
                      ...s.coberturaItem,
                      opacity: vigente ? 1 : 0.5,
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600 }}>
                        {c.serie}-{c.numeroFactura}
                        {vigente && <span style={s.vigenteTag}>VIGENTE</span>}
                      </div>
                      <div
                        style={{ fontSize: 13, color: "#aaa", marginTop: 2 }}
                      >
                        {c.mesesPagados} meses pagados — Q{" "}
                        {Number(c.total).toFixed(2)}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", fontSize: 13 }}>
                      <div style={{ color: "#28a745" }}>
                        Desde:{" "}
                        {new Date(c.fechaInicio).toLocaleDateString("es-GT")}
                      </div>
                      <div style={{ color: vigente ? "#28a745" : "#aaa" }}>
                        Hasta: {fin.toLocaleDateString("es-GT")}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Placeholder sin cliente ── */}
      {!cargando && !resumen && clienteId && (
        <div style={s.sinDatos}>No se encontró información del cliente.</div>
      )}
      {!clienteId && (
        <div style={s.sinDatos}>
          Selecciona un cliente para ver sus servicios.
        </div>
      )}

      {/* ── Modal asignación ── */}
      {modal && (
        <div style={s.overlay} onClick={cerrar}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={s.modalTitulo}>
              Asignar servicio de {modal === "internet" ? "Internet" : "Cable"}
            </h3>

            <div style={s.campo}>
              <label style={s.label}>Servicio disponible</label>
              <select
                style={s.selectModal}
                value={form.idServicio}
                onChange={(e) =>
                  setForm((f) => ({ ...f, idServicio: e.target.value }))
                }
              >
                <option value="">— Seleccionar —</option>
                {servicios.map((sv) => (
                  <option key={sv.idServicio} value={sv.idServicio}>
                    {sv.nombre} — Q {Number(sv.costoBase).toFixed(2)}/mes
                  </option>
                ))}
              </select>
            </div>

            {modal === "cable" && (
              <div style={s.campo}>
                <label style={s.label}>Dirección de instalación</label>
                <input
                  style={s.inputModal}
                  placeholder="Ej: Zona 10, Av. Las Américas 15-30"
                  value={form.direccionInstalacion}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      direccionInstalacion: e.target.value,
                    }))
                  }
                />
              </div>
            )}

            {msgError && <div style={s.alerta}>{msgError}</div>}

            <div style={s.modalFooter}>
              <button style={s.btnSecundario} onClick={cerrar}>
                Cancelar
              </button>
              <button
                style={s.btnPrimario}
                onClick={asignar}
                disabled={guardando}
              >
                {guardando ? "Asignando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  page: { fontFamily: "Segoe UI, sans-serif", color: "#e0e0e0", maxWidth: 800 },
  titulo: { margin: "0 0 20px", fontSize: 22 },
  selectorCard: {
    background: "#16213e",
    borderRadius: 8,
    padding: "16px 20px",
    marginBottom: 24,
  },
  label: { display: "block", fontSize: 12, color: "#aaa", marginBottom: 6 },
  select: {
    width: "100%",
    background: "#0f3460",
    color: "#fff",
    border: "1px solid #333",
    borderRadius: 6,
    padding: "9px 12px",
    fontSize: 14,
    cursor: "pointer",
  },
  resumenWrap: { display: "flex", flexDirection: "column", gap: 16 },
  clienteCard: { background: "#16213e", borderRadius: 8, padding: "14px 20px" },
  clienteNombre: { fontSize: 18, fontWeight: 600 },
  clienteCodigo: { fontSize: 13, color: "#aaa", marginTop: 2 },
  serviciosGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  servicioCard: { background: "#16213e", borderRadius: 8, padding: 16 },
  servicioHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  tipoBadge: {
    padding: "3px 10px",
    borderRadius: 12,
    fontSize: 12,
    color: "#fff",
    fontWeight: 600,
  },
  btnAsignar: {
    background: "#e94560",
    color: "#fff",
    border: "none",
    padding: "5px 12px",
    borderRadius: 5,
    cursor: "pointer",
    fontSize: 12,
  },
  servicioDetalle: { display: "flex", flexDirection: "column", gap: 6 },
  servicioNombre: { fontWeight: 600, fontSize: 15 },
  servicioInfo: { color: "#aaa", fontSize: 13 },
  servicioCosto: { color: "#e94560", fontSize: 16, fontWeight: 700 },
  servicioFecha: { color: "#666", fontSize: 12 },
  btnQuitar: {
    marginTop: 8,
    background: "transparent",
    color: "#f88",
    border: "1px solid #5c1a1a",
    padding: "4px 10px",
    borderRadius: 5,
    cursor: "pointer",
    fontSize: 12,
    alignSelf: "flex-start",
  },
  sinServicio: {
    color: "#555",
    fontSize: 13,
    marginTop: 8,
    fontStyle: "italic",
  },
  totalCard: { background: "#16213e", borderRadius: 8, padding: "16px 20px" },
  totalFila: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 0",
    fontSize: 14,
  },
  separador: { borderTop: "1px solid #333", margin: "8px 0" },
  totalFinal: { fontSize: 18, fontWeight: 700 },
  descuentoBanner: {
    marginTop: 10,
    background: "#0d3320",
    color: "#28a745",
    padding: "8px 12px",
    borderRadius: 6,
    fontSize: 13,
  },
  sinDatos: {
    color: "#555",
    textAlign: "center",
    marginTop: 40,
    fontSize: 15,
    fontStyle: "italic",
  },
  alerta: {
    background: "#5c1a1a",
    color: "#f88",
    padding: "10px 14px",
    borderRadius: 6,
    marginBottom: 12,
    fontSize: 14,
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
    maxWidth: 460,
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
  },
  modalTitulo: { margin: "0 0 20px", fontSize: 18 },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 20,
  },
  campo: { marginBottom: 16 },
  selectModal: {
    width: "100%",
    background: "#0f3460",
    color: "#fff",
    border: "1px solid #333",
    borderRadius: 5,
    padding: "8px 10px",
    fontSize: 14,
  },
  inputModal: {
    width: "100%",
    boxSizing: "border-box",
    background: "#0f3460",
    border: "1px solid #333",
    borderRadius: 5,
    padding: "8px 10px",
    color: "#fff",
    fontSize: 14,
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
  coberturaCard: {
    background: "#16213e",
    borderRadius: 8,
    padding: "16px 20px",
    marginTop: 16,
  },
  seccionTituloCobertura: {
    color: "#aaa",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  coberturaItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid #2a2a3e",
  },
  vigenteTag: {
    marginLeft: 8,
    background: "#0d3320",
    color: "#28a745",
    padding: "2px 8px",
    borderRadius: 10,
    fontSize: 10,
    fontWeight: 700,
  },
};
