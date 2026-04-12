import { buildInitialHrData, clearHrData, loadHrData, saveHrData } from './hrDataStorage';
import { getTodayDateString } from '../utils/date';

function nextId(items) {
  return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

function readDb() {
  return loadHrData();
}

function writeDb(data) {
  saveHrData(data);
  return data;
}

async function resolve(value) {
  return Promise.resolve(value);
}

export const hrApi = {
  dashboard: {
    async getSnapshot() {
      return resolve(readDb());
    },
  },

  employees: {
    async list() {
      return resolve(readDb().employees);
    },

    async create(payload) {
      const db = readDb();
      const employee = {
        id: nextId(db.employees),
        ...payload,
      };

      writeDb({
        ...db,
        employees: [employee, ...db.employees],
      });

      return resolve(employee);
    },

    async update(id, payload) {
      const db = readDb();
      const employees = db.employees.map((employee) =>
        employee.id === id ? { ...employee, ...payload } : employee,
      );

      writeDb({
        ...db,
        employees,
      });

      return resolve(employees.find((employee) => employee.id === id) ?? null);
    },

    async remove(id) {
      const db = readDb();
      writeDb({
        ...db,
        employees: db.employees.filter((employee) => employee.id !== id),
      });

      return resolve({ success: true });
    },

    async exportCsv() {
      return resolve({ ok: true });
    },
  },

  master: {
    async listDepartments() {
      return resolve(readDb().departments);
    },

    async saveDepartment(payload) {
      const db = readDb();
      const departments = payload.id
        ? db.departments.map((department) =>
            department.id === payload.id ? { ...department, nama: payload.nama } : department,
          )
        : [{ id: nextId(db.departments), nama: payload.nama, penggunaan: 0 }, ...db.departments];

      writeDb({
        ...db,
        departments,
      });

      return resolve(departments);
    },

    async deleteDepartment(id) {
      const db = readDb();
      writeDb({
        ...db,
        departments: db.departments.filter((department) => department.id !== id),
      });

      return resolve({ success: true });
    },

    async listPositions() {
      return resolve(readDb().positions);
    },

    async savePosition(payload) {
      const db = readDb();
      const positions = payload.id
        ? db.positions.map((position) =>
            position.id === payload.id ? { ...position, nama: payload.nama } : position,
          )
        : [{ id: nextId(db.positions), nama: payload.nama, penggunaan: 0 }, ...db.positions];

      writeDb({
        ...db,
        positions,
      });

      return resolve(positions);
    },

    async deletePosition(id) {
      const db = readDb();
      writeDb({
        ...db,
        positions: db.positions.filter((position) => position.id !== id),
      });

      return resolve({ success: true });
    },
  },

  attendance: {
    async listAdminRecords() {
      return resolve(readDb().adminAttendanceRecords);
    },

    async listEmployeeRecords() {
      return resolve(readDb().employeeAttendanceRecords);
    },

    async clockIn() {
      const today = getTodayDateString();
      const db = readDb();
      const todayRecord = db.employeeAttendanceRecords.find((record) => record.tanggal === today);

      if (todayRecord?.waktuMasuk) {
        return resolve({
          ok: false,
          message: 'Clock-in hari ini sudah tercatat.',
        });
      }

      const nextRecord = todayRecord
        ? {
            ...todayRecord,
            waktuMasuk: '07:59',
            status: 'Hadir',
          }
        : {
            id: Date.now(),
            tanggal: today,
            waktuMasuk: '07:59',
            waktuKeluar: '',
            status: 'Hadir',
          };

      const employeeAttendanceRecords = todayRecord
        ? db.employeeAttendanceRecords.map((record) =>
            record.tanggal === today ? nextRecord : record,
          )
        : [nextRecord, ...db.employeeAttendanceRecords];

      writeDb({
        ...db,
        employeeAttendanceRecords,
      });

      return resolve({
        ok: true,
        message: 'Clock-in berhasil dicatat pada pukul 07:59 WITA.',
      });
    },

    async clockOut() {
      const today = getTodayDateString();
      const db = readDb();
      const todayRecord = db.employeeAttendanceRecords.find((record) => record.tanggal === today);

      if (!todayRecord?.waktuMasuk) {
        return resolve({
          ok: false,
          message: 'Lakukan clock-in terlebih dahulu sebelum clock-out.',
        });
      }

      if (todayRecord.waktuKeluar) {
        return resolve({
          ok: false,
          message: 'Clock-out hari ini sudah tercatat.',
        });
      }

      writeDb({
        ...db,
        employeeAttendanceRecords: db.employeeAttendanceRecords.map((record) =>
          record.tanggal === today
            ? {
                ...record,
                waktuKeluar: '17:04',
                status: 'Sudah Pulang',
              }
            : record,
        ),
      });

      return resolve({
        ok: true,
        message: 'Clock-out berhasil dicatat pada pukul 17:04 WITA.',
      });
    },

    async exportCsv() {
      return resolve({ ok: true });
    },
  },

  leaves: {
    async listAdminRequests() {
      return resolve(readDb().adminLeaveRequests);
    },

    async listEmployeeRequests() {
      return resolve(readDb().employeeLeaves);
    },

    async createEmployeeRequest(payload) {
      const db = readDb();
      const request = {
        id: Date.now(),
        ...payload,
        status: 'Pending',
      };

      writeDb({
        ...db,
        employeeLeaves: [request, ...db.employeeLeaves],
      });

      return resolve(request);
    },

    async updateAdminRequestStatus(id, status) {
      const db = readDb();
      const adminLeaveRequests = db.adminLeaveRequests.map((leave) =>
        leave.id === id ? { ...leave, status } : leave,
      );

      writeDb({
        ...db,
        adminLeaveRequests,
      });

      return resolve(adminLeaveRequests.find((leave) => leave.id === id) ?? null);
    },
  },

  system: {
    async reset() {
      clearHrData();
      return resolve(buildInitialHrData());
    },
  },
};
