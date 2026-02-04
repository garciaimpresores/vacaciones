export const HOLIDAYS_2026 = [
    { date: '2026-01-01', name: 'Año Nuevo' },
    { date: '2026-01-06', name: 'Epifanía del Señor' },
    { date: '2026-02-28', name: 'Día de Andalucía' },
    { date: '2026-04-02', name: 'Jueves Santo' },
    { date: '2026-04-03', name: 'Viernes Santo' },
    { date: '2026-05-01', name: 'Fiesta del Trabajo' },
    { date: '2026-08-15', name: 'Asunción de la Virgen' },
    { date: '2026-10-12', name: 'Fiesta Nacional de España' },
    { date: '2026-11-02', name: 'Todos los Santos (trasladado)' }, // Domingo 1 nov
    { date: '2026-12-07', name: 'Día de la Constitución (trasladado)' }, // Domingo 6 dic
    { date: '2026-12-08', name: 'Inmaculada Concepción' },
    { date: '2026-12-25', name: 'Natividad del Señor' },
];

export const HOLIDAYS_2027 = [
    { date: '2027-01-01', name: 'Año Nuevo' },
    { date: '2027-01-06', name: 'Epifanía del Señor' },
    { date: '2027-03-01', name: 'Día de Andalucía (trasladado)' }, // Domingo 28 feb
    { date: '2027-03-25', name: 'Jueves Santo' },
    { date: '2027-03-26', name: 'Viernes Santo' },
    { date: '2027-05-01', name: 'Fiesta del Trabajo' },
    { date: '2027-08-16', name: 'Asunción de la Virgen (trasladado)' }, // Domingo 15 ago
    { date: '2027-10-12', name: 'Fiesta Nacional de España' },
    { date: '2027-11-01', name: 'Todos los Santos' },
    { date: '2027-12-06', name: 'Día de la Constitución' },
    { date: '2027-12-08', name: 'Inmaculada Concepción' },
    { date: '2027-12-25', name: 'Natividad del Señor' },
];

export const HOLIDAYS_2028 = [
    { date: '2028-01-01', name: 'Año Nuevo' },
    { date: '2028-01-06', name: 'Epifanía del Señor' },
    { date: '2028-02-28', name: 'Día de Andalucía' },
    { date: '2028-04-13', name: 'Jueves Santo' },
    { date: '2028-04-14', name: 'Viernes Santo' },
    { date: '2028-05-01', name: 'Fiesta del Trabajo' },
    { date: '2028-08-15', name: 'Asunción de la Virgen' },
    { date: '2028-10-12', name: 'Fiesta Nacional de España' },
    { date: '2028-11-01', name: 'Todos los Santos' },
    { date: '2028-12-06', name: 'Día de la Constitución' },
    { date: '2028-12-08', name: 'Inmaculada Concepción' },
    { date: '2028-12-25', name: 'Natividad del Señor' },
];

export const HOLIDAYS_2029 = [
    { date: '2029-01-01', name: 'Año Nuevo' },
    { date: '2029-01-06', name: 'Epifanía del Señor' },
    { date: '2029-02-28', name: 'Día de Andalucía' },
    { date: '2029-03-29', name: 'Jueves Santo' },
    { date: '2029-03-30', name: 'Viernes Santo' },
    { date: '2029-05-01', name: 'Fiesta del Trabajo' },
    { date: '2029-08-15', name: 'Asunción de la Virgen' },
    { date: '2029-10-12', name: 'Fiesta Nacional de España' },
    { date: '2029-11-01', name: 'Todos los Santos' },
    { date: '2029-12-06', name: 'Día de la Constitución' },
    { date: '2029-12-08', name: 'Inmaculada Concepción' },
    { date: '2029-12-25', name: 'Natividad del Señor' },
];

export const HOLIDAYS_2030 = [
    { date: '2030-01-01', name: 'Año Nuevo' },
    { date: '2030-01-07', name: 'Epifanía del Señor (trasladado)' }, // Domingo 6
    { date: '2030-02-28', name: 'Día de Andalucía' },
    { date: '2030-04-18', name: 'Jueves Santo' },
    { date: '2030-04-19', name: 'Viernes Santo' },
    { date: '2030-05-01', name: 'Fiesta del Trabajo' },
    { date: '2030-08-15', name: 'Asunción de la Virgen' },
    { date: '2030-10-12', name: 'Fiesta Nacional de España' },
    { date: '2030-11-01', name: 'Todos los Santos' },
    { date: '2030-12-06', name: 'Día de la Constitución' },
    { date: '2030-12-09', name: 'Inmaculada Concepción (trasladado)' }, // Domingo 8
    { date: '2030-12-25', name: 'Natividad del Señor' },
];

export const ALL_HOLIDAYS = [
    ...HOLIDAYS_2026,
    ...HOLIDAYS_2027,
    ...HOLIDAYS_2028,
    ...HOLIDAYS_2029,
    ...HOLIDAYS_2030
];

export const isHoliday = (dateStr) => {
    return ALL_HOLIDAYS.some(h => h.date === dateStr);
};

export const getHolidayName = (dateStr) => {
    const holiday = ALL_HOLIDAYS.find(h => h.date === dateStr);
    return holiday ? holiday.name : null;
};
