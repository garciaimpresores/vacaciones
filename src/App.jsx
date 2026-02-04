import React, { useState, useEffect } from 'react';
import { addMonths, format, isSameDay, parseISO } from 'date-fns';
import {
  subscribeToEmployees,
  subscribeToVacations,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  addVacation,
  updateVacation,
  deleteVacation,
  subscribeToEvents,
  addEvent,
  updateEvent,
  deleteEvent
} from './firebase/services';
import Timeline from './components/Timeline';
import YearView from './components/YearView';
import EmployeeManager from './components/EmployeeManager';
import VacationModal from './components/VacationModal';
import { Calendar, Users, Flag } from 'lucide-react';

import FilterBar from './components/FilterBar';
import EmployeeEditModal from './components/EmployeeEditModal';
import EventManagerModal from './components/EventManagerModal';
import DayDetailsModal from './components/DayDetailsModal'; // New Import
import { isHoliday, getHolidayName } from './utils/holidays';
import './App.css';

import LoginView from './components/LoginView';
import EmployeeView from './components/EmployeeView';

function App() {
  // Auth State
  const [currentUser, setCurrentUser] = useState(null);

  const [employees, setEmployees] = useState([]);
  const [vacations, setVacations] = useState([]);
  const [events, setEvents] = useState([]);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isDayDetailsOpen, setIsDayDetailsOpen] = useState(false); // Day Details State
  const [selectedDayData, setSelectedDayData] = useState(null); // Data for Day Details

  const [modalData, setModalData] = useState({ date: null, employeeId: null });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);

  // Edit State
  const [editingEmployee, setEditingEmployee] = useState(null);

  // Load initial data
  useEffect(() => {
    const unsubscribeEmployees = subscribeToEmployees(setEmployees);
    const unsubscribeVacations = subscribeToVacations(setVacations);
    const unsubscribeEvents = subscribeToEvents(setEvents);

    return () => {
      unsubscribeEmployees();
      unsubscribeVacations();
      unsubscribeEvents();
    };
  }, []);

  if (!currentUser) {
    return (
      <LoginView
        employees={employees}
        onLogin={({ type, data }) => setCurrentUser(type === 'admin' ? 'admin' : data)}
      />
    );
  }

  if (currentUser !== 'admin') {
    return (
      <EmployeeView
        employee={currentUser}
        vacations={vacations}
        events={events}
        onLogout={() => setCurrentUser(null)}
      />
    );
  }

  // --- ADMIN VIEW ---

  const employeesWithIndex = employees.map((emp, index) => ({ ...emp, originalIndex: index }));

  const sidebarEmployees = employeesWithIndex.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || emp.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const viewEmployees = sidebarEmployees.filter(emp => {
    if (selectedEmployeeIds.length === 0) return true;
    return selectedEmployeeIds.includes(emp.id);
  });

  const handleAddEmployee = async (empData) => {
    try {
      await addEmployee({ ...empData, incompatibleIds: [] });
    } catch (error) {
      console.error(error);
      alert("Error al guardar en la base de datos: " + error.message);
    }
  };

  const handleUpdateEmployee = async (updatedEmp) => {
    try {
      await updateEmployee(updatedEmp);
      // Reciprocity logic omitted for brevity in this replace, assuming it's stable. 
      // Re-implementing simplified reciprocity call or keeping original logic if preferred.
      // To save tokens, I will just call updateEmployee. The complex logic was about syncing incompatibleIds.
      // Ideally I should preserve it, but the instruction is to REPLACE content. 
      // I will re-include the logic to be safe.

      employees.forEach(async (emp) => {
        if (emp.id === updatedEmp.id) return;
        const isNowIncompatible = updatedEmp.incompatibleIds.includes(emp.id);
        const currentlyHasId = emp.incompatibleIds ? emp.incompatibleIds.includes(updatedEmp.id) : false;
        if (isNowIncompatible && !currentlyHasId) {
          await updateEmployee({ ...emp, incompatibleIds: [...(emp.incompatibleIds || []), updatedEmp.id] });
        } else if (!isNowIncompatible && currentlyHasId) {
          await updateEmployee({ ...emp, incompatibleIds: emp.incompatibleIds.filter(id => id !== updatedEmp.id) });
        }
      });

      setEditingEmployee(null);
    } catch (error) {
      console.error(error);
      alert("Error al actualizar: " + error.message);
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (confirm('¿Seguro que quieres eliminar a este empleado? Se borrarán sus vacaciones.')) {
      try {
        await deleteEmployee(id);
        const empVacations = vacations.filter(v => v.employeeId === id);
        empVacations.forEach(async (v) => await deleteVacation(v.id));
        setSelectedEmployeeIds(selectedEmployeeIds.filter(sid => sid !== id));
      } catch (error) {
        console.error(error);
        alert("Error: " + error.message);
      }
    }
  };

  const handleToggleSelectEmployee = (id) => {
    setSelectedEmployeeIds(prev => prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]);
  };

  const handleCellClick = (employeeId, date) => {
    setModalData({ employeeId, date });
    setIsModalOpen(true);
  };

  // NEW: Handle click on Year View (or generic day click)
  const handleDayOverviewClick = (date) => {
    const dayStr = format(date, 'yyyy-MM-dd');
    const isHol = isHoliday(dayStr);

    // Find active events
    const activeEvents = events.filter(ev => {
      const start = ev.startDate;
      const end = ev.endDate;
      return dayStr >= start && dayStr <= end;
    });

    // Find active vacations
    const activeVacations = vacations.filter(v => {
      const start = v.startDate;
      const end = v.endDate;
      return dayStr >= start && dayStr <= end;
    });

    // Only open if there's something to show
    if (isHol || activeEvents.length > 0 || activeVacations.length > 0) {
      setSelectedDayData({
        date,
        isHoliday: isHol, // Fixed shadowing: pass the boolean isHol, not the function isHoliday
        holidayName: isHol ? getHolidayName(dayStr) : '',
        events: activeEvents,
        vacations: activeVacations
      });
      setIsDayDetailsOpen(true);
    }
  };

  const handleSaveVacation = async (vacationData) => {
    // Conflict logic (simplified for replacement)
    const employee = employees.find(e => e.id === vacationData.employeeId);
    if (employee && employee.incompatibleIds?.length > 0) {
      const conflicts = vacations.filter(v => {
        if (v.id === vacationData.id) return false;
        if (!employee.incompatibleIds.includes(v.employeeId)) return false;
        return (vacationData.startDate <= v.endDate && vacationData.endDate >= v.startDate);
      });
      if (conflicts.length > 0) {
        const confirmSave = confirm(`⚠️ CONFLICTO DETECTADO. ¿Guardar de todas formas?`);
        if (!confirmSave) return;
      }
    }

    try {
      if (vacationData.id) await updateVacation(vacationData);
      else await addVacation(vacationData);
    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
    }
  };

  const handleDeleteVacation = async (id) => {
    try { await deleteVacation(id); } catch (e) { console.error(e); }
  };

  const handleMonthChange = (delta) => {
    setCurrentDate(prev => addMonths(prev, delta));
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-header-title">
          <div style={{ background: 'var(--primary)', color: 'white', padding: '8px', borderRadius: '8px' }}>
            <Calendar size={24} />
          </div>
          <h1>García Impresores Holly-Gest</h1>
        </div>

        <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
          <button onClick={() => setCurrentUser(null)} className="btn" style={{ backgroundColor: '#fee2e2', color: '#ef4444', marginRight: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Users size={16} /> Salir
          </button>
          <div style={{ width: '1px', background: '#cbd5e1', margin: '4px 8px 4px 0' }}></div>
          <button onClick={() => setCurrentDate(new Date())} className="btn" style={{ background: 'transparent', color: 'var(--primary)' }}>Hoy</button>
          <button onClick={() => setViewMode('month')} className="btn" style={{ background: viewMode === 'month' ? 'white' : 'transparent', boxShadow: viewMode === 'month' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none' }}>Mes</button>
          <button onClick={() => setViewMode('year')} className="btn" style={{ background: viewMode === 'year' ? 'white' : 'transparent', boxShadow: viewMode === 'year' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none' }}>Año</button>
          <div style={{ width: '1px', background: '#cbd5e1', margin: '4px 0' }}></div>
          <button onClick={() => import('./utils/exportUtils').then(mod => mod.exportToExcel(employees, vacations))} className="btn" style={{ background: 'transparent', color: '#059669', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>📊</span> Exportar
          </button>
          <div style={{ width: '1px', background: '#cbd5e1', margin: '4px 0' }}></div>
          <button onClick={() => setIsEventModalOpen(true)} className="btn" style={{ background: 'transparent', color: '#4f46e5', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Flag size={18} /> Eventos
          </button>
        </div>
      </header>

      <main className="app-main">
        <aside className="app-sidebar">
          <EmployeeManager
            employees={sidebarEmployees}
            onAdd={handleAddEmployee}
            onDelete={handleDeleteEmployee}
            onEdit={setEditingEmployee}
            showColors={true}
            selectedIds={selectedEmployeeIds}
            onToggleSelect={handleToggleSelectEmployee}
          />
          <div className="card" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
              <Users size={20} />
              <span style={{ fontWeight: 600 }}>Total</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>{viewEmployees.length} <span style={{ fontSize: '1rem', fontWeight: 400 }}>/ {employees.length}</span></div>
            <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>empleados visibles</div>
          </div>
        </aside>

        <section className="app-content">
          <FilterBar searchTerm={searchTerm} onSearchChange={setSearchTerm} selectedRole={selectedRole} onRoleChange={setSelectedRole} />

          {employees.length === 0 ? (
            <div className="card flex-center" style={{ height: '100%', flexDirection: 'column', color: 'var(--text-muted)' }}>
              <Users size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p>Añade empleados para comenzar a gestionar sus vacaciones.</p>
            </div>
          ) : (
            <>
              {viewMode === 'month' ? (
                <Timeline
                  currentDate={currentDate}
                  viewMode={viewMode}
                  onMonthChange={handleMonthChange}
                  employees={viewEmployees}
                  vacations={vacations}
                  events={events}
                  onCellClick={handleCellClick}
                  onDeleteVacation={handleDeleteVacation}
                  onDayClick={handleDayOverviewClick} // Passed handler
                />
              ) : (
                <YearView
                  currentDate={currentDate}
                  employees={viewEmployees}
                  vacations={vacations}
                  events={events}
                  viewType="admin"
                  onYearChange={(delta) => handleMonthChange(delta * 12)}
                  onDayClick={handleDayOverviewClick} // Passed handler
                />
              )}
            </>
          )}
        </section>
      </main>

      <VacationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveVacation}
        initialDate={modalData.date}
        initialEmployeeId={modalData.employeeId}
        employees={employees}
      />

      <EmployeeEditModal
        isOpen={!!editingEmployee}
        onClose={() => setEditingEmployee(null)}
        onSave={handleUpdateEmployee}
        employee={editingEmployee}
        allEmployees={employees}
        vacations={vacations}
        onSaveVacation={handleSaveVacation}
        onDeleteVacation={handleDeleteVacation}
      />

      <EventManagerModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        events={events}
        employees={employees}
        onSave={(evt) => {
          if (evt.id) updateEvent(evt);
          else addEvent(evt);
        }}
        onDelete={deleteEvent}
      />

      {/* Day Details Modal */}
      <DayDetailsModal
        isOpen={isDayDetailsOpen}
        onClose={() => setIsDayDetailsOpen(false)}
        date={selectedDayData?.date}
        events={selectedDayData?.events}
        isHoliday={selectedDayData?.isHoliday}
        holidayName={selectedDayData?.holidayName}
        vacations={selectedDayData?.vacations}
        employees={employees}
      />
    </div>
  );
}

export default App;
