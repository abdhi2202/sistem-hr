import { adminDashboardData, employeeDashboardData, roleLabels } from '../data/dashboardData';
import { getTodayDateString } from './date';

function formatLongDate(dateString) {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString));
}

function buildAdminAttendanceItems(records) {
  const today = getTodayDateString();

  return records
    .filter((record) => record.tanggal === today)
    .slice(0, 4)
    .map((record) => ({
      name: record.nama,
      department: record.departemen,
      time: record.waktuMasuk || '-',
      status:
        record.status === 'Hadir'
          ? 'Tepat waktu'
          : record.status === 'Terlambat'
            ? 'Sedikit terlambat'
            : 'Butuh perhatian',
    }));
}

function buildAdminLeaveItems(leaves) {
  return leaves
    .filter((leave) => leave.status === 'Pending')
    .slice(0, 3)
    .map((leave, index) => ({
      name: leave.nama,
      period: `${leave.tanggalMulai} - ${leave.tanggalSelesai}`,
      reason: leave.alasan,
      urgency: index === 0 ? 'Tinggi' : index === 1 ? 'Sedang' : 'Normal',
    }));
}

function buildEmployeeAttendanceItems(records) {
  const today = getTodayDateString();
  const todayRecord = records.find((record) => record.tanggal === today);
  const lastCheckout = records.find((record) => record.tanggal !== today && record.waktuKeluar);

  return [
    {
      label: 'Check-in Hari Ini',
      value: todayRecord?.waktuMasuk ? `${todayRecord.waktuMasuk} WITA` : '-',
      note: 'Tercatat otomatis di sistem',
    },
    {
      label: 'Check-out Terakhir',
      value: lastCheckout?.waktuKeluar ? `${lastCheckout.waktuKeluar} WITA` : '-',
      note: lastCheckout ? formatLongDate(lastCheckout.tanggal) : 'Belum ada data check-out sebelumnya',
    },
    {
      label: 'Status Kehadiran',
      value: todayRecord?.status ?? 'Belum Masuk',
      note: todayRecord?.status === 'Terlambat' ? 'Perlu disiplin waktu masuk' : 'Tidak ada kendala absensi',
    },
  ];
}

function buildEmployeeLeaveItems(leaves) {
  return leaves.slice(0, 3).map((leave) => ({
    period: `${leave.tanggalMulai} - ${leave.tanggalSelesai}`,
    status: leave.status,
    reason: leave.alasan,
  }));
}

export function getDashboardContentByRole(role, data) {
  const today = getTodayDateString();

  if (role === 'karyawan') {
    const todayRecord = data.employeeAttendanceRecords.find((record) => record.tanggal === today);
    const pendingLeaves = data.employeeLeaves.filter((leave) => leave.status === 'Pending').length;
    const hadirCount = data.employeeAttendanceRecords.filter((record) => record.status === 'Hadir').length;
    const terlambatCount = data.employeeAttendanceRecords.filter((record) => record.status === 'Terlambat').length;

    return {
      ...employeeDashboardData,
      stats: [
        {
          ...employeeDashboardData.stats[0],
          value: todayRecord?.waktuMasuk ? 'Sudah Check-in' : 'Belum Check-in',
          helper: todayRecord?.waktuMasuk ? `Masuk pukul ${todayRecord.waktuMasuk} WITA` : 'Segera lakukan absensi masuk',
        },
        {
          ...employeeDashboardData.stats[1],
          value: todayRecord?.waktuKeluar || '17.00',
          helper: todayRecord?.waktuKeluar ? 'Clock-out sudah tercatat' : 'Jam pulang standar hari ini',
        },
        {
          ...employeeDashboardData.stats[2],
          value: `${pendingLeaves} Pending`,
          helper: pendingLeaves > 0 ? 'Menunggu persetujuan Admin HR' : 'Tidak ada pengajuan menunggu',
        },
        {
          ...employeeDashboardData.stats[3],
          value: `${hadirCount} Hari Hadir`,
          helper: `${terlambatCount} keterlambatan tercatat`,
        },
      ],
      attendanceSummary: {
        ...employeeDashboardData.attendanceSummary,
        items: buildEmployeeAttendanceItems(data.employeeAttendanceRecords),
      },
      leaveSummary: {
        ...employeeDashboardData.leaveSummary,
        items: buildEmployeeLeaveItems(data.employeeLeaves),
      },
    };
  }

  const totalEmployees = data.employees.length;
  const activeEmployees = data.employees.filter((employee) => employee.statusAktif).length;
  const todayAttendance = data.adminAttendanceRecords.filter((record) => record.tanggal === today);
  const pendingLeaves = data.adminLeaveRequests.filter((leave) => leave.status === 'Pending');

  return {
    ...adminDashboardData,
    stats: [
      {
        ...adminDashboardData.stats[0],
        value: String(totalEmployees),
        helper: `${activeEmployees} karyawan aktif saat ini`,
      },
      {
        ...adminDashboardData.stats[1],
        value: String(activeEmployees),
        helper: `${totalEmployees - activeEmployees} karyawan nonaktif`,
      },
      {
        ...adminDashboardData.stats[2],
        value: String(todayAttendance.filter((record) => record.waktuMasuk).length),
        helper: `${todayAttendance.filter((record) => record.status === 'Belum Masuk').length} karyawan belum clock-in`,
      },
      {
        ...adminDashboardData.stats[3],
        value: String(pendingLeaves.length),
        helper: pendingLeaves.length > 0 ? 'Ada pengajuan yang perlu ditinjau' : 'Tidak ada antrean cuti',
      },
    ],
    attendanceSummary: {
      ...adminDashboardData.attendanceSummary,
      items: buildAdminAttendanceItems(data.adminAttendanceRecords),
    },
    leaveSummary: {
      ...adminDashboardData.leaveSummary,
      items: buildAdminLeaveItems(data.adminLeaveRequests),
    },
  };
}

export function getRoleLabel(role) {
  return roleLabels[role] ?? 'Pengguna';
}
