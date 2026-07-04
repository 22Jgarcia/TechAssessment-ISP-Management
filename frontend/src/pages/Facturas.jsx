import { useState, useEffect } from "react";
import api from "../api/axiosClient";

const ESTADO = { 1: "Pendiente", 2: "Pagada", 3: "Bloqueada", 4: "Anulada" };
const COLOR_ESTADO = {
  1: "#ffc107",
  2: "#28a745",
  3: "#dc3545",
  4: "#6c757d",
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

const HOY = new Date();

export default function Facturas() {
  const [facturas, setFacturas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Filtros
  const [fCliente, setFCliente] = useState("");
  const [fEstado, setFEstado] = useState("");
  const [fAnio, setFAnio] = useState("");
  const [fMes, setFMes] = useState("");

  // Modales
  const [modalGenerar, setModalGenerar] = useState(false);
  const [modalDetalle, setModalDetalle] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [msgError, setMsgError] = useState(null);

  // Estados para módulo de pagos
  const [modalPago, setModalPago] = useState(null); // factura sobre la que pagar
  const [resumenPago, setResumenPago] = useState(null); // datos del saldo
  const [formPago, setFormPago] = useState({
    monto: "",
    metodoPago: "Efectivo",
    referencia: "",
  });
  const [pagandoFactura, setPagandoFactura] = useState(false);
  const [historialPagos, setHistorialPagos] = useState([]);

  const [form, setForm] = useState({
    idCliente: "",
    mesCobro: HOY.getMonth() + 1,
    anioCobro: HOY.getFullYear(),
    serie: "A",
    esPagoAnticipado: false,
  });

  // ── Cargar listado
  const cargar = async () => {
    try {
      setCargando(true);
      const params = {};
      if (fCliente) params.idCliente = fCliente;
      if (fEstado) params.estado = fEstado;
      if (fAnio) params.anio = fAnio;
      if (fMes) params.mes = fMes;

      const { data } = await api.get("/facturas", { params });
      setFacturas(data);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, [fCliente, fEstado, fAnio, fMes]);

  // Clientes para los selects
  useEffect(() => {
    api
      .get("/clientes")
      .then((r) => setClientes(r.data))
      .catch(() => {});
  }, []);

  // ── Generar factura
  const abrirGenerar = () => {
    setForm({
      idCliente: "",
      mesCobro: HOY.getMonth() + 1,
      anioCobro: HOY.getFullYear(),
      serie: "A",
      esPagoAnticipado: false,
    });
    setMsgError(null);
    setModalGenerar(true);
  };

  const generar = async () => {
    if (!form.idCliente) {
      setMsgError("Selecciona un cliente.");
      return;
    }
    setGuardando(true);
    setMsgError(null);
    try {
      const { data } = await api.post("/facturas", {
        idCliente: Number(form.idCliente),
        mesCobro: Number(form.mesCobro),
        anioCobro: Number(form.anioCobro),
        serie: form.serie,
        esPagoAnticipado: form.esPagoAnticipado,
      });
      setModalGenerar(false);
      cargar();
      // Abrir el detalle de la factura recién creada
      verDetalle(data.idFactura);
    } catch (e) {
      setMsgError(e.message);
    } finally {
      setGuardando(false);
    }
  };

  const verDetalle = async (id) => {
    try {
      const { data } = await api.get(`/facturas/${id}`);
      setModalDetalle(data);
    } catch (e) {
      alert(e.message);
    }
  };

  const anular = async (id, numero) => {
    if (!confirm(`¿Anular la factura ${numero}? No se podrá deshacer.`)) return;
    try {
      await api.delete(`/facturas/${id}`);
      cargar();
    } catch (e) {
      alert(e.message);
    }
  };

  const imprimir = () => window.print();

  const abrirPago = async (factura) => {
    setMsgError(null);
    try {
      const { data } = await api.get(
        `/pagos/factura/${factura.idFactura}/resumen`,
      );
      setResumenPago(data);
      setFormPago({
        monto: data.saldoPendiente.toFixed(2),
        metodoPago: "Efectivo",
        referencia: "",
      });
      setModalPago(factura);
    } catch (e) {
      setMsgError(e.message);
    }
  };

  const pagar = async () => {
    const monto = Number(formPago.monto);
    if (isNaN(monto) || monto <= 0) {
      setMsgError("El monto debe ser mayor a cero");
      return;
    }
    if (monto > resumenPago.saldoPendiente) {
      setMsgError(
        `Excede el saldo pendiente (Q ${resumenPago.saldoPendiente.toFixed(2)})`,
      );
      return;
    }
    setPagandoFactura(true);
    setMsgError(null);
    try {
      await api.post("/pagos", {
        idFactura: modalPago.idFactura,
        monto: monto,
        metodoPago: formPago.metodoPago,
        referencia: formPago.referencia,
      });
      setModalPago(null);
      setResumenPago(null);
      cargar();
    } catch (e) {
      setMsgError(e.message);
    } finally {
      setPagandoFactura(false);
    }
  };

  const verDetalleConPagos = async (id) => {
    try {
      const { data } = await api.get(`/facturas/${id}`);
      setModalDetalle(data);
      const { data: pagos } = await api.get(`/pagos/factura/${id}`);
      setHistorialPagos(pagos);
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h2 style={s.titulo}>Facturas</h2>
        <button style={s.btnPrimario} onClick={abrirGenerar}>
          + Generar factura
        </button>
      </div>

      {/* Filtros */}
      <div style={s.filtros}>
        <select
          style={s.select}
          value={fCliente}
          onChange={(e) => setFCliente(e.target.value)}
        >
          <option value="">Todos los clientes</option>
          {clientes.map((c) => (
            <option key={c.idCliente} value={c.idCliente}>
              {c.codigo} — {c.nombre}
            </option>
          ))}
        </select>

        <select
          style={s.select}
          value={fEstado}
          onChange={(e) => setFEstado(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="1">Pendiente</option>
          <option value="2">Pagada</option>
          <option value="3">Bloqueada</option>
          <option value="4">Anulada</option>
        </select>

        <select
          style={s.select}
          value={fAnio}
          onChange={(e) => setFAnio(e.target.value)}
        >
          <option value="">Todos los años</option>
          {[2024, 2025, 2026].map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>

        <select
          style={s.select}
          value={fMes}
          onChange={(e) => setFMes(e.target.value)}
        >
          <option value="">Todos los meses</option>
          {MES.slice(1).map((m, i) => (
            <option key={i + 1} value={i + 1}>
              {m}
            </option>
          ))}
        </select>

        {(fCliente || fEstado || fAnio || fMes) && (
          <button
            style={s.btnSecundario}
            onClick={() => {
              setFCliente("");
              setFEstado("");
              setFAnio("");
              setFMes("");
            }}
          >
            Limpiar
          </button>
        )}
      </div>

      {error && <div style={s.alerta}>{error}</div>}

      {cargando ? (
        <p style={{ color: "#aaa" }}>Cargando...</p>
      ) : (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>
                {[
                  "No. Factura",
                  "Cliente",
                  "Período",
                  "Subtotal",
                  "Descuento",
                  "Total",
                  "Estado",
                  "Acciones",
                ].map((h) => (
                  <th key={h} style={s.th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {facturas.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{ ...s.td, textAlign: "center", color: "#aaa" }}
                  >
                    No hay facturas que coincidan
                  </td>
                </tr>
              ) : (
                facturas.map((f) => (
                  <tr key={f.idFactura} style={s.tr}>
                    <td style={s.td}>
                      <div>
                        <strong>
                          {f.serie}-{f.numeroFactura}
                        </strong>
                      </div>
                      {f.esPagoAnticipado && <div style={s.tag6m}>6 meses</div>}
                    </td>
                    <td style={s.td}>
                      <div>{f.nombreCliente}</div>
                      <div style={{ fontSize: 12, color: "#aaa" }}>
                        {f.codigoCliente}
                      </div>
                    </td>
                    <td style={s.td}>
                      {MES[f.mesCobro]} / {f.anioCobro}
                    </td>
                    <td style={s.td}>Q {Number(f.subtotal).toFixed(2)}</td>
                    <td style={s.td}>
                      {f.montoDescuento > 0 ? (
                        <span style={{ color: "#28a745" }}>
                          - Q {Number(f.montoDescuento).toFixed(2)}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td style={s.td}>
                      <strong>Q {Number(f.total).toFixed(2)}</strong>
                    </td>
                    <td style={s.td}>
                      <span
                        style={{
                          ...s.badge,
                          background: COLOR_ESTADO[f.idEstado],
                        }}
                      >
                        {ESTADO[f.idEstado]}
                      </span>
                    </td>
                    <td style={s.td}>
                      <button
                        style={s.btnVer}
                        onClick={() => verDetalleConPagos(f.idFactura)}
                      >
                        Ver
                      </button>
                      {(f.idEstado === 1 || f.idEstado === 3) && (
                        <button style={s.btnPagar} onClick={() => abrirPago(f)}>
                          Pagar
                        </button>
                      )}
                      {f.idEstado !== 4 && (
                        <button
                          style={s.btnAnular}
                          onClick={() =>
                            anular(f.idFactura, `${f.serie}-${f.numeroFactura}`)
                          }
                        >
                          Anular
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Modal Generar ── */}
      {modalGenerar && (
        <div style={s.overlay} onClick={() => setModalGenerar(false)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={s.modalTitulo}>Generar nueva factura</h3>

            <div style={s.campo}>
              <label style={s.label}>Cliente *</label>
              <select
                style={s.input}
                value={form.idCliente}
                onChange={(e) =>
                  setForm({ ...form, idCliente: e.target.value })
                }
              >
                <option value="">— Seleccionar —</option>
                {clientes.map((c) => (
                  <option key={c.idCliente} value={c.idCliente}>
                    {c.codigo} — {c.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div style={s.grid2}>
              <div style={s.campo}>
                <label style={s.label}>Mes</label>
                <select
                  style={s.input}
                  value={form.mesCobro}
                  onChange={(e) =>
                    setForm({ ...form, mesCobro: e.target.value })
                  }
                >
                  {MES.slice(1).map((m, i) => (
                    <option key={i + 1} value={i + 1}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div style={s.campo}>
                <label style={s.label}>Año</label>
                <select
                  style={s.input}
                  value={form.anioCobro}
                  onChange={(e) =>
                    setForm({ ...form, anioCobro: e.target.value })
                  }
                >
                  {[2024, 2025, 2026, 2027].map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={s.campo}>
              <label style={s.label}>Serie</label>
              <input
                style={s.input}
                value={form.serie}
                onChange={(e) => setForm({ ...form, serie: e.target.value })}
              />
            </div>

            <label style={s.checkbox}>
              <input
                type="checkbox"
                checked={form.esPagoAnticipado}
                onChange={(e) =>
                  setForm({ ...form, esPagoAnticipado: e.target.checked })
                }
              />
              <span>Pago anticipado de 6 meses (1 mes gratis)</span>
            </label>

            {msgError && <div style={s.alerta}>{msgError}</div>}

            <div style={s.modalFooter}>
              <button
                style={s.btnSecundario}
                onClick={() => setModalGenerar(false)}
              >
                Cancelar
              </button>
              <button
                style={s.btnPrimario}
                onClick={generar}
                disabled={guardando}
              >
                {guardando ? "Generando..." : "Generar factura"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Pagar ── */}
      {modalPago && resumenPago && (
        <div style={s.overlay} onClick={() => setModalPago(null)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={s.modalTitulo}>
              Registrar pago — {modalPago.serie}-{modalPago.numeroFactura}
            </h3>

            {/* Resumen visual del saldo */}
            <div style={s.saldoCard}>
              <div style={s.saldoFila}>
                <span style={{ color: "#aaa" }}>Total factura</span>
                <span>Q {resumenPago.totalFactura.toFixed(2)}</span>
              </div>
              <div style={{ ...s.saldoFila, color: "#28a745" }}>
                <span>Ya pagado</span>
                <span>Q {resumenPago.totalPagado.toFixed(2)}</span>
              </div>
              <div style={s.separadorSaldo} />
              <div style={{ ...s.saldoFila, fontWeight: 700, fontSize: 16 }}>
                <span>Saldo pendiente</span>
                <span style={{ color: "#e94560" }}>
                  Q {resumenPago.saldoPendiente.toFixed(2)}
                </span>
              </div>
            </div>

            <div style={s.grid2}>
              <div style={s.campo}>
                <label style={s.label}>Monto a pagar *</label>
                <input
                  style={s.input}
                  type="number"
                  step="0.01"
                  value={formPago.monto}
                  onChange={(e) =>
                    setFormPago({ ...formPago, monto: e.target.value })
                  }
                />
              </div>
              <div style={s.campo}>
                <label style={s.label}>Método de pago</label>
                <select
                  style={s.input}
                  value={formPago.metodoPago}
                  onChange={(e) =>
                    setFormPago({ ...formPago, metodoPago: e.target.value })
                  }
                >
                  <option value="Efectivo">Efectivo</option>
                  <option value="Tarjeta">Tarjeta</option>
                  <option value="Transferencia">Transferencia</option>
                </select>
              </div>
            </div>

            <div style={s.campo}>
              <label style={s.label}>Referencia (opcional)</label>
              <input
                style={s.input}
                placeholder="No. de recibo, autorización, etc."
                value={formPago.referencia}
                onChange={(e) =>
                  setFormPago({ ...formPago, referencia: e.target.value })
                }
              />
            </div>

            {msgError && <div style={s.alerta}>{msgError}</div>}

            <div style={s.modalFooter}>
              <button
                style={s.btnSecundario}
                onClick={() => setModalPago(null)}
              >
                Cancelar
              </button>
              <button
                style={s.btnPrimario}
                onClick={pagar}
                disabled={pagandoFactura}
              >
                {pagandoFactura ? "Procesando..." : "Confirmar pago"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Detalle (estilo factura imprimible) ── */}
      {modalDetalle && (
        <div style={s.overlay} onClick={() => setModalDetalle(null)}>
          <div style={s.modalGrande} onClick={(e) => e.stopPropagation()}>
            <div style={s.facturaWrap} className="factura-imprimible">
              {/* Cabecera */}
              <div style={s.facturaHeader}>
                <div>
                  <div style={s.facturaWrap} className="factura-imprimible">
                    {" "}
                  </div>
                  <div style={s.empresaInfo}>Servicios de Cable e Internet</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={s.facturaNumero}>
                    {modalDetalle.serie}-{modalDetalle.numeroFactura}
                  </div>
                  <div style={s.empresaInfo}>
                    Fecha:{" "}
                    {new Date(modalDetalle.fecha).toLocaleDateString("es-GT")}
                  </div>
                  <div
                    style={{
                      ...s.badge,
                      background: COLOR_ESTADO[modalDetalle.idEstado],
                      marginTop: 6,
                      display: "inline-block",
                    }}
                  >
                    {modalDetalle.estadoNombre}
                  </div>
                </div>
              </div>

              {/* Cliente */}
              <div style={s.facturaSeccion}>
                <div style={s.seccionTitulo}>Cliente</div>
                <div>
                  <strong>{modalDetalle.nombreCliente}</strong>
                  <span style={{ color: "#aaa", marginLeft: 8 }}>
                    ({modalDetalle.codigoCliente})
                  </span>
                </div>
                {modalDetalle.direccion && (
                  <div style={s.facturaInfo}>{modalDetalle.direccion}</div>
                )}
                {modalDetalle.correo && (
                  <div style={s.facturaInfo}>{modalDetalle.correo}</div>
                )}
                {modalDetalle.telefono && (
                  <div style={s.facturaInfo}>Tel: {modalDetalle.telefono}</div>
                )}
              </div>

              {/* Período */}
              <div style={s.facturaSeccion}>
                <div style={s.seccionTitulo}>Período de cobro</div>
                <div>
                  {MES[modalDetalle.mesCobro]} / {modalDetalle.anioCobro}
                  {modalDetalle.esPagoAnticipado && (
                    <span style={s.tag6mGrande}>Pago anticipado · 6 meses</span>
                  )}
                </div>
              </div>

              {/* Detalle de servicios */}
              <div style={s.facturaSeccion}>
                <div style={s.seccionTitulo}>Detalle de servicios</div>
                <table style={s.tablaDetalle}>
                  <thead>
                    <tr>
                      <th style={s.thDetalle}>Servicio</th>
                      <th style={{ ...s.thDetalle, textAlign: "right" }}>
                        Costo mensual
                      </th>
                      <th style={{ ...s.thDetalle, textAlign: "center" }}>
                        Cantidad
                      </th>
                      <th style={{ ...s.thDetalle, textAlign: "right" }}>
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {modalDetalle.detalle.map((d) => (
                      <tr key={d.idDetalleFactura}>
                        <td style={s.tdDetalle}>{d.tipoServicio}</td>
                        <td style={{ ...s.tdDetalle, textAlign: "right" }}>
                          Q {Number(d.costoMensual).toFixed(2)}
                        </td>
                        <td style={{ ...s.tdDetalle, textAlign: "center" }}>
                          {d.cantidad}
                        </td>
                        <td style={{ ...s.tdDetalle, textAlign: "right" }}>
                          Q {Number(d.subtotal).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Descuentos */}
              {modalDetalle.descuentos.length > 0 && (
                <div style={s.facturaSeccion}>
                  <div style={s.seccionTitulo}>Descuentos aplicados</div>
                  {modalDetalle.descuentos.map((d) => (
                    <div key={d.idDescuentoFactura} style={s.descuentoRow}>
                      <span>
                        {d.tipoDescuento} ({Number(d.porcentaje).toFixed(2)}%)
                      </span>
                      <span style={{ color: "#28a745" }}>
                        - Q {Number(d.montoDescuento).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Totales */}
              <div style={s.totalesWrap}>
                {/* Historial de pagos */}
                {historialPagos.length > 0 && (
                  <div style={s.facturaSeccion}>
                    <div style={s.seccionTitulo}>Historial de pagos</div>
                    <table style={s.tablaDetalle}>
                      <thead>
                        <tr>
                          <th style={s.thDetalle}>Fecha</th>
                          <th style={s.thDetalle}>Método</th>
                          <th style={s.thDetalle}>Referencia</th>
                          <th style={{ ...s.thDetalle, textAlign: "right" }}>
                            Monto
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {historialPagos.map((p) => (
                          <tr key={p.idPago}>
                            <td style={s.tdDetalle}>
                              {new Date(p.fechaPago).toLocaleString("es-GT")}
                            </td>
                            <td style={s.tdDetalle}>{p.metodoPago}</td>
                            <td style={s.tdDetalle}>{p.referencia || "—"}</td>
                            <td
                              style={{
                                ...s.tdDetalle,
                                textAlign: "right",
                                color: "#28a745",
                              }}
                            >
                              Q {Number(p.monto).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div style={s.totalRow}>
                  <span style={{ color: "#aaa" }}>Subtotal</span>
                  <span>Q {Number(modalDetalle.subtotal).toFixed(2)}</span>
                </div>
                {modalDetalle.montoDescuento > 0 && (
                  <div style={{ ...s.totalRow, color: "#28a745" }}>
                    <span>Descuentos</span>
                    <span>
                      - Q {Number(modalDetalle.montoDescuento).toFixed(2)}
                    </span>
                  </div>
                )}
                <div style={s.separador} />
                <div style={{ ...s.totalRow, ...s.totalFinal }}>
                  <span>Total a pagar</span>
                  <span style={{ color: "#e94560" }} className="resaltado">
                    Q {Number(modalDetalle.total).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div style={s.modalFooterFactura} className="no-print">
              <button
                style={s.btnSecundario}
                onClick={() => setModalDetalle(null)}
              >
                Cerrar
              </button>
              <button style={s.btnPrimario} onClick={imprimir}>
                🖨 Imprimir
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
  filtros: { display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" },
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
  tag6m: {
    display: "inline-block",
    marginTop: 4,
    background: "#3d2c1a",
    color: "#f5a623",
    padding: "2px 8px",
    borderRadius: 10,
    fontSize: 10,
    fontWeight: 600,
    whiteSpace: "nowrap",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  tag6mGrande: {
    marginLeft: 10,
    background: "#3d2c1a",
    color: "#f5a623",
    padding: "4px 10px",
    borderRadius: 12,
    fontSize: 12,
  },
  select: {
    background: "#1a1a2e",
    color: "#ccc",
    border: "1px solid #333",
    borderRadius: 6,
    padding: "7px 12px",
    cursor: "pointer",
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
  btnVer: {
    background: "#0f3460",
    color: "#fff",
    border: "none",
    padding: "5px 12px",
    borderRadius: 5,
    cursor: "pointer",
    marginRight: 6,
    fontSize: 13,
  },
  btnAnular: {
    background: "#5c1a1a",
    color: "#f88",
    border: "none",
    padding: "5px 12px",
    borderRadius: 5,
    cursor: "pointer",
    fontSize: 13,
  },

  // Modales
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
    maxWidth: 480,
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
  },

  modalTitulo: { margin: "0 0 20px", fontSize: 18 },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 20,
  },
  modalFooterFactura: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    padding: "16px 28px",
    borderTop: "1px solid #333",
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
  checkbox: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "#ccc",
    fontSize: 14,
    cursor: "pointer",
    marginBottom: 14,
  },

  // Factura imprimible
  facturaWrap: { padding: 28 },
  facturaHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 16,
    borderBottom: "2px solid #e94560",
    marginBottom: 20,
  },
  empresaNombre: { fontSize: 24, fontWeight: 700, color: "#e94560" },
  empresaInfo: { color: "#aaa", fontSize: 13 },
  facturaNumero: { fontSize: 20, fontWeight: 700, marginBottom: 4 },
  facturaSeccion: { marginBottom: 20 },
  seccionTitulo: {
    color: "#aaa",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  facturaInfo: { color: "#ccc", fontSize: 13, marginTop: 2 },
  tablaDetalle: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  thDetalle: {
    background: "#0f3460",
    padding: "8px 12px",
    borderBottom: "1px solid #333",
    textAlign: "left",
  },
  tdDetalle: { padding: "8px 12px", borderBottom: "1px solid #2a2a3e" },
  descuentoRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "4px 0",
    fontSize: 14,
  },
  totalesWrap: {
    background: "#0f3460",
    padding: 16,
    borderRadius: 6,
    marginTop: 16,
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "4px 0",
    fontSize: 14,
  },
  separador: { borderTop: "1px solid #333", margin: "8px 0" },
  totalFinal: { fontSize: 18, fontWeight: 700 },
  btnPagar: {
    background: "#28a745",
    color: "#fff",
    border: "none",
    padding: "5px 12px",
    borderRadius: 5,
    cursor: "pointer",
    marginRight: 6,
    fontSize: 13,
    fontWeight: 600,
  },
  saldoCard: {
    background: "#0f3460",
    borderRadius: 8,
    padding: "14px 18px",
    marginBottom: 18,
  },
  modalGrande: {
    background: "#16213e",
    borderRadius: 10,
    padding: 0,
    width: "100%",
    maxWidth: 700,
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
  },
  saldoFila: {
    display: "flex",
    justifyContent: "space-between",
    padding: "4px 0",
    fontSize: 14,
  },
  separadorSaldo: { borderTop: "1px solid #333", margin: "6px 0" },
};
