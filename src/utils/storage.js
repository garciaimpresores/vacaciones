const KEYS = {
  EMPLOYEES: 'app_employees',
  VACATIONS: 'app_vacations',
};

export const getEmployees = () => {
  try {
    const data = localStorage.getItem(KEYS.EMPLOYEES);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error loading employees', e);
    return [];
  }
};

export const saveEmployees = (employees) => {
  localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(employees));
};

export const getVacations = () => {
  try {
    const data = localStorage.getItem(KEYS.VACATIONS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error loading vacations', e);
    return [];
  }
};

export const saveVacations = (vacations) => {
  localStorage.setItem(KEYS.VACATIONS, JSON.stringify(vacations));
};
