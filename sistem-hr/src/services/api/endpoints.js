export const apiEndpoints = {
  auth: {
    login: '/api/login',
    logout: '/api/logout',
    changePassword: '/api/password',
  },
  dashboard: {
    summary: '/api/dashboard',
  },
  employees: {
    list: '/api/karyawan',
    detail: (id) => `/api/karyawan/${id}`,
    search: '/api/karyawan/search',
    export: '/api/export/karyawan',
  },
  departments: {
    list: '/api/departemen',
    detail: (id) => `/api/departemen/${id}`,
  },
  positions: {
    list: '/api/jabatan',
    detail: (id) => `/api/jabatan/${id}`,
  },
  attendance: {
    clockIn: '/api/absensi/clock-in',
    clockOut: '/api/absensi/clock-out',
    history: '/api/absensi/riwayat',
    export: '/api/export/absensi',
  },
  leaves: {
    list: '/api/cuti',
    submit: '/api/cuti/ajukan',
    approve: (id) => `/api/cuti/approve/${id}`,
  },
};
