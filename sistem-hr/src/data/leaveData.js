export const initialAdminLeaveRequests = [
  {
    id: 1,
    nama: 'Nadia Putri',
    departemen: 'People Ops',
    tanggalMulai: '2026-04-20',
    tanggalSelesai: '2026-04-21',
    alasan: 'Acara keluarga',
    status: 'Pending',
  },
  {
    id: 2,
    nama: 'Dedi Saputra',
    departemen: 'Operasional',
    tanggalMulai: '2026-04-18',
    tanggalSelesai: '2026-04-18',
    alasan: 'Pemeriksaan kesehatan',
    status: 'Pending',
  },
  {
    id: 3,
    nama: 'Rina Paramita',
    departemen: 'Finance',
    tanggalMulai: '2026-04-10',
    tanggalSelesai: '2026-04-11',
    alasan: 'Keperluan keluarga',
    status: 'Disetujui',
  },
  {
    id: 4,
    nama: 'Arif Wicaksono',
    departemen: 'Warehouse',
    tanggalMulai: '2026-04-06',
    tanggalSelesai: '2026-04-06',
    alasan: 'Keperluan pribadi',
    status: 'Ditolak',
  },
];

export const initialEmployeeLeaves = [
  {
    id: 101,
    tanggalMulai: '2026-04-20',
    tanggalSelesai: '2026-04-21',
    alasan: 'Acara keluarga',
    status: 'Pending',
  },
  {
    id: 102,
    tanggalMulai: '2026-03-03',
    tanggalSelesai: '2026-03-03',
    alasan: 'Kebutuhan pribadi',
    status: 'Disetujui',
  },
  {
    id: 103,
    tanggalMulai: '2026-01-17',
    tanggalSelesai: '2026-01-17',
    alasan: 'Pemeriksaan medis',
    status: 'Disetujui',
  },
];

export const emptyLeaveForm = {
  tanggalMulai: '',
  tanggalSelesai: '',
  alasan: '',
};
