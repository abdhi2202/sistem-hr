import { apiEndpoints } from './api/endpoints';
import { apiDownload, apiRequest } from './api/client';
import { buildInitialHrData } from './hrDataStorage';
import {
  normalizeAttendanceList,
  normalizeDepartmentItem,
  normalizeDepartmentList,
  normalizeEmployeeItem,
  normalizeEmployeeList,
  normalizeLeaveItem,
  normalizeLeaveList,
  normalizePositionItem,
  normalizePositionList,
  toDepartmentApiPayload,
  toEmployeeApiPayload,
  toLeaveApiPayload,
  toPositionApiPayload,
} from './api/normalizers';

export const httpHrApi = {
  dashboard: {
    async getSnapshot(role) {
      const fallback = buildInitialHrData();

      if (role === 'karyawan') {
        const [employeeAttendanceRecords, employeeLeaves] = await Promise.all([
          apiRequest(apiEndpoints.attendance.history, { query: { scope: 'me' } }),
          apiRequest(apiEndpoints.leaves.list, { query: { scope: 'me' } }),
        ]);

        return {
          ...fallback,
          employeeAttendanceRecords: normalizeAttendanceList(employeeAttendanceRecords),
          employeeLeaves: normalizeLeaveList(employeeLeaves).map((leave) => ({
            id: leave.id,
            tanggalMulai: leave.tanggalMulai,
            tanggalSelesai: leave.tanggalSelesai,
            alasan: leave.alasan,
            status: leave.status,
          })),
        };
      }

      const [employees, departments, positions, adminAttendanceRecords, adminLeaveRequests] =
        await Promise.all([
          apiRequest(apiEndpoints.employees.list),
          apiRequest(apiEndpoints.departments.list),
          apiRequest(apiEndpoints.positions.list),
          apiRequest(apiEndpoints.attendance.history, { query: { scope: 'admin' } }),
          apiRequest(apiEndpoints.leaves.list, { query: { scope: 'admin' } }),
        ]);

      return {
        ...fallback,
        employees: normalizeEmployeeList(employees),
        departments: normalizeDepartmentList(departments),
        positions: normalizePositionList(positions),
        adminAttendanceRecords: normalizeAttendanceList(adminAttendanceRecords),
        adminLeaveRequests: normalizeLeaveList(adminLeaveRequests),
      };
    },
  },

  employees: {
    async create(payload) {
      return normalizeEmployeeItem(
        await apiRequest(apiEndpoints.employees.list, {
          method: 'POST',
          body: toEmployeeApiPayload(payload),
        }),
      );
    },

    async update(id, payload) {
      return normalizeEmployeeItem(
        await apiRequest(apiEndpoints.employees.detail(id), {
          method: 'PUT',
          body: toEmployeeApiPayload(payload),
        }),
      );
    },

    async remove(id) {
      return apiRequest(apiEndpoints.employees.detail(id), {
        method: 'DELETE',
      });
    },

    async exportCsv() {
      return apiDownload(apiEndpoints.employees.export, {
        filename: 'karyawan.csv',
      });
    },
  },

  master: {
    async saveDepartment(payload) {
      return normalizeDepartmentItem(
        await apiRequest(
          payload.id ? apiEndpoints.departments.detail(payload.id) : apiEndpoints.departments.list,
          {
            method: payload.id ? 'PUT' : 'POST',
            body: toDepartmentApiPayload(payload),
          },
        ),
      );
    },

    async deleteDepartment(id) {
      return apiRequest(apiEndpoints.departments.detail(id), {
        method: 'DELETE',
      });
    },

    async savePosition(payload) {
      return normalizePositionItem(
        await apiRequest(
          payload.id ? apiEndpoints.positions.detail(payload.id) : apiEndpoints.positions.list,
          {
            method: payload.id ? 'PUT' : 'POST',
            body: toPositionApiPayload(payload),
          },
        ),
      );
    },

    async deletePosition(id) {
      return apiRequest(apiEndpoints.positions.detail(id), {
        method: 'DELETE',
      });
    },
  },

  attendance: {
    async exportCsv() {
      return apiDownload(apiEndpoints.attendance.export, {
        filename: 'absensi.csv',
      });
    },

    async clockIn() {
      return apiRequest(apiEndpoints.attendance.clockIn, {
        method: 'POST',
      });
    },

    async clockOut() {
      return apiRequest(apiEndpoints.attendance.clockOut, {
        method: 'POST',
      });
    },
  },

  leaves: {
    async createEmployeeRequest(payload) {
      return normalizeLeaveItem(
        await apiRequest(apiEndpoints.leaves.submit, {
          method: 'POST',
          body: toLeaveApiPayload(payload),
        }),
      );
    },

    async updateAdminRequestStatus(id, status) {
      return normalizeLeaveItem(
        await apiRequest(apiEndpoints.leaves.approve(id), {
          method: 'POST',
          body: { status_pengajuan: status },
        }),
      );
    },
  },

  system: {
    async reset() {
      throw new Error('Reset data hanya tersedia saat menggunakan sumber data mock.');
    },
  },
};
