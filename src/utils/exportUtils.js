import * as XLSX from 'xlsx';
import { parseISO, differenceInCalendarDays, startOfYear, endOfYear, max, min } from 'date-fns';

export const exportToExcel = (employees, vacations) => {
    const currentYear = new Date().getFullYear();
    const currentYearStart = startOfYear(new Date());
    const currentYearEnd = endOfYear(new Date());
    const TOTAL_VACATION_DAYS = 30;

    // Prepare data
    const data = employees.map(emp => {
        // Calculate consumed days for current year
        const empVacations = vacations.filter(v => v.employeeId === emp.id);

        const totalDaysUsed = empVacations.reduce((acc, vac) => {
            const start = parseISO(vac.startDate);
            const end = parseISO(vac.endDate);

            // Calculate overlap with current year
            const overlapStart = max([start, currentYearStart]);
            const overlapEnd = min([end, currentYearEnd]);

            if (overlapStart <= overlapEnd) {
                const days = differenceInCalendarDays(overlapEnd, overlapStart) + 1;
                return acc + days;
            }
            return acc;
        }, 0);

        const daysRemaining = TOTAL_VACATION_DAYS - totalDaysUsed;

        return {
            "Nombre": emp.name,
            "Cargo": emp.role || 'N/A',
            "Año": currentYear,
            "Días Totales": TOTAL_VACATION_DAYS,
            "Días Consumidos": totalDaysUsed,
            "Días Restantes": daysRemaining
        };
    });

    // Create workbook
    const ws = XLSX.utils.json_to_sheet(data);

    // Auto-width columns
    const wscols = [
        { wch: 30 }, // Nombre
        { wch: 20 }, // Cargo
        { wch: 10 }, // Año
        { wch: 15 }, // Totales
        { wch: 15 }, // Consumidos
        { wch: 15 }  // Restantes
    ];
    ws['!cols'] = wscols;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Vacaciones ${currentYear}`);

    // Export
    XLSX.writeFile(wb, `Resumen_Vacaciones_${currentYear}.xlsx`);
};
