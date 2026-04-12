import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Grid2 as Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import PageDataShell from '../components/state/PageDataShell';
import { useHrData } from '../context/HrDataContext';
import { useRole } from '../context/RoleContext';
import { getApiErrorMessage } from '../utils/apiFeedback';
import { getTodayDateString } from '../utils/date';
const employeeName = 'Karyawan Demo';

function formatDate(dateString) {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString));
}

function getStatusStyle(status) {
  if (status === 'Hadir') {
    return { bgcolor: 'rgba(31, 157, 116, 0.12)', color: 'secondary.main' };
  }

  if (status === 'Terlambat') {
    return { bgcolor: 'rgba(237, 138, 24, 0.14)', color: '#c26a00' };
  }

  if (status === 'Sudah Pulang') {
    return { bgcolor: 'rgba(31, 94, 255, 0.12)', color: 'primary.main' };
  }

  return { bgcolor: '#eef3fb', color: 'text.secondary' };
}

function buildEmployeeTodayRecord(records, today) {
  const todayRecord = records.find((record) => record.tanggal === today);

  if (todayRecord) {
    return {
      ...todayRecord,
      status:
        todayRecord.waktuKeluar && todayRecord.status === 'Hadir'
          ? 'Sudah Pulang'
          : todayRecord.status,
    };
  }

  return {
    id: 999,
    tanggal: today,
    waktuMasuk: '',
    waktuKeluar: '',
    status: 'Belum Masuk',
  };
}

function downloadAttendanceCsv(rows) {
  const header = ['Tanggal', 'Nama', 'Departemen', 'Waktu Masuk', 'Waktu Keluar', 'Status'];
  const csvRows = rows.map((record) =>
    [
      record.tanggal,
      record.nama,
      record.departemen,
      record.waktuMasuk || '',
      record.waktuKeluar || '',
      record.status,
    ]
      .map((value) => `"${String(value).replaceAll('"', '""')}"`)
      .join(','),
  );

  const csvContent = [header.join(','), ...csvRows].join('\n');
  const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'rekap-absensi.csv';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function AttendancePage() {
  const today = getTodayDateString();
  const { role, name } = useRole();
  const {
    adminAttendanceRecords,
    employeeAttendanceRecords,
    clockIn,
    clockOut,
    exportAttendanceCsv,
    dataSourceMode,
  } = useHrData();
  const [adminKeyword, setAdminKeyword] = useState('');
  const [adminStatusFilter, setAdminStatusFilter] = useState('Semua Status');
  const [message, setMessage] = useState({ type: 'success', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const employeeDisplayName = name || employeeName;

  const adminTodayRecords = useMemo(
    () => adminAttendanceRecords.filter((record) => record.tanggal === today),
    [adminAttendanceRecords, today],
  );

  const adminSummary = useMemo(() => {
    const hadir = adminTodayRecords.filter((record) => record.status === 'Hadir').length;
    const terlambat = adminTodayRecords.filter((record) => record.status === 'Terlambat').length;
    const belumMasuk = adminTodayRecords.filter((record) => record.status === 'Belum Masuk').length;

    return {
      hadir,
      terlambat,
      belumMasuk,
      total: adminTodayRecords.length,
    };
  }, [adminTodayRecords]);

  const filteredAdminRecords = useMemo(() => {
    return adminTodayRecords.filter((record) => {
      const matchesKeyword = record.nama
        .toLowerCase()
        .includes(adminKeyword.trim().toLowerCase());
      const matchesStatus =
        adminStatusFilter === 'Semua Status' || record.status === adminStatusFilter;

      return matchesKeyword && matchesStatus;
    });
  }, [adminKeyword, adminStatusFilter, adminTodayRecords]);

  const employeeTodayRecord = useMemo(
    () => buildEmployeeTodayRecord(employeeAttendanceRecords, today),
    [employeeAttendanceRecords, today],
  );

  const employeeSummary = useMemo(() => {
    const hadirCount = employeeAttendanceRecords.filter((record) => record.status === 'Hadir').length;
    const terlambatCount = employeeAttendanceRecords.filter((record) => record.status === 'Terlambat').length;

    return {
      hadirCount,
      terlambatCount,
    };
  }, [employeeAttendanceRecords]);
  const hasClockedIn = Boolean(employeeTodayRecord.waktuMasuk);
  const hasClockedOut = Boolean(employeeTodayRecord.waktuKeluar);
  const isClockInDisabled = isSubmitting || hasClockedIn;
  const isClockOutDisabled = isSubmitting || !hasClockedIn || hasClockedOut;

  async function handleClockIn() {
    setIsSubmitting(true);

    try {
      const result = await clockIn();
      setMessage({ type: 'success', text: result.message });
    } catch (error) {
      setMessage({
        type: 'error',
        text: getApiErrorMessage(error, 'Clock-in gagal diproses.'),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleClockOut() {
    setIsSubmitting(true);

    try {
      const result = await clockOut();
      setMessage({ type: 'success', text: result.message });
    } catch (error) {
      setMessage({
        type: 'error',
        text: getApiErrorMessage(error, 'Clock-out gagal diproses.'),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleExportAttendance() {
    try {
      if (dataSourceMode === 'http') {
        await exportAttendanceCsv();
      } else {
        downloadAttendanceCsv(filteredAdminRecords);
      }

      setMessage({ type: 'success', text: 'File CSV absensi berhasil diproses.' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: getApiErrorMessage(error, 'Export CSV absensi gagal diproses.'),
      });
    }
  }

  return (
    <PageDataShell title="absensi">
      <Stack spacing={3}>
      <Box
        sx={{
          px: { xs: 2.5, md: 3.5 },
          py: { xs: 3, md: 3.5 },
          borderRadius: '20px',
          background:
            'linear-gradient(135deg, rgba(18, 32, 51, 1), rgba(25, 91, 193, 0.92) 52%, rgba(31, 157, 116, 0.74))',
          color: '#ffffff',
        }}
      >
        <Stack
          direction={{ xs: 'column', lg: 'row' }}
          justifyContent="space-between"
          spacing={2}
          alignItems={{ xs: 'flex-start', lg: 'center' }}
        >
          <Box>
            <Typography variant="overline" sx={{ opacity: 0.8, letterSpacing: '0.14em' }}>
              {role === 'admin_hr' ? 'Admin HR' : 'Karyawan'}
            </Typography>
            <Typography variant="h4" sx={{ mt: 0.5, mb: 1 }}>
              Absensi
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: 720, opacity: 0.9 }}>
              {role === 'admin_hr'
                ? 'Pantau kehadiran harian seluruh karyawan, identifikasi keterlambatan, dan tindak lanjuti anomali absensi.'
                : 'Lakukan clock-in dan clock-out dengan cepat, lalu pantau riwayat kehadiran Anda dalam satu tampilan.'}
            </Typography>
          </Box>
          <Chip
            icon={<CalendarMonthRoundedIcon />}
            label={formatDate(today)}
            sx={{
              bgcolor: 'rgba(255,255,255,0.12)',
              color: '#ffffff',
              '& .MuiChip-icon': {
                color: '#ffffff',
              },
            }}
          />
        </Stack>
      </Box>

      {message.text ? <Alert severity={message.type}>{message.text}</Alert> : null}

      {role === 'admin_hr' ? (
        <>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, md: 3 }}>
              <Paper sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Hari Ini
                    </Typography>
                    <Typography variant="h5" sx={{ mt: 0.5 }}>
                      {adminSummary.total}
                    </Typography>
                  </Box>
                  <Chip
                    icon={<PendingActionsRoundedIcon />}
                    label="Monitoring"
                    sx={{ bgcolor: '#eef3fb', color: 'text.secondary' }}
                  />
                </Stack>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Paper sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Hadir
                    </Typography>
                    <Typography variant="h5" sx={{ mt: 0.5 }}>
                      {adminSummary.hadir}
                    </Typography>
                  </Box>
                  <Chip
                    icon={<CheckCircleOutlineRoundedIcon />}
                    label="Tepat waktu"
                    sx={{ bgcolor: 'rgba(31, 157, 116, 0.12)', color: 'secondary.main' }}
                  />
                </Stack>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Paper sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Terlambat
                    </Typography>
                    <Typography variant="h5" sx={{ mt: 0.5 }}>
                      {adminSummary.terlambat}
                    </Typography>
                  </Box>
                  <Chip
                    icon={<WarningAmberRoundedIcon />}
                    label="Perlu follow-up"
                    sx={{ bgcolor: 'rgba(237, 138, 24, 0.14)', color: '#c26a00' }}
                  />
                </Stack>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Paper sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Belum Masuk
                    </Typography>
                    <Typography variant="h5" sx={{ mt: 0.5 }}>
                      {adminSummary.belumMasuk}
                    </Typography>
                  </Box>
                  <Chip
                    icon={<AccessTimeRoundedIcon />}
                    label="Menunggu"
                    sx={{ bgcolor: '#eef3fb', color: 'text.secondary' }}
                  />
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          <Paper sx={{ p: 3 }}>
            <Stack
              direction={{ xs: 'column', xl: 'row' }}
              justifyContent="space-between"
              spacing={2}
              sx={{ mb: 3 }}
            >
              <Box>
                <Typography variant="h6">Rekap Absensi Hari Ini</Typography>
                <Typography variant="body2" color="text.secondary">
                  Fokus pada kehadiran tanggal {formatDate(today)} untuk seluruh karyawan.
                </Typography>
              </Box>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
                <Button
                  variant="outlined"
                  startIcon={<DownloadRoundedIcon />}
                  onClick={handleExportAttendance}
                  disabled={isSubmitting}
                >
                  Export CSV
                </Button>
                <TextField
                  placeholder="Cari nama karyawan"
                  value={adminKeyword}
                  onChange={(event) => setAdminKeyword(event.target.value)}
                  sx={{ minWidth: { xs: '100%', md: 260 } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchRoundedIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <Select
                  value={adminStatusFilter}
                  onChange={(event) => setAdminStatusFilter(event.target.value)}
                  sx={{ minWidth: { xs: '100%', md: 190 } }}
                >
                  <MenuItem value="Semua Status">Semua Status</MenuItem>
                  <MenuItem value="Hadir">Hadir</MenuItem>
                  <MenuItem value="Terlambat">Terlambat</MenuItem>
                  <MenuItem value="Belum Masuk">Belum Masuk</MenuItem>
                </Select>
              </Stack>
            </Stack>

            <Box sx={{ display: { xs: 'grid', md: 'none' }, gap: 1.5 }}>
              {filteredAdminRecords.map((record) => (
                <Paper key={record.id} variant="outlined" sx={{ p: 2.25, borderRadius: '20px' }}>
                  <Stack spacing={1.5}>
                    <Stack direction="row" justifyContent="space-between" spacing={1.5}>
                      <Box>
                        <Typography variant="subtitle1">{record.nama}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {record.departemen}
                        </Typography>
                      </Box>
                      <Chip label={record.status} size="small" sx={getStatusStyle(record.status)} />
                    </Stack>
                    <Divider />
                    <Grid container spacing={1.25}>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="caption" color="text.secondary">
                          Tanggal
                        </Typography>
                        <Typography variant="body2">{formatDate(record.tanggal)}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="caption" color="text.secondary">
                          Waktu Masuk
                        </Typography>
                        <Typography variant="body2">{record.waktuMasuk || '-'}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="caption" color="text.secondary">
                          Waktu Keluar
                        </Typography>
                        <Typography variant="body2">{record.waktuKeluar || '-'}</Typography>
                      </Grid>
                    </Grid>
                  </Stack>
                </Paper>
              ))}
              {filteredAdminRecords.length === 0 ? (
                <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', borderRadius: '20px' }}>
                  <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                    Tidak ada data absensi yang cocok
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Coba ubah kata kunci atau filter status.
                  </Typography>
                </Paper>
              ) : null}
            </Box>

            <TableContainer sx={{ display: { xs: 'none', md: 'block' } }}>
              <Table sx={{ minWidth: 860 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Nama</TableCell>
                    <TableCell>Departemen</TableCell>
                    <TableCell>Tanggal</TableCell>
                    <TableCell>Waktu Masuk</TableCell>
                    <TableCell>Waktu Keluar</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAdminRecords.map((record) => (
                    <TableRow key={record.id} hover>
                      <TableCell>{record.nama}</TableCell>
                      <TableCell>{record.departemen}</TableCell>
                      <TableCell>{formatDate(record.tanggal)}</TableCell>
                      <TableCell>{record.waktuMasuk || '-'}</TableCell>
                      <TableCell>{record.waktuKeluar || '-'}</TableCell>
                      <TableCell>
                        <Chip label={record.status} size="small" sx={getStatusStyle(record.status)} />
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredAdminRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Box sx={{ py: 6, textAlign: 'center' }}>
                          <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                            Tidak ada data absensi yang cocok
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Coba ubah kata kunci atau filter status.
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      ) : (
        <>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Stack spacing={2.5}>
                  <Box>
                    <Typography variant="h6">Aksi Absensi Hari Ini</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {employeeDisplayName} dapat mencatat kehadiran langsung dari panel ini.
                    </Typography>
                  </Box>
                  <Grid container spacing={1.5}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        fullWidth
                        startIcon={<LoginRoundedIcon />}
                        disabled={isClockInDisabled}
                        onClick={handleClockIn}
                        sx={{
                          py: 2.25,
                          '&.Mui-disabled': {
                            bgcolor: '#d8dee9',
                            color: '#7b8798',
                          },
                        }}
                      >
                        {hasClockedIn ? 'Clock-in selesai' : 'Clock-in'}
                      </Button>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        startIcon={<LogoutRoundedIcon />}
                        disabled={isClockOutDisabled}
                        onClick={handleClockOut}
                        sx={{
                          py: 2.25,
                          '&.Mui-disabled': {
                            bgcolor: '#d8dee9',
                            color: '#7b8798',
                          },
                        }}
                      >
                        {hasClockedOut ? 'Clock-out selesai' : 'Clock-out'}
                      </Button>
                    </Grid>
                  </Grid>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2.5,
                      borderRadius: '20px',
                      bgcolor: '#f7f9fd',
                      borderColor: 'divider',
                    }}
                  >
                    <Stack spacing={1.75}>
                      <Typography variant="subtitle1">Status Hari Ini</Typography>
                      <Grid container spacing={1.5}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Waktu Masuk
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {employeeTodayRecord.waktuMasuk || '-'}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Waktu Keluar
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {employeeTodayRecord.waktuKeluar || '-'}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.75 }}>
                            Status
                          </Typography>
                          <Chip
                            label={employeeTodayRecord.status}
                            size="small"
                            sx={getStatusStyle(employeeTodayRecord.status)}
                          />
                        </Grid>
                      </Grid>
                    </Stack>
                  </Paper>
                </Stack>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, lg: 7 }}>
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper sx={{ p: 3 }}>
                    <Stack direction="row" justifyContent="space-between" spacing={2}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Hadir Bulan Ini
                        </Typography>
                        <Typography variant="h5" sx={{ mt: 0.5 }}>
                          {employeeSummary.hadirCount}
                        </Typography>
                      </Box>
                      <Chip
                        icon={<CheckCircleOutlineRoundedIcon />}
                        label="Konsisten"
                        sx={{ bgcolor: 'rgba(31, 157, 116, 0.12)', color: 'secondary.main' }}
                      />
                    </Stack>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper sx={{ p: 3 }}>
                    <Stack direction="row" justifyContent="space-between" spacing={2}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Keterlambatan
                        </Typography>
                        <Typography variant="h5" sx={{ mt: 0.5 }}>
                          {employeeSummary.terlambatCount}
                        </Typography>
                      </Box>
                      <Chip
                        icon={<WarningAmberRoundedIcon />}
                        label="Perlu dijaga"
                        sx={{ bgcolor: 'rgba(237, 138, 24, 0.14)', color: '#c26a00' }}
                      />
                    </Stack>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 0.5 }}>
                      Riwayat Absensi Saya
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                      Riwayat kehadiran pribadi untuk beberapa hari terakhir.
                    </Typography>
                    <Box sx={{ display: { xs: 'grid', md: 'none' }, gap: 1.5 }}>
                      {employeeAttendanceRecords.map((record) => (
                        <Paper key={record.id} variant="outlined" sx={{ p: 2.25, borderRadius: '20px' }}>
                          <Stack spacing={1.25}>
                            <Stack direction="row" justifyContent="space-between" spacing={1.5}>
                              <Typography variant="subtitle2">{formatDate(record.tanggal)}</Typography>
                              <Chip label={record.status} size="small" sx={getStatusStyle(record.status)} />
                            </Stack>
                            <Divider />
                            <Grid container spacing={1.25}>
                              <Grid size={{ xs: 6 }}>
                                <Typography variant="caption" color="text.secondary">
                                  Masuk
                                </Typography>
                                <Typography variant="body2">{record.waktuMasuk || '-'}</Typography>
                              </Grid>
                              <Grid size={{ xs: 6 }}>
                                <Typography variant="caption" color="text.secondary">
                                  Keluar
                                </Typography>
                                <Typography variant="body2">{record.waktuKeluar || '-'}</Typography>
                              </Grid>
                            </Grid>
                          </Stack>
                        </Paper>
                      ))}
                    </Box>

                    <TableContainer sx={{ display: { xs: 'none', md: 'block' } }}>
                      <Table sx={{ minWidth: 620 }}>
                        <TableHead>
                          <TableRow>
                            <TableCell>Tanggal</TableCell>
                            <TableCell>Waktu Masuk</TableCell>
                            <TableCell>Waktu Keluar</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {employeeAttendanceRecords.map((record) => (
                            <TableRow key={record.id} hover>
                              <TableCell>{formatDate(record.tanggal)}</TableCell>
                              <TableCell>{record.waktuMasuk || '-'}</TableCell>
                              <TableCell>{record.waktuKeluar || '-'}</TableCell>
                              <TableCell>
                                <Chip label={record.status} size="small" sx={getStatusStyle(record.status)} />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </>
      )}
      </Stack>
    </PageDataShell>
  );
}
