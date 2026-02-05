import React, { useState, useEffect } from 'react';
import { X, Save, AlertTriangle, Calendar, Trash2, Edit2, Check, Clock } from 'lucide-react';
import { format, parseISO, isValid, startOfYear, endOfYear, max, min } from 'date-fns';
import { countWorkingDays, TOTAL_VACATION_DAYS_PER_YEAR } from '../utils/dateUtils';

export default function EmployeeEditModal({ isOpen, onClose, onSave, onDeleteEmployee, employee, allEmployees, vacations, onSaveVacation, onDeleteVacation }) {
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [pin, setPin] = useState('');
    const [incompatibleIds, setIncompatibleIds] = useState([]);

    // Vacation Edit State
    const [editingVacationId, setEditingVacationId] = useState(null);
    const [editStartDate, setEditStartDate] = useState('');
    const [editEndDate, setEditEndDate] = useState('');

    useEffect(() => {
        if (employee) {
            setName(employee.name);
            setRole(employee.role || '');
            setPin(employee.pin || '');
            setIncompatibleIds(employee.incompatibleIds || []);
            setEditingVacationId(null); // Reset on employee change
        }
    }, [employee]);

    if (!isOpen || !employee) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        onSave({
            ...employee,
            name,
            role,
            pin,
            incompatibleIds
        });
        onClose();
    };

    const handleToggleIncompatibility = (id) => {
        if (incompatibleIds.includes(id)) {
            setIncompatibleIds(incompatibleIds.filter(i => i !== id));
        } else {
            setIncompatibleIds([...incompatibleIds, id]);
        }
    };

    // Vacation Handlers
    const employeeVacations = vacations
        ? vacations
            .filter(v => v.employeeId === employee.id)
            .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
        : [];

    // Calculate details
    const currentYear = new Date().getFullYear();
    const currentYearStart = startOfYear(new Date());
    const currentYearEnd = endOfYear(new Date());

    const totalDaysUsed = employeeVacations.reduce((acc, vac) => {
        const start = parseISO(vac.startDate);
        const end = parseISO(vac.endDate);

        // Calculate overlap with current year
        const overlapStart = max([start, currentYearStart]);
        const overlapEnd = min([end, currentYearEnd]);

        if (overlapStart <= overlapEnd) {
            return acc + countWorkingDays(overlapStart, overlapEnd);
        }
        return acc;
    }, 0);

    const daysRemaining = TOTAL_VACATION_DAYS_PER_YEAR - totalDaysUsed;

    // Status color
    let statusColor = 'var(--vacation-approved)'; // Green
    if (daysRemaining <= 3) statusColor = '#f59e0b'; // Orange
    if (daysRemaining <= 0) statusColor = '#ef4444'; // Red

    const startEditingVacation = (vacation) => {
        setEditingVacationId(vacation.id);
        setEditStartDate(vacation.startDate);
        setEditEndDate(vacation.endDate);
    };

    const cancelEditingVacation = () => {
        setEditingVacationId(null);
        setEditStartDate('');
        setEditEndDate('');
    };

    const saveEditedVacation = (originalVacation) => {
        if (!editStartDate || !editEndDate) return;

        onSaveVacation({
            ...originalVacation,
            startDate: editStartDate,
            endDate: editEndDate
        });
        setEditingVacationId(null);
    };


    return (
        <div style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 className="title" style={{ fontSize: '1.2rem' }}>Ficha del Empleado</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', flexDirection: 'column' }}>

                    {/* LEFT COLUMN: Employee Details */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {/* Basic Info */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                            gap: '1rem'
                        }}>
                            <div>
                                <label style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: '4px', display: 'block' }}>Nombre</label>
                                <input
                                    className="input-base"
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: '4px', display: 'block' }}>Cargo</label>
                                <select
                                    value={role}
                                    onChange={e => setRole(e.target.value)}
                                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-light)', backgroundColor: 'white' }}
                                >
                                    <option value="">Seleccionar cargo...</option>
                                    <option value="Taller">Taller</option>
                                    <option value="Administración">Administración</option>
                                    <option value="Gerencia">Gerencia</option>
                                    <option value="Diseño">Diseño</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: '4px', display: 'block' }}>PIN</label>
                                <input
                                    className="input-base"
                                    type="text"
                                    maxLength="4"
                                    placeholder="Ej. 1234"
                                    value={pin}
                                    onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-light)', letterSpacing: '2px', textAlign: 'center' }}
                                />
                            </div>
                        </div>

                        {/* Incompatibility Section */}
                        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem', color: '#f59e0b' }}>
                                <AlertTriangle size={18} />
                                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Restricciones de Solapamiento</span>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                                Empleados con los que no debería coincidir.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '120px', overflowY: 'auto', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '0.5rem' }}>
                                {allEmployees
                                    .filter(e => e.id !== employee.id) // Exclude self
                                    .map(other => (
                                        <label key={other.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', cursor: 'pointer', padding: '4px' }}>
                                            <input
                                                type="checkbox"
                                                checked={incompatibleIds.includes(other.id)}
                                                onChange={() => handleToggleIncompatibility(other.id)}
                                                style={{ width: '16px', height: '16px' }}
                                            />
                                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{other.name}</span>
                                        </label>
                                    ))}
                            </div>
                        </div>

                        {/* Vacations Section */}
                        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)' }}>
                                    <Calendar size={18} />
                                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Vacaciones Asignadas</span>
                                </div>

                                {/* Vacation Counter */}
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    background: '#f1f5f9', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', flexWrap: 'wrap'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Clock size={14} className="text-muted" />
                                        <span>Consumidos: <strong>{totalDaysUsed}</strong></span>
                                    </div>
                                    <div className="hide-mobile" style={{ width: '1px', height: '14px', background: '#cbd5e1' }}></div>
                                    <div style={{ fontWeight: 600, color: statusColor }}>
                                        Restantes: {daysRemaining}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }}>
                                {employeeVacations.length === 0 ? (
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No tiene vacaciones asignadas.</p>
                                ) : (
                                    employeeVacations.map(vac => {
                                        const isEditing = editingVacationId === vac.id;
                                        const vacDays = countWorkingDays(parseISO(vac.startDate), parseISO(vac.endDate));

                                        if (isEditing) {
                                            return (
                                                <div key={vac.id} style={{ display: 'flex', gap: '6px', alignItems: 'center', background: '#f8fafc', padding: '6px', borderRadius: '6px', border: '1px solid var(--primary)', flexWrap: 'wrap' }}>
                                                    <input
                                                        type="date"
                                                        value={editStartDate}
                                                        onChange={e => setEditStartDate(e.target.value)}
                                                        style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.75rem', flex: 1, minWidth: '100px' }}
                                                    />
                                                    <input
                                                        type="date"
                                                        value={editEndDate}
                                                        onChange={e => setEditEndDate(e.target.value)}
                                                        style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.75rem', flex: 1, minWidth: '100px' }}
                                                    />
                                                    <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
                                                        <button type="button" onClick={() => saveEditedVacation(vac)} style={{ color: 'green', cursor: 'pointer', background: 'none', border: 'none' }}>
                                                            <Check size={18} />
                                                        </button>
                                                        <button type="button" onClick={cancelEditingVacation} style={{ color: 'gray', cursor: 'pointer', background: 'none', border: 'none' }}>
                                                            <X size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        }

                                        return (
                                            <div key={vac.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-light)', gap: '0.5rem' }}>
                                                <div style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                                    <span style={{ fontWeight: 500 }}>{format(parseISO(vac.startDate), 'dd/MM/yyyy')}</span>
                                                    <span style={{ color: '#94a3b8' }}>➔</span>
                                                    <span style={{ fontWeight: 500 }}>{format(parseISO(vac.endDate), 'dd/MM/yyyy')}</span>
                                                    <span style={{ fontSize: '0.7rem', background: '#e2e8f0', padding: '2px 6px', borderRadius: '10px', color: 'var(--primary)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                                                        {vacDays} lab.
                                                    </span>
                                                </div>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <button type="button" onClick={() => startEditingVacation(vac)} style={{ color: 'var(--text-muted)', cursor: 'pointer', background: 'none', border: 'none' }}>
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button type="button" onClick={() => onDeleteVacation(vac.id)} style={{ color: '#ef4444', cursor: 'pointer', background: 'none', border: 'none' }}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* Footer Buttons */}
                        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '8px' }}>
                            <button
                                type="button"
                                onClick={() => {
                                    if (confirm(`¿Seguro que quieres eliminar a ${employee.name}? Se borrarán todas sus vacaciones.`)) {
                                        onDeleteEmployee && onDeleteEmployee(employee.id);
                                        onClose();
                                    }
                                }}
                                style={{
                                    padding: '0.8rem',
                                    backgroundColor: '#fee2e2',
                                    color: '#ef4444',
                                    border: '1px solid #fecaca',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontWeight: 500
                                }}
                                title="Eliminar empleado definitivamente"
                            >
                                <Trash2 size={18} />
                                <span className="hide-mobile">Eliminar Empleado</span>
                            </button>

                            <button type="submit" className="btn btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0.8rem' }}>
                                <Save size={18} />
                                <span>Guardar Cambios</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
