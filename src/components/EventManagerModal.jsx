import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Calendar, Users, Check } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function EventManagerModal({
    isOpen,
    onClose,
    events,
    employees,
    onSave,
    onDelete
}) {
    const [editingEvent, setEditingEvent] = useState(null); // If null, means we are in "List" mode or "Create" mode? Better: List -> Click to Edit

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        startDate: '',
        endDate: '',
        isGlobal: false,
        assignedEmployeeIds: []
    });

    const resetForm = () => {
        setFormData({
            name: '',
            startDate: '',
            endDate: '',
            isGlobal: true, // Default to global
            assignedEmployeeIds: []
        });
        setEditingEvent(null);
    };

    const handleEditClick = (event) => {
        setEditingEvent(event);
        setFormData({
            ...event,
            assignedEmployeeIds: event.assignedEmployeeIds || []
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            id: editingEvent?.id // If editing, pass ID
        });
        resetForm();
    };

    const toggleEmployee = (empId) => {
        const currentIds = formData.assignedEmployeeIds;
        if (currentIds.includes(empId)) {
            setFormData({ ...formData, assignedEmployeeIds: currentIds.filter(id => id !== empId) });
        } else {
            setFormData({ ...formData, assignedEmployeeIds: [...currentIds, empId] });
        }
    };


    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '900px', padding: 0, borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
                {/* Header */}
                <div className="modal-header-premium">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: '#e0e7ff', color: '#4338ca', padding: '8px', borderRadius: '10px' }}>
                            <Calendar size={24} />
                        </div>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#1e293b' }}>Gestión de Eventos</h2>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Programa ferias y festivos corporativos</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="btn-icon" style={{ background: '#f1f5f9', borderRadius: '50%', padding: '8px' }}>
                        <X size={20} color="#64748b" />
                    </button>
                </div>

                <div className="modal-body-premium">

                    {/* LEFT COLUMN: Event List */}
                    <div className="event-list-panel">
                        <div className="event-list-header">
                            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Eventos
                            </h3>
                            <button
                                className="btn btn-primary"
                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', borderRadius: '6px', boxShadow: 'none' }}
                                onClick={resetForm}
                            >
                                + Nuevo
                            </button>
                        </div>

                        <div className="event-list-container">
                            {events.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94a3b8' }}>
                                    <Calendar size={32} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
                                    <p>No hay eventos creados.</p>
                                </div>
                            )}
                            {events.map(ev => (
                                <div
                                    key={ev.id}
                                    onClick={() => handleEditClick(ev)}
                                    className={`event-item ${editingEvent?.id === ev.id ? 'active' : ''}`}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{ev.name}</div>
                                        {ev.isGlobal && <span style={{ fontSize: '10px', background: '#dbeafe', color: '#1e40af', padding: '2px 6px', borderRadius: '99px', fontWeight: 700 }}>GLOBAL</span>}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Calendar size={12} />
                                        {format(new Date(ev.startDate), 'd MMM', { locale: es })} - {format(new Date(ev.endDate), 'd MMM yyyy', { locale: es })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Form */}
                    <div className="event-form-panel">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>
                                {editingEvent ? 'Editar Evento' : 'Crear Nuevo Evento'}
                            </h3>
                            {editingEvent && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (confirm('¿Eliminar este evento?')) {
                                            onDelete(editingEvent.id);
                                            resetForm();
                                        }
                                    }}
                                    style={{ color: '#ef4444', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', cursor: 'pointer' }}
                                >
                                    <Trash2 size={16} /> Eliminar
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div className="form-group">
                                <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem', display: 'block' }}>Nombre del Evento</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ej: Feria Internacional"
                                    required
                                    className="form-input-premium"
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div className="form-group">
                                    <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem', display: 'block' }}>Inicio</label>
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                        required
                                        className="form-input-premium"
                                    />
                                </div>
                                <div className="form-group">
                                    <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem', display: 'block' }}>Fin</label>
                                    <input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                        required
                                        className="form-input-premium"
                                    />
                                </div>
                            </div>

                            <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.isGlobal}
                                            onChange={e => setFormData({ ...formData, isGlobal: e.target.checked })}
                                            className="checkbox-custom"
                                            style={{ margin: 0 }}
                                        />
                                    </div>
                                    <div>
                                        <span style={{ fontWeight: 600, color: '#1e293b', display: 'block' }}>Evento Global</span>
                                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Visible para todos los empleados</span>
                                    </div>
                                </label>
                            </div>

                            {!formData.isGlobal && (
                                <div className="form-group" style={{ animation: 'fadeIn 0.3s ease' }}>
                                    <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem', display: 'block' }}>Asignar Empleados</label>
                                    <div className="employee-select-list">
                                        {employees.map(emp => (
                                            <div
                                                key={emp.id}
                                                onClick={() => toggleEmployee(emp.id)}
                                                className={`employee-select-item ${formData.assignedEmployeeIds.includes(emp.id) ? 'selected' : ''}`}
                                            >
                                                <div style={{
                                                    width: '20px', height: '20px', borderRadius: '6px',
                                                    border: formData.assignedEmployeeIds.includes(emp.id) ? 'none' : '2px solid #cbd5e1',
                                                    backgroundColor: formData.assignedEmployeeIds.includes(emp.id) ? 'var(--primary)' : 'white',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    transition: 'all 0.2s'
                                                }}>
                                                    {formData.assignedEmployeeIds.includes(emp.id) && <Check size={14} color="white" />}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 500, color: '#334155' }}>{emp.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{emp.role}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: 600, borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                                    <Save size={20} /> Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
