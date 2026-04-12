import { employeeAttendanceHistory, initialAttendanceRecords } from '../data/attendanceData';
import { initialEmployees } from '../data/employeeData';
import { initialAdminLeaveRequests, initialEmployeeLeaves } from '../data/leaveData';
import { initialDepartments, initialPositions } from '../data/masterData';

const storageKey = 'sistem-hr-data';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function buildInitialHrData() {
  return {
    employees: clone(initialEmployees),
    departments: clone(initialDepartments),
    positions: clone(initialPositions),
    adminAttendanceRecords: clone(initialAttendanceRecords),
    employeeAttendanceRecords: clone(employeeAttendanceHistory),
    adminLeaveRequests: clone(initialAdminLeaveRequests),
    employeeLeaves: clone(initialEmployeeLeaves),
  };
}

export function buildEmptyHrData() {
  return {
    employees: [],
    departments: [],
    positions: [],
    adminAttendanceRecords: [],
    employeeAttendanceRecords: [],
    adminLeaveRequests: [],
    employeeLeaves: [],
  };
}

export function loadHrData() {
  if (typeof window === 'undefined') {
    return buildInitialHrData();
  }

  const fallback = buildInitialHrData();
  const saved = window.localStorage.getItem(storageKey);

  if (!saved) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(saved);
    return {
      ...fallback,
      ...parsed,
    };
  } catch {
    return fallback;
  }
}

export function saveHrData(data) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(data));
}

export function clearHrData() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(storageKey);
}
