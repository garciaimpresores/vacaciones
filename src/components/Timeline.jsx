import React, { useMemo } from 'react';
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isToday,
    isWeekend,
    isSameDay,
    startOfDay,
    parseISO,
    isWithinInterval,
    startOfYear,
    endOfYear,
    eachMonthOfInterval,
    getDate,
    isSameMonth
} from 'date-fns';
import { es } from 'date-fns/locale';
import { Trash2, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { getEmployeeColor } from '../utils/colors';
import { getVacationConflict } from '../utils/conflicts';
import { isHoliday, getHolidayName } from '../utils/holidays';

const CELL_WIDTH_MONTH = 40;
const CELL_WIDTH_YEAR = 12; // Small cells
const NAME_WIDTH = 200;

export default function Timeline({
    currentDate,
    viewMode, // 'month' | 'year'
    onMonthChange, // acts as year change in year mode
    employees,
    vacations,
    events, // Added events prop
    onDeleteVacation,
    onCellClick,
    onDayClick // New prop
}) {
    const days = useMemo(() => {
        const start = viewMode === 'year' ? startOfYear(currentDate) : startOfMonth(currentDate);
        const end = viewMode === 'year' ? endOfYear(currentDate) : endOfMonth(currentDate);
        return eachDayOfInterval({ start, end });
    }, [currentDate, viewMode]);

    const months = useMemo(() => {
        if (viewMode !== 'year') return [];
        return eachMonthOfInterval({
            start: startOfYear(currentDate),
            end: endOfYear(currentDate)
        });
    }, [currentDate, viewMode]);

    const cellWidth = viewMode === 'year' ? CELL_WIDTH_YEAR : CELL_WIDTH_MONTH;

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: `${NAME_WIDTH}px repeat(${days.length}, ${cellWidth}px)`,
        width: 'max-content',
        backgroundColor: 'var(--bg-app)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden'
    };

    const handlePrev = () => onMonthChange(viewMode === 'year' ? -12 : -1);
    const handleNext = () => onMonthChange(viewMode === 'year' ? 12 : 1);

    return (
        <div className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>

            {/* Navigation */}
            <div style={{
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-light)',
                flexWrap: 'wrap',
                gap: '0.5rem'
            }}>
                <h2 className="title" style={{
                    textTransform: 'capitalize',
                    fontSize: '1.2rem',
                    margin: 0
                }}>
                    {viewMode === 'year'
                        ? format(currentDate, 'yyyy', { locale: es })
                        : format(currentDate, 'MMMM yyyy', { locale: es })
                    }
                </h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn" style={{ background: 'var(--bg-app)', padding: '0.4rem 0.8rem' }} onClick={handlePrev}>
                        <ChevronLeft size={20} />
                    </button>
                    <button className="btn" style={{ background: 'var(--bg-app)', padding: '0.4rem 0.8rem' }} onClick={handleNext}>
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div style={{ overflowX: 'auto', flex: 1 }}>
                <div style={gridStyle}>

                    {/* Header Row: Months (Year View) or Just "Empleados" (Month View) */}
                    {/* Note: In Month view, we have 1 header row. In Year view, it's nice to have Month names then days? 
              Actually simplest is to just have the standard day header.
              But in Year view, days are tiny. We need a Month Label row.
           */}

                    {/* Top Left Corner */}
                    <div style={{
                        gridColumn: '1 / 2',
                        gridRow: viewMode === 'year' ? '1 / 3' : '1 / 2', // Span 2 rows in year mode
                        backgroundColor: '#f8fafc',
                        borderRight: '1px solid var(--border-light)',
                        borderBottom: '1px solid var(--border-light)',
                        padding: '10px',
                        position: 'sticky',
                        left: 0,
                        zIndex: 30,
                        fontWeight: 600,
                        color: 'var(--text-muted)',
                        display: 'flex', alignItems: 'center'
                    }}>
                        Empleados ({employees.length})
                    </div>

                    {/* Month Headers for Year View */}
                    {viewMode === 'year' && months.map(month => {
                        // Calculate span
                        const daysInThisMonth = endOfMonth(month).getDate();
                        // We need to know the start column index. 
                        // Map days effectively?
                        // CSS Grid area is hard without manual index calc.
                        // Let's just iterate and assume order matches `days` array.
                        return (
                            <div key={month.toString()} style={{
                                gridColumn: `span ${daysInThisMonth}`,
                                textAlign: 'center',
                                backgroundColor: '#f1f5f9',
                                borderBottom: '1px solid var(--border-light)',
                                borderRight: '1px solid var(--border-light)',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                padding: '4px',
                                textTransform: 'uppercase'
                            }}>
                                {format(month, 'MMM', { locale: es })}
                            </div>
                        );
                    })}

                    {/* Day Headers */}
                    {days.map(day => {
                        const dayStr = format(day, 'yyyy-MM-dd');
                        const isHol = isHoliday(dayStr);
                        const holName = isHol ? getHolidayName(dayStr) : '';

                        return (
                            <div key={day.toISOString()}
                                onClick={() => onDayClick && onDayClick(day)}
                                style={{
                                    backgroundColor: isWeekend(day) ? '#f1f5f9' : (isHol ? '#fee2e2' : 'white'),
                                    borderBottom: '1px solid var(--border-light)',
                                    borderRight: '1px solid var(--border-light)',
                                    color: isToday(day) ? 'var(--primary)' : 'var(--text-muted)',
                                    fontWeight: isToday(day) ? 'bold' : 'normal',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: viewMode === 'year' ? '0.6rem' : '0.75rem',
                                    padding: '6px 0',
                                    minHeight: '40px',
                                    gridRow: viewMode === 'year' ? '2 / 3' : '1 / 2',
                                    cursor: 'pointer'
                                }} title={holName}>
                                {viewMode === 'month' && <span style={{ textTransform: 'capitalize' }}>{format(day, 'EE', { locale: es }).slice(0, 2)}</span>}
                                <span style={{ fontSize: viewMode === 'year' ? '0.6rem' : '1rem', marginTop: '2px' }}>{format(day, 'd')}</span>
                            </div>
                        )
                    })}

                    {/* Employee Rows */}
                    {employees.map((emp, index) => {
                        const empVacations = vacations.filter(v => v.employeeId === emp.id);
                        const empColor = getEmployeeColor(emp.originalIndex ?? index); // Use stable index

                        return (
                            <React.Fragment key={emp.id}>
                                {/* Name Cell */}
                                <div style={{
                                    backgroundColor: 'white',
                                    padding: '0 1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    borderRight: '1px solid var(--border-light)',
                                    borderBottom: '1px solid var(--border-light)',
                                    position: 'sticky',
                                    left: 0,
                                    zIndex: 20,
                                    height: '50px'
                                }}>
                                    {/* Use Color Circle instead of random hsl avatar */}
                                    <div style={{
                                        width: '14px', height: '14px', flexShrink: 0,
                                        backgroundColor: empColor,
                                        borderRadius: '50%',
                                        display: 'block'
                                    }} />
                                    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                        <span style={{ fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{emp.name}</span>
                                    </div>
                                </div>

                                {/* Day Cells */}
                                {days.map((day, idx) => {
                                    const dayStr = format(day, 'yyyy-MM-dd');
                                    const isHol = isHoliday(dayStr);
                                    const holName = isHol ? getHolidayName(dayStr) : '';

                                    const vacation = empVacations.find(v => {
                                        const start = parseISO(v.startDate);
                                        const end = parseISO(v.endDate);
                                        return isWithinInterval(day, { start: startOfDay(start), end: startOfDay(end) });
                                    });

                                    const isStart = vacation && isSameDay(day, parseISO(vacation.startDate));
                                    const isEnd = vacation && isSameDay(day, parseISO(vacation.endDate));

                                    // Conflict Check (Only calculate if there is a vacation)
                                    let conflictData = null;
                                    if (vacation) {
                                        conflictData = getVacationConflict(vacation, vacations, employees);
                                    }
                                    const hasConflict = conflictData?.hasConflict;
                                    const conflictingNames = hasConflict ? conflictData.conflictingWith.map(c => c.name).join(', ') : '';

                                    // Filter Events for this day and employee
                                    const dailyEvents = events ? events.filter(ev => {
                                        const start = parseISO(ev.startDate);
                                        const end = parseISO(ev.endDate);
                                        const isRelevant = ev.isGlobal || (ev.assignedEmployeeIds && ev.assignedEmployeeIds.includes(emp.id));
                                        return isRelevant && isWithinInterval(day, { start: startOfDay(start), end: startOfDay(end) });
                                    }) : [];

                                    return (
                                        <div
                                            key={day.toISOString()}
                                            onClick={() => {
                                                if (vacation) {
                                                    if (confirm('¿Eliminar estas vacaciones?')) onDeleteVacation(vacation.id);
                                                } else {
                                                    onCellClick(emp.id, day);
                                                }
                                            }}
                                            style={{
                                                backgroundColor: isWeekend(day) ? '#f8fafc' : (isHol ? '#fee2e2' : 'white'),
                                                borderBottom: '1px solid var(--border-light)',
                                                borderRight: '1px solid var(--border-light)',
                                                position: 'relative',
                                                cursor: 'pointer',
                                                padding: 0
                                            }}
                                            title={vacation
                                                ? `${format(day, 'dd MMM')} - Vacaciones\n${hasConflict ? `⚠️ CONFLICTO con: ${conflictingNames}` : ''}`
                                                : (dailyEvents.length > 0
                                                    ? `Eventos:\n${dailyEvents.map(e => e.name).join('\n')}`
                                                    : (isHol ? `${format(day, 'dd MMM')} - ${holName}` : format(day, 'dd MMM')))
                                            }
                                        >
                                            {/* EVENTS INDICATOR (Background or Marker) */}
                                            {dailyEvents.length > 0 && (
                                                <div style={{
                                                    position: 'absolute',
                                                    inset: '2px',
                                                    backgroundColor: vacation ? 'transparent' : '#fef3c7', // Transparent if vacation exists to avoid muddy color
                                                    border: '1px dashed #d97706', // Amber Border always visible
                                                    borderRadius: '4px',
                                                    opacity: vacation ? 1 : 0.6, // Full opacity for border if overlapping
                                                    display: 'flex', alignItems: 'end', justifyContent: 'center',
                                                    zIndex: 10 // Ensure it's on top of vacation bar
                                                }}>
                                                    <span style={{ fontSize: '10px', color: '#d97706', fontWeight: 'bold' }}>★</span>
                                                </div>
                                            )}

                                            {vacation && (
                                                <div style={{
                                                    position: 'absolute',
                                                    inset: viewMode === 'year' ? '2px 0' : '10px 0',
                                                    left: isStart ? '2px' : '0',
                                                    right: isEnd ? '2px' : '0',
                                                    backgroundColor: empColor, // Use unique color
                                                    borderRadius: `${isStart ? '4px' : '0'} ${isEnd ? '4px' : '0'} ${isEnd ? '4px' : '0'} ${isStart ? '4px' : '0'}`,
                                                    opacity: 0.8,
                                                    border: hasConflict ? '2px solid #ef4444' : 'none',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    zIndex: 2
                                                }}>
                                                    {hasConflict && isStart && <span style={{ fontSize: '10px', lineHeight: 1, zIndex: 10, filter: 'drop-shadow(0px 0px 2px white)' }}>⚠️</span>}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
