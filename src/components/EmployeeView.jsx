import React, { useState } from 'react';
import { Calendar, LogOut, Clock, Eye, EyeOff } from 'lucide-react';
import { format, parseISO, startOfMonth, addMonths, endOfMonth, eachDayOfInterval, isSameDay, isWeekend, differenceInCalendarDays, startOfYear, endOfYear, max, min, isWithinInterval, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import DayDetailsModal from './DayDetailsModal';
import YearView from './YearView';
import { isHoliday, getHolidayName } from '../utils/holidays';

export default function EmployeeView({ employee, vacations = [], events = [], onLogout }) { // Added events default
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState('month'); // 'month' | 'year'
    const [showEvents, setShowEvents] = useState(true); // New Toggle State

    // Day Details State
    const [isDayDetailsOpen, setIsDayDetailsOpen] = useState(false);
    const [selectedDayData, setSelectedDayData] = useState(null);

    // 1. Filter vacations for THIS employee only
    const myVacations = vacations.filter(v => v.employeeId === employee.id);

    // 2. Filter Events for THIS employee
    const myEvents = events.filter(ev => {
        if (!showEvents) return false;
        return ev.isGlobal || (ev.assignedEmployeeIds && ev.assignedEmployeeIds.includes(employee.id));
    });

    // ... (Calculate Stats - unchanged)
    const currentYear = new Date().getFullYear();
    const currentYearStart = startOfYear(new Date());
    const currentYearEnd = endOfYear(new Date());
    const totalDaysUsed = myVacations.reduce((acc, vac) => {
        const start = parseISO(vac.startDate);
        const end = parseISO(vac.endDate);
        const overlapStart = max([start, currentYearStart]);
        const overlapEnd = min([end, currentYearEnd]);
        return (overlapStart <= overlapEnd) ? acc + (differenceInCalendarDays(overlapEnd, overlapStart) + 1) : acc;
    }, 0);
    const TOTAL_VACATION_DAYS = 30;
    const daysRemaining = TOTAL_VACATION_DAYS - totalDaysUsed;
    let statusColor = 'var(--vacation-approved)';
    if (daysRemaining <= 5) statusColor = '#f59e0b';
    if (daysRemaining <= 0) statusColor = '#ef4444';

    // Handler for Day Click
    const handleDayClick = (day) => {
        const dayStr = format(day, 'yyyy-MM-dd');
        const isHol = isHoliday(dayStr);

        // Check for activity on this day
        const dayVacations = myVacations.filter(v => dayStr >= v.startDate && dayStr <= v.endDate);
        const dayEvents = myEvents.filter(ev => dayStr >= ev.startDate && dayStr <= ev.endDate);

        if (isHol || dayVacations.length > 0 || dayEvents.length > 0) {
            setSelectedDayData({
                date: day,
                isHoliday: isHol,
                holidayName: isHol ? getHolidayName(dayStr) : '',
                events: dayEvents,
                vacations: dayVacations
            });
            setIsDayDetailsOpen(true);
        }
    };

    // 3. Calendar Rendering Logic
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Helper to check if a day is vacation OR event
    const getDayStatus = (day) => {
        const isVacation = myVacations.some(v => {
            const start = parseISO(v.startDate);
            const end = parseISO(v.endDate);
            return day >= start && day <= end;
        });
        if (isVacation) return 'vacation';

        const hasEvent = myEvents.some(ev => {
            const dayStr = format(day, 'yyyy-MM-dd');
            return dayStr >= ev.startDate && dayStr <= ev.endDate;
        });
        if (hasEvent) return 'event';

        return null;
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '2rem' }}>
            {/* Header */}
            <header className="app-header">
                <div className="app-header-title">
                    <div style={{ background: 'var(--primary)', color: 'white', padding: '8px', borderRadius: '8px', flexShrink: 0 }}>
                        <Calendar size={24} />
                    </div>
                    <h1 style={{ margin: 0 }}>Portal del Empleado</h1>
                </div>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-start'
                }}>
                    {/* Event Visibility Toggle */}
                    <button
                        onClick={() => setShowEvents(!showEvents)}
                        className="btn"
                        style={{
                            background: showEvents ? '#e0f2fe' : 'transparent',
                            color: showEvents ? '#0284c7' : 'var(--text-muted)',
                            border: showEvents ? '1px solid #7dd3fc' : '1px solid var(--border-light)',
                            padding: '0.4rem 0.6rem',
                            fontSize: '0.75rem',
                            display: 'flex', alignItems: 'center', gap: '6px',
                            whiteSpace: 'nowrap'
                        }}
                        title={showEvents ? "Ocultar Eventos" : "Mostrar Eventos"}
                    >
                        {showEvents ? <Eye size={16} /> : <EyeOff size={16} />}
                        <span className="hide-mobile">{showEvents ? 'Eventos Visibles' : 'Eventos Ocultos'}</span>
                    </button>

                    <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
                        <button
                            onClick={() => setViewMode('month')}
                            className="btn"
                            style={{
                                backgroundColor: viewMode === 'month' ? 'white' : 'transparent',
                                boxShadow: viewMode === 'month' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                                padding: '0.4rem 0.8rem', fontSize: '0.85rem'
                            }}
                        >
                            Mes
                        </button>
                        <button
                            onClick={() => setViewMode('year')}
                            className="btn"
                            style={{
                                backgroundColor: viewMode === 'year' ? 'white' : 'transparent',
                                boxShadow: viewMode === 'year' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                                padding: '0.4rem 0.8rem', fontSize: '0.85rem'
                            }}
                        >
                            Año
                        </button>
                    </div>

                    <div className="hide-mobile" style={{ width: '1px', height: '24px', background: '#cbd5e1' }}></div>

                    <div style={{ textAlign: 'right', minWidth: 'fit-content' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{employee.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }} className="hide-tablet">{employee.role}</div>
                    </div>
                    <button onClick={onLogout} className="btn" style={{ background: '#FECACA', color: '#DC2626', padding: '0.5rem 0.8rem', fontSize: '0.85rem' }}>
                        <LogOut size={16} /> <span className="hide-mobile">Salir</span>
                    </button>
                </div>
            </header>

            <main className="app-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem' }}>

                {/* (Stats Cards) */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '1rem',
                    marginBottom: '2rem'
                }}>
                    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: '#eff6ff', borderRadius: '10px', color: 'var(--primary)' }}>
                            <Clock size={20} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Días Totales</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{TOTAL_VACATION_DAYS}</div>
                        </div>
                    </div>

                    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: '#ECFDF5', borderRadius: '10px', color: '#059669' }}>
                            <Calendar size={20} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Consumidos ({currentYear})</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{totalDaysUsed}</div>
                        </div>
                    </div>

                    <div className="card" style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem',
                        borderLeft: `4px solid ${statusColor}`
                    }}>
                        <div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Restantes</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: statusColor }}>{daysRemaining}</div>
                        </div>
                    </div>
                </div>


                {/* Calendar View */}
                {viewMode === 'month' ? (
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Mis Vacaciones</h2>
                            <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
                                <button onClick={() => setCurrentDate(addMonths(currentDate, -1))} className="btn" style={{ background: 'white' }}>←</button>
                                <span style={{ padding: '0.5rem 1rem', fontWeight: 600, minWidth: '120px', textAlign: 'center' }}>
                                    {format(currentDate, 'MMMM yyyy', { locale: es }).replace(/^\w/, c => c.toUpperCase())}
                                </span>
                                <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="btn" style={{ background: 'white' }}>→</button>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center' }}>
                            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
                                <div key={day} style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{day}</div>
                            ))}

                            {/* Empty cells for start of month */}
                            {Array.from({ length: (startOfMonth(currentDate).getDay() + 6) % 7 }).map((_, i) => (
                                <div key={`empty-${i}`} />
                            ))}

                            {daysInMonth.map(day => {
                                const dayStr = format(day, 'yyyy-MM-dd');

                                // Check Vacation
                                const isVacation = myVacations.some(v => {
                                    return dayStr >= v.startDate && dayStr <= v.endDate;
                                });

                                // Check Event
                                const dayEvents = myEvents.filter(ev => {
                                    return dayStr >= ev.startDate && dayStr <= ev.endDate;
                                });
                                const isEvent = dayEvents.length > 0;

                                const isWeekendDay = isWeekend(day);
                                const isToday = isSameDay(day, new Date());
                                const isHol = isHoliday(dayStr);
                                const holName = isHol ? getHolidayName(dayStr) : '';

                                let bgColor = isWeekendDay ? '#f8fafc' : (isHol ? '#fee2e2' : 'white');
                                let color = isWeekendDay ? '#94a3b8' : 'inherit';
                                let border = '1px solid var(--border-light)';
                                let title = isHol ? holName : '';

                                if (isVacation) {
                                    bgColor = 'var(--vacation-approved)';
                                    color = 'white';
                                    border = 'none';
                                    title = 'Vacaciones';
                                }

                                // Removed boxShadow logic as per instruction

                                if (isVacation) {
                                    bgColor = 'var(--vacation-approved)';
                                    color = 'white';
                                    border = 'none';
                                    title = 'Vacaciones';
                                }

                                if (isEvent) {
                                    if (!isVacation) {
                                        // If only event, show event style
                                        bgColor = '#fcd34d'; // Amber 300
                                        color = '#78350f'; // Amber 900
                                        border = '1px dashed #d97706';
                                    }
                                    title = (title ? title + '\n' : '') + `Evento: ${dayEvents.map(e => e.name).join(', ')}`;
                                }

                                if (isToday) {
                                    border = '2px solid var(--primary)';
                                }

                                const hasInteraction = isEvent || isVacation || isHol;

                                return (
                                    <div key={day.toString()}
                                        onClick={() => handleDayClick(day)}
                                        title={title}
                                        style={{
                                            padding: '1rem',
                                            borderRadius: '8px',
                                            background: bgColor,
                                            border: border,
                                            // No more ugly box-shadow
                                            color: color,
                                            fontWeight: (isVacation || isEvent) ? 600 : 400,
                                            position: 'relative',
                                            cursor: hasInteraction ? 'pointer' : 'default',
                                            transition: 'transform 0.1s'
                                        }}>
                                        {format(day, 'd')}

                                        {/* Event Indicator Dot */}
                                        {isEvent && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '4px',
                                                right: '4px',
                                                width: '8px',
                                                height: '8px',
                                                borderRadius: '50%',
                                                backgroundColor: '#d97706', // Amber 600
                                                border: '1px solid white',
                                                zIndex: 3
                                            }} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div>
                        <YearView
                            currentDate={currentDate}
                            employees={[employee]}
                            vacations={myVacations}
                            events={myEvents} // Pass filtered events
                            style={{ height: 'auto', overflow: 'visible', padding: '0' }}
                            viewType="employee"
                            onYearChange={(delta) => setCurrentDate(date => addMonths(date, delta * 12))}
                            onDayClick={handleDayClick} // Pass handler
                        />
                    </div>
                )}
            </main>

            {/* Day Details Modal */}
            <DayDetailsModal
                isOpen={isDayDetailsOpen}
                onClose={() => setIsDayDetailsOpen(false)}
                date={selectedDayData?.date}
                events={selectedDayData?.events}
                isHoliday={selectedDayData?.isHoliday}
                holidayName={selectedDayData?.holidayName}
                vacations={selectedDayData?.vacations}
                employees={[employee]} // Only show current employee in modal context if needed, or pass all for context? Usually redundant for employee view but safe.
            />
        </div>
    );
}
