import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { X, Calendar, Flag, Users, Briefcase } from 'lucide-react';

export default function DayDetailsModal({
    isOpen,
    onClose,
    date,
    events = [],
    isHoliday,
    holidayName,
    vacations = [],
    employees = []
}) {
    if (!isOpen || !date) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '500px', width: '95%', padding: 0 }}>
                {/* Header */}
                <div style={{
                    padding: '1.5rem',
                    background: 'linear-gradient(to right, #f8fafc, #fff)',
                    borderBottom: '1px solid var(--border-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            background: '#e0e7ff', color: '#4338ca',
                            width: '48px', height: '48px', borderRadius: '12px',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.1)'
                        }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                                {format(date, 'MMM', { locale: es })}
                            </span>
                            <span style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1 }}>
                                {format(date, 'd')}
                            </span>
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', margin: 0, textTransform: 'capitalize' }}>
                                {format(date, 'EEEE', { locale: es })}
                            </h2>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
                                {format(date, 'd \de MMMM, yyyy', { locale: es })}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="btn-icon" style={{ background: '#f1f5f9', borderRadius: '50%', padding: '8px' }}>
                        <X size={20} color="#64748b" />
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '60vh', overflowY: 'auto' }}>

                    {/* Empty State */}
                    {!isHoliday && events.length === 0 && vacations.length === 0 && (
                        <div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem 0' }}>
                            <Calendar size={48} style={{ opacity: 0.2, marginBottom: '0.5rem' }} />
                            <p>No hay eventos ni actividades para este día.</p>
                        </div>
                    )}

                    {/* Holidays */}
                    {isHoliday && (
                        <div style={{ display: 'flex', gap: '12px', padding: '1rem', backgroundColor: '#fef2f2', borderRadius: '12px', border: '1px solid #fee2e2' }}>
                            <div style={{ background: '#fecaca', width: '4px', borderRadius: '2px' }}></div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#b91c1c', fontWeight: 700, textTransform: 'uppercase' }}>Festivo</h4>
                                <p style={{ margin: '4px 0 0 0', color: '#7f1d1d', fontWeight: 500 }}>{holidayName}</p>
                            </div>
                        </div>
                    )}

                    {/* Events */}
                    {events.length > 0 && (
                        <div>
                            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Flag size={14} /> Eventos Corporativos
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {events.map(ev => (
                                    <div key={ev.id} style={{
                                        padding: '1rem',
                                        backgroundColor: '#fffbeb',
                                        border: '1px solid #fcd34d',
                                        borderRadius: '10px',
                                        boxShadow: '0 2px 4px rgba(251, 191, 36, 0.05)'
                                    }}>
                                        <div style={{ fontWeight: 700, color: '#92400e', marginBottom: '4px' }}>{ev.name}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#b45309', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            {ev.isGlobal ? (
                                                <span style={{ background: '#f59e0b', color: 'white', padding: '2px 6px', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 700 }}>GLOBAL</span>
                                            ) : (
                                                <span style={{ background: '#fef3c7', color: '#d97706', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>
                                                    {ev.assignedEmployeeIds ? ev.assignedEmployeeIds.length : 0} Empleados
                                                </span>
                                            )}
                                            <span>
                                                {format(new Date(ev.startDate), 'd MMM')} - {format(new Date(ev.endDate), 'd MMM')}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Vacations */}
                    {vacations.length > 0 && (
                        <div>
                            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Briefcase size={14} /> Empleados en Vacaciones
                            </h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
                                {vacations.map(v => {
                                    const emp = employees.find(e => e.id === v.employeeId);
                                    if (!emp) return null;
                                    return (
                                        <div key={v.id} style={{
                                            padding: '0.75rem',
                                            backgroundColor: 'white',
                                            border: '1px solid var(--border-light)',
                                            borderRadius: '8px',
                                            display: 'flex', alignItems: 'center', gap: '8px'
                                        }}>
                                            <div style={{
                                                width: '24px', height: '24px', borderRadius: '50%',
                                                backgroundColor: '#e2e8f0', color: '#64748b',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '0.75rem', fontWeight: 700
                                            }}>
                                                {emp.name.charAt(0)}
                                            </div>
                                            <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#334155' }}>{emp.name}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                </div>

                <div style={{ padding: '1rem', background: '#f8fafc', borderTop: '1px solid var(--border-light)', borderRadius: '0 0 16px 16px', textAlign: 'right' }}>
                    <button onClick={onClose} className="btn" style={{ background: 'white', border: '1px solid var(--border-light)', color: '#64748b' }}>
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
