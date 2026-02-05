import React, { useState } from 'react';
import { Lock, Users, LogIn, KeyRound } from 'lucide-react';

export default function LoginView({ employees, onLogin }) {
    const [mode, setMode] = useState('employee'); // 'admin' | 'employee'
    const [adminPassword, setAdminPassword] = useState('');
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');

    const handleAdminLogin = (e) => {
        e.preventDefault();
        // Hardcoded password for simplicity as requested
        if (adminPassword === 'admin123') {
            onLogin({ type: 'admin' });
        } else {
            setError('Contraseña incorrecta');
            setAdminPassword('');
        }
    };

    const handleEmployeeLogin = (e) => {
        e.preventDefault();
        if (!selectedEmployeeId) {
            setError('Selecciona tu nombre');
            return;
        }
        const employee = employees.find(e => e.id === selectedEmployeeId);
        if (employee && employee.pin === pin) { // Simple string comparison
            onLogin({ type: 'employee', data: employee });
        } else {
            setError('PIN incorrecto');
            setPin('');
        }
    };

    // Switch tabs clears errors
    const switchMode = (newMode) => {
        setMode(newMode);
        setError('');
        setAdminPassword('');
        setPin('');
        setSelectedEmployeeId('');
    };

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            minHeight: '100vh', background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)', padding: '1rem'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem 1.5rem' }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>García Impresores</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Portal de Vacaciones</p>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-light)' }}>
                    <button
                        onClick={() => switchMode('employee')}
                        style={{
                            flex: 1, padding: '1rem', border: 'none', background: 'none', cursor: 'pointer',
                            borderBottom: mode === 'employee' ? '2px solid var(--primary)' : '2px solid transparent',
                            color: mode === 'employee' ? 'var(--primary)' : 'var(--text-muted)',
                            fontWeight: 600
                        }}
                    >
                        Empleados
                    </button>
                    <button
                        onClick={() => switchMode('admin')}
                        style={{
                            flex: 1, padding: '1rem', border: 'none', background: 'none', cursor: 'pointer',
                            borderBottom: mode === 'admin' ? '2px solid var(--primary)' : '2px solid transparent',
                            color: mode === 'admin' ? 'var(--primary)' : 'var(--text-muted)',
                            fontWeight: 600
                        }}
                    >
                        Administrador
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div style={{
                        background: '#fee2e2', color: '#ef4444', padding: '0.75rem', borderRadius: '8px',
                        marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                {/* ADMIN FORM */}
                {mode === 'admin' && (
                    <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Contraseña Maestra</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                                <input
                                    type="password"
                                    value={adminPassword}
                                    onChange={e => setAdminPassword(e.target.value)}
                                    className="input-base"
                                    style={{ width: '100%', paddingLeft: '40px' }}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}>
                            <LogIn size={20} /> Entrar como Admin
                        </button>
                    </form>
                )}

                {/* EMPLOYEE FORM */}
                {mode === 'employee' && (
                    <form onSubmit={handleEmployeeLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Tu Nombre</label>
                            <div style={{ position: 'relative' }}>
                                <Users size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                                <select
                                    value={selectedEmployeeId}
                                    onChange={e => setSelectedEmployeeId(e.target.value)}
                                    className="input-base"
                                    style={{ width: '100%', paddingLeft: '40px', appearance: 'none', backgroundColor: 'white' }}
                                >
                                    <option value="">Selecciona tu nombre...</option>
                                    {employees.map(emp => (
                                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>PIN de Acceso</label>
                            <div style={{ position: 'relative' }}>
                                <KeyRound size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                                <input
                                    type="password"
                                    value={pin}
                                    onChange={e => setPin(e.target.value)}
                                    className="input-base"
                                    style={{ width: '100%', paddingLeft: '40px', letterSpacing: '2px' }}
                                    placeholder="••••"
                                    maxLength={4}
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}>
                            <LogIn size={20} /> Ver Mis Vacaciones
                        </button>
                    </form>
                )}

            </div>
        </div>
    );
}
