import React, { useMemo } from 'react';
import {
    format,
    startOfYear,
    endOfYear,
    eachMonthOfInterval,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameDay,
    getDay,
    isWeekend,
    parseISO,
    isWithinInterval,
    startOfDay
} from 'date-fns';
import { es } from 'date-fns/locale';
import { getEmployeeColor } from '../utils/colors';
import { getVacationConflict } from '../utils/conflicts';
import { isHoliday, getHolidayName } from '../utils/holidays';

// ... imports
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function YearView({ currentDate, employees, vacations, events, style, viewType = 'admin', onYearChange, onDayClick }) {
    const months = useMemo(() => {
        return eachMonthOfInterval({
            start: startOfYear(currentDate),
            end: endOfYear(currentDate)
        });
    }, [currentDate]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', ...style }}>
            {/* Navigation Header */}
            <div style={{
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-light)',
                backgroundColor: 'white',
                borderRadius: '12px 12px 0 0', // Rounded top if standalone, but usually inside container
                marginBottom: '1rem'
            }}>
                <h2 className="title" style={{ textTransform: 'capitalize', margin: 0 }}>
                    {format(currentDate, 'yyyy', { locale: es })}
                </h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        className="btn"
                        style={{ background: 'var(--bg-app)', padding: '0.5rem' }}
                        onClick={() => onYearChange && onYearChange(-1)}
                        title="Año Anterior"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        className="btn"
                        style={{ background: 'var(--bg-app)', padding: '0.5rem' }}
                        onClick={() => onYearChange && onYearChange(1)}
                        title="Año Siguiente"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem',
                padding: '0 1rem 1rem 1rem',
                overflowY: 'auto',
                flex: 1
            }}>
                {months.map((month, idx) => (
                    <MonthGrid
                        key={month.toISOString()}
                        month={month}
                        employees={employees}
                        vacations={vacations}
                        events={events} // Pass events here
                        viewType={viewType}
                        onDayClick={onDayClick} // Pass handler
                    />
                ))}
            </div>
        </div>
    );
}

// ... imports remain same ...

// ... Inside MonthGrid
function MonthGrid({ month, employees, vacations, events = [], viewType, onDayClick }) {
    const allDays = useMemo(() => {
        const monthStart = startOfMonth(month);
        const monthEnd = endOfMonth(month);
        const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
        const startDay = getDay(monthStart);
        const leadingBlanksCount = startDay === 0 ? 6 : startDay - 1;
        return { days, leading: leadingBlanksCount };
    }, [month]);

    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid var(--border-light)',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden' // Clean corners
        }}>
            {/* Header */}
            <div style={{ padding: '1rem 0.5rem', borderBottom: '1px solid var(--border-light)', textAlign: 'center' }}>
                <h3 style={{ textTransform: 'capitalize', fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                    {format(month, 'MMMM', { locale: es })}
                </h3>
            </div>

            {/* Weekday Headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '0.5rem', gap: '2px' }}>
                {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => (
                    <div key={d} style={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                        {d}
                    </div>
                ))}
            </div>

            {/* Days Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                padding: '0 0.5rem 0.5rem 0.5rem',
                gap: '2px',
                flex: 1
            }}>
                {/* Leading Blanks */}
                {Array(allDays.leading).fill(null).map((_, i) => <div key={`lead-${i}`} />)}

                {/* Days */}
                {allDays.days.map(day => {
                    const dayStr = format(day, 'yyyy-MM-dd');
                    const isWknd = isWeekend(day);
                    const isHol = isHoliday(dayStr);
                    const holName = isHol ? getHolidayName(dayStr) : '';

                    // Filter vacations for this day
                    const activeVacations = vacations.filter(v => dayStr >= v.startDate && dayStr <= v.endDate);

                    // Filter Events for this day
                    const activeEvents = events.filter(ev => {
                        const start = ev.startDate;
                        const end = ev.endDate;
                        const isDateMatch = dayStr >= start && dayStr <= end;

                        if (!isDateMatch) return false;

                        // Relevancy logic
                        if (viewType === 'admin') return true;

                        const myId = employees[0]?.id;
                        if (ev.isGlobal) return true;
                        if (myId && ev.assignedEmployeeIds?.includes(myId)) return true;

                        return false;
                    });
                    const hasEvent = activeEvents.length > 0;

                    // Determine base style (Holidays/Weekends)
                    let bgColor = isWknd ? '#f8fafc' : (isHol ? '#fee2e2' : 'white');
                    let color = isWknd ? '#94a3b8' : 'var(--text-main)';
                    let fontWeight = '400';
                    let borderRadius = '4px';

                    // Get all relevant vacations for this day
                    const dayVacations = activeVacations.filter(v => employees.some(e => e.id === v.employeeId));

                    if (viewType === 'employee') {
                        const myVacation = dayVacations[0];

                        if (myVacation) {
                            bgColor = 'var(--vacation-approved)';
                            color = 'white';
                            fontWeight = '600';
                            // No overlap special style needed for background, Dot will handle it
                        } else if (hasEvent) {
                            // Distinct look for event if no vacation
                            bgColor = '#fcd34d'; // Amber 300
                            color = '#78350f';
                        }

                        // Employee View: Allow click to view details only if event or holiday
                        const canClick = hasEvent || isHol || myVacation;

                        return (
                            <div key={day.toISOString()}
                                onClick={() => canClick && onDayClick && onDayClick(day)}
                                style={{
                                    backgroundColor: bgColor,
                                    color: color,
                                    fontWeight: fontWeight,
                                    borderRadius: borderRadius,
                                    fontSize: '0.8rem',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    height: '32px',
                                    cursor: canClick ? 'pointer' : 'default',
                                    position: 'relative',
                                    border: hasEvent && !myVacation ? '1px dashed #d97706' : 'none',
                                    transition: 'transform 0.1s'
                                }}
                                title={myVacation ? 'Vacaciones' : (hasEvent ? `Evento: ${activeEvents[0].name}` : (isHol ? holName : ''))}
                            >
                                {format(day, 'd')}

                                {/* Event Indicator Dot (Small, Top Right) */}
                                {hasEvent && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '2px',
                                        right: '2px',
                                        width: '4px',
                                        height: '4px',
                                        borderRadius: '50%',
                                        backgroundColor: myVacation ? '#d97706' : 'transparent', // Only show specific dot color over vacation, else background handles it? 
                                        // Actually if background is yellow (event only), dot is invisible or redundant. 
                                        // If background is green (vacation), dot is visible.
                                        border: myVacation ? '1px solid white' : 'none',
                                        zIndex: 3
                                    }} />
                                )}
                            </div>
                        );
                    }

                    // ADMIN VIEW
                    // Allow clicking any day that has content
                    const hasContent = hasEvent || isHol || dayVacations.length > 0;

                    return (
                        <div key={day.toISOString()}
                            onClick={() => hasContent && onDayClick && onDayClick(day)}
                            style={{
                                backgroundColor: bgColor,
                                color: color,
                                fontWeight: fontWeight,
                                borderRadius: borderRadius,
                                fontSize: '0.8rem',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', // Top align
                                height: '36px',
                                cursor: hasContent ? 'pointer' : 'default',
                                position: 'relative',
                                overflow: 'hidden',
                                border: hasEvent ? '1px solid #fcd34d' : 'none', // Subtle border for events
                                transition: 'all 0.1s'
                            }}
                            className={hasContent ? "admin-day-hover" : ""}
                            title={dayVacations.length > 0 ? dayVacations.map(v => {
                                const emp = employees.find(e => e.id === v.employeeId);
                                return `${emp?.name || 'Empleado'}: Vacaciones`;
                            }).join('\n') : (hasEvent ? `Eventos:\n${activeEvents.map(e => e.name).join('\n')}` : (isHol ? holName : ''))}
                        >
                            <span style={{ zIndex: 2, marginTop: '2px' }}>{format(day, 'd')}</span>

                            {/* EVENT INDICATOR (Top Right Dot) */}
                            {hasEvent && (
                                <div style={{
                                    position: 'absolute',
                                    top: '2px',
                                    right: '2px',
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    backgroundColor: '#d97706', // Amber 600
                                    zIndex: 3
                                }} />
                            )}

                            {/* Vacation Bars Container */}
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1px',
                                padding: '1px'
                            }}>
                                {dayVacations.map((v, i) => {
                                    const emp = employees.find(e => e.id === v.employeeId);
                                    if (!emp) return null;
                                    const empColor = getEmployeeColor(emp.originalIndex ?? employees.indexOf(emp));
                                    return (
                                        <div key={v.id} style={{
                                            height: '4px',
                                            width: '100%',
                                            backgroundColor: empColor,
                                            borderRadius: '2px',
                                            opacity: 0.9
                                        }} />
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* Add simple hover effect style via styled-jsx or just inline in App.css if simplest, but here we can't emit css. 
                Use conditional style.
            */}
        </div>
    );
}
