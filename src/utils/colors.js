export const COLORS = [
    '#3b82f6', // Blue 500
    '#ef4444', // Red 500
    '#10b981', // Emerald 500
    '#f59e0b', // Amber 500
    '#8b5cf6', // Violet 500
    '#ec4899', // Pink 500
    '#06b6d4', // Cyan 500
    '#84cc16', // Lime 500
    '#f97316', // Orange 500
    '#6366f1', // Indigo 500
    '#14b8a6', // Teal 500
    '#d946ef', // Fuchsia 500
];

export const getEmployeeColor = (index) => {
    return COLORS[index % COLORS.length];
};
