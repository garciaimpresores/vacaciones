import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { getEmployeeColor } from '../utils/colors';

export default function EmployeeManager({ employees, onAdd, onEdit, onAddVacation, showColors, selectedIds = [], onToggleSelect }) {
    const [name, setName] = useState('');
    const [role, setRole] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        onAdd({ name, role });
        setName('');
        setRole('');
    };

    return (
        <div className="card">
            <h3 className="title" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Empleados</h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '1.5rem' }}>
                <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: '4px', display: 'block' }}>Nombre</label>
                    <input
                        className="input-base"
                        type="text"
                        placeholder="Ej. Juan Pérez"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: '1px solid var(--border-light)',
                            fontSize: '0.95rem'
                        }}
                    />
                </div>

                <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: '4px', display: 'block' }}>Cargo</label>
                    <select
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: '1px solid var(--border-light)',
                            fontSize: '0.95rem',
                            backgroundColor: 'white'
                        }}
                    >
                        <option value="">Seleccionar cargo...</option>
                        <option value="Taller">Taller</option>
                        <option value="Administración">Administración</option>
                        <option value="Gerencia">Gerencia</option>
                        <option value="Diseño">Diseño</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Plus size={18} />
                    <span>Añadir Empleado</span>
                </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {employees.map((emp, index) => {
                    const color = getEmployeeColor(emp.originalIndex ?? index);
                    const isSelected = selectedIds.includes(emp.id);

                    return (
                        <div key={emp.id} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.5rem',
                            backgroundColor: isSelected ? '#eff6ff' : 'var(--bg-app)',
                            border: isSelected ? '1px solid var(--primary)' : '1px solid transparent',
                            borderRadius: '8px',
                            transition: 'all 0.2s'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => onToggleSelect && onToggleSelect(emp.id)}
                                    style={{ width: '16px', height: '16px', cursor: 'pointer', flexShrink: 0 }}
                                    title="Marcar para filtrar"
                                />

                                {showColors && (
                                    <div style={{
                                        width: '12px', height: '12px',
                                        borderRadius: '50%',
                                        backgroundColor: color,
                                        flexShrink: 0
                                    }} />
                                )}
                                <div style={{ minWidth: 0 }}>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{emp.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{emp.role || 'Sin cargo'}</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '4px' }}>
                                <button
                                    onClick={() => onAddVacation && onAddVacation(emp)}
                                    style={{ color: 'var(--primary)', background: 'none', padding: '4px', cursor: 'pointer' }}
                                    title="Añadir vacación directa"
                                >
                                    <Plus size={16} />
                                </button>
                                <button
                                    onClick={() => onEdit && onEdit(emp)}
                                    style={{ color: 'var(--text-muted)', background: 'none', padding: '4px', cursor: 'pointer' }}
                                    title="Ver ficha / Editar"
                                >
                                    {/* Pencil Icon inline */}
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                </button>
                            </div>
                        </div>
                    );
                })}
                {employees.length === 0 && (
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontStyle: 'italic', fontSize: '0.9rem' }}>
                        No hay empleados registrados.
                    </p>
                )}
            </div>
        </div>
    );
}
