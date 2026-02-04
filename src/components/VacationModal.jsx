import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { format, addDays } from 'date-fns';

export default function VacationModal({ isOpen, onClose, onSave, initialDate, initialEmployeeId, employees }) {
    if (!isOpen) return null;

    const [employeeId, setEmployeeId] = useState(initialEmployeeId);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        if (initialDate) {
            setStartDate(format(initialDate, 'yyyy-MM-dd'));
            setEndDate(format(addDays(initialDate, 7), 'yyyy-MM-dd')); // Default to 1 week
        }
        if (initialEmployeeId) {
            setEmployeeId(initialEmployeeId);
        }
    }, [initialDate, initialEmployeeId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ employeeId, startDate, endDate });
        onClose();
    };

    const employee = employees.find(e => e.id === employeeId);

    return (
        <div style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
            <div className="card" style={{ width: '400px', animation: 'fadeIn 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <h3 className="title">Añadir Vacaciones</h3>
                    <button onClick={onClose}><X /></button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>Empleado</label>
                        <div style={{ padding: '0.5rem', background: '#f1f5f9', borderRadius: '8px' }}>
                            {employee ? employee.name : 'Seleccionar...'}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>Desde</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>Hasta</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button type="button" onClick={onClose} className="btn" style={{ background: '#f1f5f9' }}>Cancelar</button>
                        <button type="submit" className="btn btn-primary">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
