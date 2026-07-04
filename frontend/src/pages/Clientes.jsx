import { useState, useEffect } from 'react'
import api from '../api/axiosClient'

const ESTADO = { 0: 'Inactivo', 1: 'Activo', 2: 'Suspendido', 3: 'Moroso' }
const COLOR_ESTADO = {
    0: '#6c757d', 1: '#28a745', 2: '#ffc107', 3: '#dc3545'
}

const FORM_VACIO = {
    codigo: '', nombre: '', fechaAlta: '', direccion: '', correo: '', telefono: ''
}

export default function Clientes() {
    const [clientes, setClientes] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null)
    const [modal, setModal] = useState(false)
    const [editando, setEditando] = useState(null)   // null = nuevo
    const [form, setForm] = useState(FORM_VACIO)
    const [guardando, setGuardando] = useState(false)
    const [msgError, setMsgError] = useState(null)

    // ── Cargar lista ──────────────────────────────────────────
    const cargar = async () => {
        try {
            setCargando(true)
            const { data } = await api.get('/clientes')
            setClientes(data)
            setError(null)
        } catch (e) {
            setError(e.message)
        } finally {
            setCargando(false)
        }
    }
 // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { cargar() }, [])

    // ── Abrir modal ───────────────────────────────────────────
    const abrirNuevo = () => {
        setEditando(null)
        setForm(FORM_VACIO)
        setMsgError(null)
        setModal(true)
    }

    const abrirEditar = (c) => {
        setEditando(c.idCliente)
        setForm({
            codigo: c.codigo || '',
            nombre: c.nombre || '',
            fechaAlta: c.fechaAlta ? c.fechaAlta.substring(0, 10) : '',
            direccion: c.direccion || '',
            correo: c.correo || '',
            telefono: c.telefono || '',
            estado: c.estado ?? 1
        })
        setMsgError(null)
        setModal(true)
    }

    const cerrarModal = () => { setModal(false); setMsgError(null) }

    // ── Guardar (crear o editar) ───────────────────────────────
    const guardar = async () => {
        if (!form.codigo.trim()) { setMsgError('El código es obligatorio.'); return }
        if (!form.nombre.trim()) { setMsgError('El nombre es obligatorio.'); return }

        setGuardando(true)
        setMsgError(null)
        try {
            if (editando) {
                await api.put(`/clientes/${editando}`, {
                    nombre: form.nombre,
                    direccion: form.direccion,
                    correo: form.correo,
                    telefono: form.telefono,
                    estado: Number(form.estado ?? 1)
                })
            } else {
                await api.post('/clientes', {
                    codigo: form.codigo,
                    nombre: form.nombre,
                    fechaAlta: form.fechaAlta || null,
                    direccion: form.direccion,
                    correo: form.correo,
                    telefono: form.telefono
                })
            }
            cerrarModal()
            cargar()
        } catch (e) {
            setMsgError(e.message)
        } finally {
            setGuardando(false)
        }
    }

    // ── Eliminar ──────────────────────────────────────────────
    const eliminar = async (id, nombre) => {
        if (!confirm(`¿Eliminar a ${nombre}? Esta acción es permanente.`)) return
        try {
            await api.delete(`/clientes/${id}`)
            cargar()
        } catch (e) {
            alert(e.message)
        }
    }

    // ── Render ────────────────────────────────────────────────
    return (
        <div style={s.page}>
            <div style={s.header}>
                <h2 style={s.titulo}>Clientes</h2>
                <button style={s.btnPrimario} onClick={abrirNuevo}>+ Nuevo cliente</button>
            </div>

            {error && <div style={s.alerta}>{error}</div>}

            {cargando ? (
                <p style={{ color: '#aaa' }}>Cargando...</p>
            ) : (
                <div style={s.tableWrap}>
                    <table style={s.table}>
                        <thead>
                            <tr>
                                {['Código', 'Nombre', 'Teléfono', 'Correo', 'Estado', 'Acciones']
                                    .map(h => <th key={h} style={s.th}>{h}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {clientes.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ ...s.td, textAlign: 'center', color: '#aaa' }}>
                                        No hay clientes registrados
                                    </td>
                                </tr>
                            ) : clientes.map(c => (
                                <tr key={c.idCliente} style={s.tr}>
                                    <td style={s.td}>{c.codigo}</td>
                                    <td style={s.td}>{c.nombre}</td>
                                    <td style={s.td}>{c.telefono || '—'}</td>
                                    <td style={s.td}>{c.correo || '—'}</td>
                                    <td style={s.td}>
                                        <span style={{
                                            ...s.badge,
                                            background: COLOR_ESTADO[c.estado] || '#6c757d'
                                        }}>
                                            {ESTADO[c.estado] || 'Desconocido'}
                                        </span>
                                    </td>
                                    <td style={s.td}>
                                        <button style={s.btnEditar} onClick={() => abrirEditar(c)}>Editar</button>
                                        <button style={s.btnEliminar} onClick={() => eliminar(c.idCliente, c.nombre)}>
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ── Modal ── */}
            {modal && (
                <div style={s.overlay} onClick={cerrarModal}>
                    <div style={s.modal} onClick={e => e.stopPropagation()}>
                        <h3 style={s.modalTitulo}>
                            {editando ? 'Editar cliente' : 'Nuevo cliente'}
                        </h3>

                        <div style={s.grid2}>
                            <Campo label="Código *" disabled={!!editando}
                                value={form.codigo}
                                onChange={v => setForm({ ...form, codigo: v })} />
                            <Campo label="Nombre *"
                                value={form.nombre}
                                onChange={v => setForm({ ...form, nombre: v })} />
                            <Campo label="Teléfono"
                                value={form.telefono}
                                onChange={v => setForm({ ...form, telefono: v })} />
                            <Campo label="Correo"
                                value={form.correo}
                                onChange={v => setForm({ ...form, correo: v })} />
                            <Campo label="Fecha de alta" type="date"
                                value={form.fechaAlta}
                                onChange={v => setForm({ ...form, fechaAlta: v })} />
                        </div>

                        <Campo label="Dirección"
                            value={form.direccion}
                            onChange={v => setForm({ ...form, direccion: v })} />

                        {editando && (
                            <div style={s.campo}>
                                <label style={s.label}>Estado</label>
                                <select style={s.input}
                                    value={form.estado}
                                    onChange={e => setForm({ ...form, estado: Number(e.target.value) })}>
                                    <option value={1}>Activo</option>
                                    <option value={2}>Suspendido</option>
                                    <option value={3}>Moroso</option>
                                    <option value={0}>Inactivo</option>
                                </select>
                            </div>
                        )}

                        {msgError && <div style={s.alerta}>{msgError}</div>}

                        <div style={s.modalFooter}>
                            <button style={s.btnSecundario} onClick={cerrarModal}>Cancelar</button>
                            <button style={s.btnPrimario} onClick={guardar} disabled={guardando}>
                                {guardando ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// ── Componente campo reutilizable ─────────────────────────
function Campo({ label, value, onChange, type = 'text', disabled = false }) {
    return (
        <div style={s.campo}>
            <label style={s.label}>{label}</label>
            <input
                style={{ ...s.input, opacity: disabled ? 0.6 : 1 }}
                type={type}
                value={value}
                disabled={disabled}
                onChange={e => onChange(e.target.value)}
            />
        </div>
    )
}

// ── Estilos ───────────────────────────────────────────────
const s = {
    page: { fontFamily: 'Segoe UI, sans-serif', color: '#e0e0e0' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    titulo: { margin: 0, fontSize: 22 },
    alerta: {
        background: '#5c1a1a', color: '#f88', padding: '10px 14px',
        borderRadius: 6, marginBottom: 12, fontSize: 14
    },
    tableWrap: { overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: 14 },
    th: {
        background: '#1a1a2e', color: '#aaa', padding: '10px 14px',
        textAlign: 'left', borderBottom: '1px solid #333'
    },
    tr: { borderBottom: '1px solid #2a2a3e' },
    td: { padding: '10px 14px', verticalAlign: 'middle' },
    badge: {
        padding: '3px 10px', borderRadius: 12, fontSize: 12,
        color: '#fff', fontWeight: 600
    },
    btnPrimario: {
        background: '#e94560', color: '#fff', border: 'none',
        padding: '8px 18px', borderRadius: 6, cursor: 'pointer', fontWeight: 600
    },
    btnSecundario: {
        background: '#333', color: '#ccc', border: 'none',
        padding: '8px 18px', borderRadius: 6, cursor: 'pointer'
    },
    btnEditar: {
        background: '#0f3460', color: '#fff', border: 'none',
        padding: '5px 12px', borderRadius: 5, cursor: 'pointer',
        marginRight: 6, fontSize: 13
    },
    btnEliminar: {
        background: '#5c1a1a', color: '#f88', border: 'none',
        padding: '5px 12px', borderRadius: 5, cursor: 'pointer', fontSize: 13
    },
    overlay: {
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
    },
    modal: {
        background: '#16213e', borderRadius: 10, padding: 28,
        width: '100%', maxWidth: 560, boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
    },
    modalTitulo: { margin: '0 0 20px', fontSize: 18 },
    modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 },
    grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' },
    campo: { marginBottom: 14 },
    label: { display: 'block', fontSize: 12, color: '#aaa', marginBottom: 4 },
    input: {
        width: '100%', boxSizing: 'border-box', background: '#0f3460',
        border: '1px solid #333', borderRadius: 5, padding: '7px 10px',
        color: '#fff', fontSize: 14
    },
}