import React from 'react';
import { Search, Filter } from 'lucide-react';

export default function FilterBar({ searchTerm, onSearchChange, selectedRole, onRoleChange }) {
    return (
        <div className="card" style={{
            marginBottom: '1rem',
            padding: '0.75rem 1rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center',
            background: 'white'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                <Filter size={18} />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Filtros:</span>
            </div>

            {/* Name Search */}
            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                    type="text"
                    placeholder="Buscar empleado..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '0.5rem 0.5rem 0.5rem 2.2rem',
                        borderRadius: '6px',
                        border: '1px solid var(--border-light)',
                        fontSize: '0.9rem'
                    }}
                />
            </div>

            {/* Role Filter */}
            <div style={{ minWidth: '180px' }}>
                <select
                    value={selectedRole}
                    onChange={(e) => onRoleChange(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        border: '1px solid var(--border-light)',
                        fontSize: '0.9rem',
                        backgroundColor: 'white'
                    }}
                >
                    <option value="all">Todos los cargos</option>
                    <option value="Taller">Taller</option>
                    <option value="Administración">Administración</option>
                    <option value="Gerencia">Gerencia</option>
                    <option value="Diseño">Diseño</option>
                </select>
            </div>
        </div>
    );
}
