import { areIntervalsOverlapping } from 'date-fns';

export function getVacationConflict(targetVacation, allVacations, allEmployees) {
    const employee = allEmployees.find(e => e.id === targetVacation.employeeId);
    if (!employee || !employee.incompatibleIds || employee.incompatibleIds.length === 0) {
        return { hasConflict: false, conflictingWith: [] };
    }

    const conflictingWith = [];

    // Find vacations of incompatible employees
    const relevantVacations = allVacations.filter(v =>
        employee.incompatibleIds.includes(v.employeeId) && v.id !== targetVacation.id
    );

    relevantVacations.forEach(v => {
        // Check overlap: startA <= endB && endA >= startB
        // Assuming strings "YYYY-MM-DD", but let's use string comparison which works for ISO dates
        // or date-fns if specific. Our storage format is YYYY-MM-DD strings.
        // String comparison is enough for YYYY-MM-DD.
        const overlap = (targetVacation.startDate <= v.endDate && targetVacation.endDate >= v.startDate);

        if (overlap) {
            const peer = allEmployees.find(e => e.id === v.employeeId);
            if (peer && !conflictingWith.find(c => c.id === peer.id)) {
                conflictingWith.push(peer);
            }
        }
    });

    return {
        hasConflict: conflictingWith.length > 0,
        conflictingWith
    };
}
