import { eachDayOfInterval, isSaturday, isSunday, format } from 'date-fns';
import { isHoliday } from './holidays';

/**
 * Calculates the number of working days in a date range.
 * A working day is defined as a day that is NOT a Saturday, NOT a Sunday,
 * and NOT a registered national/corporate holiday.
 * 
 * @param {Date} start 
 * @param {Date} end 
 * @returns {number} Number of working days
 */
export const countWorkingDays = (start, end) => {
    if (!start || !end || start > end) return 0;

    const days = eachDayOfInterval({ start, end });

    return days.reduce((count, day) => {
        const isWeekend = isSaturday(day) || isSunday(day);
        const dateStr = format(day, 'yyyy-MM-dd');
        const holiday = isHoliday(dateStr);

        if (!isWeekend && !holiday) {
            return count + 1;
        }
        return count;
    }, 0);
};

export const TOTAL_VACATION_DAYS_PER_YEAR = 22;
