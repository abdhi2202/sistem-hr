import ApprovalRoundedIcon from '@mui/icons-material/ApprovalRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import EventBusyRoundedIcon from '@mui/icons-material/EventBusyRounded';
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
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
import { emptyLeaveForm } from '../data/leaveData';
import { getApiErrorMessage, getApiFieldErrors, getFieldError } from '../utils/apiFeedback';

function formatDate(dateString) {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString));
}

function formatPeriod(start, end) {
  return `${formatDate(start)} - ${formatDate(end)}`;
}

function getStatusStyle(status) {
  if (status === 'Disetujui') {
    return { bgcolor: 'rgba(31, 157, 116, 0.12)', color: 'secondary.main' };
  }

  if (status === 'Pending') {
    return { bgcolor: 'rgba(237, 138, 24, 0.14)', color: '#c26a00' };
  }

  return { bgcolor: '#eef3fb', color: 'text.secondary' };
}

export default function LeavePage() {
  const { role } = useRole();
  const {
    adminLeaveRequests,
    employeeLeaves,
    createLeaveRequest,
    updateLeaveStatus,
  } = useHrData();
  const [form, setForm] = useState(emptyLeaveForm);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [message, setMessage] = useState({ type: 'success', text: '' });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const adminSummary = useMemo(() => {
    const pending = adminLeaveRequests.filter((leave) => leave.status === 'Pending').length;
    const approved = adminLeaveRequests.filter((leave) => leave.status === 'Disetujui').length;
    const rejected = adminLeaveRequests.filter((leave) => leave.status === 'Ditolak').length;

    return {
      total: adminLeaveRequests.length,
      pending,
      approved,
      rejected,
    };
  }, [adminLeaveRequests]);

  const filteredAdminLeaves = useMemo(() => {
    return adminLeaveRequests.filter((leave) => {
      const matchesKeyword = leave.nama.toLowerCase().includes(keyword.trim().toLowerCase());
      const matchesStatus = statusFilter === 'Semua Status' || leave.status === statusFilter;
      return matchesKeyword && matchesStatus;
    });
  }, [adminLeaveRequests, keyword, statusFilter]);

  const employeeSummary = useMemo(() => {
    const pending = employeeLeaves.filter((leave) => leave.status === 'Pending').length;
    const approved = employeeLeaves.filter((leave) => leave.status === 'Disetujui').length;
    return {
      total: employeeLeaves.length,
      pending,
      approved,
    };
  }, [employeeLeaves]);

  function handleFormChange(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setFormErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  }

  async function handleSubmitLeave() {
    const nextErrors = {};

    if (!form.tanggalMulai || !form.tanggalSelesai || !form.alasan.trim()) {
      if (!form.tanggalMulai) nextErrors.tanggalMulai = 'Tanggal mulai wajib diisi.';
      if (!form.tanggalSelesai) nextErrors.tanggalSelesai = 'Tanggal selesai wajib diisi.';
      if (!form.alasan.trim()) nextErrors.alasan = 'Alasan cuti wajib diisi.';
      setFormErrors(nextErrors);
      setMessage({
        type: 'error',
        text: 'Lengkapi tanggal mulai, tanggal selesai, dan alasan cuti terlebih dahulu.',
      });
      return;
    }

    setIsSubmitting(true);
    setFormErrors({});

    try {
      await createLeaveRequest(form);
      setForm(emptyLeaveForm);
      setMessage({
        type: 'success',
        text: 'Pengajuan cuti berhasil dibuat dan menunggu persetujuan Admin HR.',
      });
    } catch (error) {
      const apiFieldErrors = getApiFieldErrors(error);
      setFormErrors({
        tanggalMulai: getFieldError(apiFieldErrors, 'tanggal_mulai', 'tanggalMulai'),
        tanggalSelesai: getFieldError(apiFieldErrors, 'tanggal_selesai', 'tanggalSelesai'),
        alasan: getFieldError(apiFieldErrors, 'alasan'),
      });
      setMessage({
        type: 'error',
        text: getApiErrorMessage(error, 'Pengajuan cuti gagal diproses.'),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdateStatus(id, status) {
    setIsSubmitting(true);

    try {
      await updateLeaveStatus(id, status);
      setMessage({
        type: 'success',
        text:
          status === 'Disetujui'
            ? 'Pengajuan cuti berhasil disetujui.'
            : 'Pengajuan cuti berhasil ditolak.',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: getApiErrorMessage(error, 'Status pengajuan cuti gagal diperbarui.'),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageDataShell title="cuti">
      <Stack spacing={3}>
      <Box
        sx={{
          px: { xs: 2.5, md: 3.5 },
          py: { xs: 3, md: 3.5 },
          borderRadius: '20px',
          background:
            'linear-gradient(135deg, rgba(18, 32, 51, 1), rgba(25, 91, 193, 0.90) 54%, rgba(31, 157, 116, 0.72))',
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
              Cuti
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: 720, opacity: 0.9 }}>
              {role === 'admin_hr'
                ? 'Tinjau, setujui, atau tolak pengajuan cuti agar jadwal operasional tetap terkendali.'
                : 'Ajukan cuti baru dan pantau status pengajuan Anda langsung dari panel ini.'}
            </Typography>
          </Box>
          <Chip
            icon={<CalendarMonthRoundedIcon />}
            label="Alur cuti berbasis role"
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
                      Total Pengajuan
                    </Typography>
                    <Typography variant="h5" sx={{ mt: 0.5 }}>
                      {adminSummary.total}
                    </Typography>
                  </Box>
                  <Chip
                    icon={<EventBusyRoundedIcon />}
                    label="Semua"
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
                      Pending
                    </Typography>
                    <Typography variant="h5" sx={{ mt: 0.5 }}>
                      {adminSummary.pending}
                    </Typography>
                  </Box>
                  <Chip
                    icon={<PendingActionsRoundedIcon />}
                    label="Butuh keputusan"
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
                      Disetujui
                    </Typography>
                    <Typography variant="h5" sx={{ mt: 0.5 }}>
                      {adminSummary.approved}
                    </Typography>
                  </Box>
                  <Chip
                    icon={<CheckCircleOutlineRoundedIcon />}
                    label="Terkonfirmasi"
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
                      Ditolak
                    </Typography>
                    <Typography variant="h5" sx={{ mt: 0.5 }}>
                      {adminSummary.rejected}
                    </Typography>
                  </Box>
                  <Chip
                    icon={<ApprovalRoundedIcon />}
                    label="Selesai ditinjau"
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
                <Typography variant="h6">Daftar Pengajuan Cuti</Typography>
                <Typography variant="body2" color="text.secondary">
                  Tinjau pengajuan masuk dan ambil keputusan langsung dari tabel.
                </Typography>
              </Box>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
                <TextField
                  placeholder="Cari nama karyawan"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
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
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  sx={{ minWidth: { xs: '100%', md: 190 } }}
                >
                  <MenuItem value="Semua Status">Semua Status</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Disetujui">Disetujui</MenuItem>
                  <MenuItem value="Ditolak">Ditolak</MenuItem>
                </Select>
              </Stack>
            </Stack>

            <Box sx={{ display: { xs: 'grid', md: 'none' }, gap: 1.5 }}>
              {filteredAdminLeaves.map((leave) => (
                <Paper key={leave.id} variant="outlined" sx={{ p: 2.25, borderRadius: '20px' }}>
                  <Stack spacing={1.5}>
                    <Stack direction="row" justifyContent="space-between" spacing={1.5}>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="subtitle1">{leave.nama}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {leave.departemen}
                        </Typography>
                      </Box>
                      <Chip label={leave.status} size="small" sx={getStatusStyle(leave.status)} />
                    </Stack>
                    <Divider />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Periode
                      </Typography>
                      <Typography variant="body2">
                        {formatPeriod(leave.tanggalMulai, leave.tanggalSelesai)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Alasan
                      </Typography>
                      <Typography variant="body2">{leave.alasan}</Typography>
                    </Box>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                      <Button
                        variant="contained"
                        color="secondary"
                        disabled={leave.status !== 'Pending' || isSubmitting}
                        onClick={() => handleUpdateStatus(leave.id, 'Disetujui')}
                        fullWidth
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        disabled={leave.status !== 'Pending' || isSubmitting}
                        onClick={() => handleUpdateStatus(leave.id, 'Ditolak')}
                        fullWidth
                      >
                        Reject
                      </Button>
                    </Stack>
                  </Stack>
                </Paper>
              ))}
              {filteredAdminLeaves.length === 0 ? (
                <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', borderRadius: '20px' }}>
                  <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                    Tidak ada pengajuan yang cocok
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Coba ubah kata kunci pencarian atau filter status.
                  </Typography>
                </Paper>
              ) : null}
            </Box>

            <TableContainer sx={{ display: { xs: 'none', md: 'block' } }}>
              <Table sx={{ minWidth: 920 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Nama</TableCell>
                    <TableCell>Departemen</TableCell>
                    <TableCell>Periode</TableCell>
                    <TableCell>Alasan</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Aksi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAdminLeaves.map((leave) => (
                    <TableRow key={leave.id} hover>
                      <TableCell>{leave.nama}</TableCell>
                      <TableCell>{leave.departemen}</TableCell>
                      <TableCell>{formatPeriod(leave.tanggalMulai, leave.tanggalSelesai)}</TableCell>
                      <TableCell>{leave.alasan}</TableCell>
                      <TableCell>
                        <Chip label={leave.status} size="small" sx={getStatusStyle(leave.status)} />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Button
                            variant="text"
                            color="secondary"
                            disabled={leave.status !== 'Pending'}
                            loading={undefined}
                            onClick={() => handleUpdateStatus(leave.id, 'Disetujui')}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="text"
                            color="error"
                            disabled={leave.status !== 'Pending'}
                            onClick={() => handleUpdateStatus(leave.id, 'Ditolak')}
                          >
                            Reject
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredAdminLeaves.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Box sx={{ py: 6, textAlign: 'center' }}>
                          <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                            Tidak ada pengajuan yang cocok
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Coba ubah kata kunci pencarian atau filter status.
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
                    <Typography variant="h6">Ajukan Cuti Baru</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Isi periode cuti dan alasan pengajuan. Status awal akan otomatis `Pending`.
                    </Typography>
                  </Box>
                  <TextField
                    label="Tanggal Mulai"
                    type="date"
                    value={form.tanggalMulai}
                    onChange={(event) => handleFormChange('tanggalMulai', event.target.value)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    error={Boolean(formErrors.tanggalMulai)}
                    helperText={formErrors.tanggalMulai || ' '}
                  />
                  <TextField
                    label="Tanggal Selesai"
                    type="date"
                    value={form.tanggalSelesai}
                    onChange={(event) => handleFormChange('tanggalSelesai', event.target.value)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    error={Boolean(formErrors.tanggalSelesai)}
                    helperText={formErrors.tanggalSelesai || ' '}
                  />
                  <TextField
                    label="Alasan"
                    value={form.alasan}
                    onChange={(event) => handleFormChange('alasan', event.target.value)}
                    multiline
                    minRows={4}
                    fullWidth
                    error={Boolean(formErrors.alasan)}
                    helperText={formErrors.alasan || ' '}
                  />
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleSubmitLeave}
                    disabled={isSubmitting}
                    fullWidth
                  >
                    {isSubmitting ? 'Memproses...' : 'Ajukan Cuti'}
                  </Button>
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
                          Pengajuan Pending
                        </Typography>
                        <Typography variant="h5" sx={{ mt: 0.5 }}>
                          {employeeSummary.pending}
                        </Typography>
                      </Box>
                      <Chip
                        icon={<PendingActionsRoundedIcon />}
                        label="Menunggu review"
                        sx={{ bgcolor: 'rgba(237, 138, 24, 0.14)', color: '#c26a00' }}
                      />
                    </Stack>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper sx={{ p: 3 }}>
                    <Stack direction="row" justifyContent="space-between" spacing={2}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Pengajuan Disetujui
                        </Typography>
                        <Typography variant="h5" sx={{ mt: 0.5 }}>
                          {employeeSummary.approved}
                        </Typography>
                      </Box>
                      <Chip
                        icon={<CheckCircleOutlineRoundedIcon />}
                        label="Siap digunakan"
                        sx={{ bgcolor: 'rgba(31, 157, 116, 0.12)', color: 'secondary.main' }}
                      />
                    </Stack>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 0.5 }}>
                      Riwayat Pengajuan Cuti
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                      Pantau hasil pengajuan cuti terbaru tanpa berpindah halaman.
                    </Typography>
                    <Box sx={{ display: { xs: 'grid', md: 'none' }, gap: 1.5 }}>
                      {employeeLeaves.map((leave) => (
                        <Paper key={leave.id} variant="outlined" sx={{ p: 2.25, borderRadius: '20px' }}>
                          <Stack spacing={1.25}>
                            <Stack direction="row" justifyContent="space-between" spacing={1.5}>
                              <Typography variant="subtitle2">
                                {formatPeriod(leave.tanggalMulai, leave.tanggalSelesai)}
                              </Typography>
                              <Chip label={leave.status} size="small" sx={getStatusStyle(leave.status)} />
                            </Stack>
                            <Typography variant="body2" color="text.secondary">
                              {leave.alasan}
                            </Typography>
                          </Stack>
                        </Paper>
                      ))}
                    </Box>

                    <TableContainer sx={{ display: { xs: 'none', md: 'block' } }}>
                      <Table sx={{ minWidth: 640 }}>
                        <TableHead>
                          <TableRow>
                            <TableCell>Periode</TableCell>
                            <TableCell>Alasan</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {employeeLeaves.map((leave) => (
                            <TableRow key={leave.id} hover>
                              <TableCell>
                                {formatPeriod(leave.tanggalMulai, leave.tanggalSelesai)}
                              </TableCell>
                              <TableCell>{leave.alasan}</TableCell>
                              <TableCell>
                                <Chip label={leave.status} size="small" sx={getStatusStyle(leave.status)} />
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
