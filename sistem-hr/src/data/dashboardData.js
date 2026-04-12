import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import Groups2RoundedIcon from '@mui/icons-material/Groups2Rounded';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';

export const roleLabels = {
  admin_hr: 'Admin HR',
  karyawan: 'Karyawan',
};

export const menuByRole = {
  admin_hr: [
    { label: 'Dashboard', path: '/dashboard', icon: DashboardRoundedIcon },
    { label: 'Karyawan', path: '/karyawan', icon: Groups2RoundedIcon },
    { label: 'Master Data', path: '/master', icon: SettingsSuggestRoundedIcon },
    { label: 'Absensi', path: '/absensi', icon: LoginOutlinedIcon },
    { label: 'Cuti', path: '/cuti', icon: EventBusyOutlinedIcon },
  ],
  karyawan: [
    { label: 'Dashboard', path: '/dashboard', icon: DashboardRoundedIcon },
    { label: 'Absensi Saya', path: '/absensi', icon: LoginOutlinedIcon },
    { label: 'Cuti Saya', path: '/cuti', icon: EventBusyOutlinedIcon },
    { label: 'Profil', path: '/profil', icon: PersonRoundedIcon },
  ],
};

export const adminDashboardData = {
  greeting: 'Pantau kondisi operasional HR hari ini secara cepat dan terstruktur.',
  stats: [
    {
      label: 'Total Karyawan',
      value: '128',
      helper: '+6 karyawan baru bulan ini',
      icon: BadgeOutlinedIcon,
      accent: 'primary',
    },
    {
      label: 'Karyawan Aktif',
      value: '121',
      helper: '94,5% dari total karyawan',
      icon: EventAvailableOutlinedIcon,
      accent: 'secondary',
    },
    {
      label: 'Absensi Hari Ini',
      value: '109',
      helper: '12 karyawan belum clock-in',
      icon: AssessmentOutlinedIcon,
      accent: 'info',
    },
    {
      label: 'Cuti Pending',
      value: '7',
      helper: '2 pengajuan mendesak butuh review',
      icon: EventBusyOutlinedIcon,
      accent: 'warning',
    },
  ],
  attendanceSummary: {
    title: 'Ringkasan Absensi Terbaru',
    subtitle: 'Pergerakan absensi dari karyawan yang baru melakukan check-in hari ini.',
    items: [
      { name: 'Rina Paramita', department: 'Finance', time: '07.58', status: 'Tepat waktu' },
      { name: 'Dedi Saputra', department: 'Operasional', time: '08.04', status: 'Sedikit terlambat' },
      { name: 'Salsa Maharani', department: 'People Ops', time: '07.49', status: 'Tepat waktu' },
      { name: 'Arif Wicaksono', department: 'Warehouse', time: '08.11', status: 'Butuh perhatian' },
    ],
  },
  leaveSummary: {
    title: 'Pengajuan Cuti Menunggu Persetujuan',
    subtitle: 'Fokuskan review pada pengajuan dengan tanggal mulai terdekat.',
    items: [
      { name: 'Nadia Putri', period: '15 Apr - 17 Apr 2026', reason: 'Keperluan keluarga', urgency: 'Tinggi' },
      { name: 'Rizky Hartono', period: '18 Apr - 18 Apr 2026', reason: 'Pemeriksaan kesehatan', urgency: 'Sedang' },
      { name: 'Aulia Rahma', period: '22 Apr - 24 Apr 2026', reason: 'Cuti tahunan', urgency: 'Normal' },
    ],
  },
  quickActions: [
    {
      title: 'Lihat rekap absensi',
      description: 'Periksa siapa saja yang belum clock-in dan tindak lanjuti anomali absensi.',
      cta: 'Buka modul absensi',
      to: '/absensi',
    },
    {
      title: 'Tinjau pengajuan cuti',
      description: 'Selesaikan permintaan yang menumpuk sebelum jadwal minggu depan disusun.',
      cta: 'Buka modul cuti',
      to: '/cuti',
    },
  ],
};

export const employeeDashboardData = {
  greeting: 'Selamat bekerja. Lihat status kehadiran dan pengajuan cuti Anda hari ini.',
  stats: [
    {
      label: 'Status Absensi',
      value: 'Sudah Check-in',
      helper: 'Masuk pukul 07.56 WITA',
      icon: LoginOutlinedIcon,
      accent: 'secondary',
    },
    {
      label: 'Jam Pulang',
      value: '17.00',
      helper: 'Sisa 7 jam 12 menit kerja hari ini',
      icon: TimerOutlinedIcon,
      accent: 'primary',
    },
    {
      label: 'Pengajuan Cuti',
      value: '1 Pending',
      helper: 'Menunggu persetujuan Admin HR',
      icon: EventBusyOutlinedIcon,
      accent: 'warning',
    },
    {
      label: 'Riwayat Bulan Ini',
      value: '19 Hari Hadir',
      helper: '1 izin, 0 alpha',
      icon: LogoutOutlinedIcon,
      accent: 'info',
    },
  ],
  attendanceSummary: {
    title: 'Ringkasan Absensi Saya',
    subtitle: 'Informasi kehadiran terbaru yang paling relevan untuk Anda hari ini.',
    items: [
      { label: 'Check-in Hari Ini', value: '07.56 WITA', note: 'Tercatat otomatis di sistem' },
      { label: 'Check-out Terakhir', value: '17.08 WITA', note: 'Kemarin, Jumat 10 Apr 2026' },
      { label: 'Status Kehadiran', value: 'Hadir', note: 'Tidak ada kendala absensi' },
    ],
  },
  leaveSummary: {
    title: 'Status Cuti Saya',
    subtitle: 'Pantau status pengajuan terbaru tanpa perlu membuka halaman lain.',
    items: [
      { period: '20 Apr - 21 Apr 2026', status: 'Pending', reason: 'Acara keluarga' },
      { period: '03 Mar - 03 Mar 2026', status: 'Disetujui', reason: 'Kebutuhan pribadi' },
      { period: '17 Jan - 17 Jan 2026', status: 'Disetujui', reason: 'Pemeriksaan medis' },
    ],
  },
  quickActions: [
    {
      title: 'Clock-out nanti sore',
      description: 'Pastikan check-out dilakukan sebelum meninggalkan lokasi kerja.',
      cta: 'Buka absensi',
      to: '/absensi',
    },
    {
      title: 'Ajukan cuti baru',
      description: 'Isi rentang tanggal dan alasan cuti untuk kebutuhan mendatang.',
      cta: 'Buka form cuti',
      to: '/cuti',
    },
  ],
};
