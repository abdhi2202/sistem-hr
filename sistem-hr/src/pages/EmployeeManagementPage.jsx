import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  Grid2 as Grid,
  InputAdornment,
  InputLabel,
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
import DeleteEmployeeDialog from '../components/employee/DeleteEmployeeDialog';
import EmployeeFormDialog from '../components/employee/EmployeeFormDialog';
import AccessDeniedState from '../components/state/AccessDeniedState';
import PageDataShell from '../components/state/PageDataShell';
import { useHrData } from '../context/HrDataContext';
import { useRole } from '../context/RoleContext';
import { emptyEmployeeForm } from '../data/employeeData';
import { getApiErrorMessage, getApiFieldErrors, getFieldError } from '../utils/apiFeedback';

function formatDate(dateString) {
  if (!dateString) {
    return '-';
  }

  const parsedDate = new Date(dateString);

  if (Number.isNaN(parsedDate.getTime())) {
    return '-';
  }

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsedDate);
}

function downloadCsv(rows) {
  const header = [
    'Nomor Induk',
    'Nama Lengkap',
    'Email',
    'Departemen',
    'Jabatan',
    'Tanggal Bergabung',
    'Status Aktif',
  ];

  const csvRows = rows.map((employee) =>
    [
      employee.nomorInduk,
      employee.namaLengkap,
      employee.email,
      employee.departemen,
      employee.jabatan,
      employee.tanggalBergabung,
      employee.statusAktif ? 'Aktif' : 'Nonaktif',
    ]
      .map((value) => `"${String(value).replaceAll('"', '""')}"`)
      .join(','),
  );

  const csvContent = [header.join(','), ...csvRows].join('\n');
  const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'daftar-karyawan.csv';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function EmployeeManagementPage() {
  const { role } = useRole();
  const {
    employees,
    departments,
    positions,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    exportEmployeesCsv,
    dataSourceMode,
  } = useHrData();
  const safeEmployees = Array.isArray(employees) ? employees.filter(Boolean) : [];
  const safeDepartments = Array.isArray(departments) ? departments : [];
  const safePositions = Array.isArray(positions) ? positions : [];
  const [keyword, setKeyword] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('Semua Departemen');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [form, setForm] = useState(emptyEmployeeForm);
  const [message, setMessage] = useState({ type: 'success', text: '' });
  const [formErrors, setFormErrors] = useState({});
  const [formErrorMessage, setFormErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const departmentOptions = useMemo(
    () => [
      'Semua Departemen',
      ...safeDepartments
        .map((department) => department?.nama)
        .filter(Boolean),
    ],
    [safeDepartments],
  );
  const positionOptions = useMemo(
    () => safePositions.map((position) => position?.nama).filter(Boolean),
    [safePositions],
  );

  const filteredEmployees = useMemo(() => {
    return safeEmployees.filter((employee) => {
      const matchesKeyword = (employee?.namaLengkap ?? '')
        .toLowerCase()
        .includes(keyword.trim().toLowerCase());
      const matchesDepartment =
        departmentFilter === 'Semua Departemen' || employee?.departemen === departmentFilter;

      return matchesKeyword && matchesDepartment;
    });
  }, [departmentFilter, keyword, safeEmployees]);

  const summary = useMemo(() => {
    const aktif = safeEmployees.filter((employee) => employee?.statusAktif).length;
    const nonaktif = safeEmployees.length - aktif;
    return {
      total: safeEmployees.length,
      aktif,
      nonaktif,
    };
  }, [safeEmployees]);

  if (role !== 'admin_hr') {
    return (
      <AccessDeniedState description="Modul manajemen karyawan hanya tersedia untuk Admin HR." />
    );
  }

  function resetForm() {
    setForm(emptyEmployeeForm);
    setEditingEmployeeId(null);
    setFormErrors({});
    setFormErrorMessage('');
  }

  function handleOpenCreate() {
    resetForm();
    setDialogOpen(true);
  }

  function handleOpenEdit(employee) {
    if (!employee) {
      return;
    }

    setEditingEmployeeId(employee.id);
    setForm({
      nomorInduk: employee.nomorInduk,
      namaLengkap: employee.namaLengkap,
      email: employee.email,
      password: '',
      confirmPassword: '',
      departemen: employee.departemen,
      jabatan: employee.jabatan,
      tanggalBergabung: employee.tanggalBergabung,
      statusAktif: employee.statusAktif,
    });
    setDialogOpen(true);
  }

  function handleCloseDialog() {
    setDialogOpen(false);
    resetForm();
  }

  function handleChange(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setFormErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  }

  async function handleSubmit() {
    const nextFormErrors = {};

    if (
      !form.nomorInduk ||
      !form.namaLengkap ||
      !form.email ||
      !form.departemen ||
      !form.jabatan ||
      !form.tanggalBergabung
    ) {
      if (!form.nomorInduk) nextFormErrors.nomorInduk = 'Nomor induk wajib diisi.';
      if (!form.namaLengkap) nextFormErrors.namaLengkap = 'Nama lengkap wajib diisi.';
      if (!form.email) nextFormErrors.email = 'Email wajib diisi.';
      if (!form.departemen) nextFormErrors.departemen = 'Departemen wajib dipilih.';
      if (!form.jabatan) nextFormErrors.jabatan = 'Jabatan wajib diisi.';
      if (!form.tanggalBergabung) nextFormErrors.tanggalBergabung = 'Tanggal bergabung wajib diisi.';
      setFormErrors(nextFormErrors);
      setFormErrorMessage('Semua field utama harus diisi sebelum menyimpan data karyawan.');
      return;
    }

    if (!editingEmployeeId && !form.password) {
      setFormErrors({
        password: 'Password awal wajib diisi.',
      });
      setFormErrorMessage('Isi password awal agar karyawan baru bisa login.');
      return;
    }

    if ((form.password || form.confirmPassword) && form.password.length < 8) {
      setFormErrors({
        password: 'Password minimal 8 karakter.',
      });
      setFormErrorMessage('Password minimal 8 karakter.');
      return;
    }

    if ((form.password || form.confirmPassword) && form.password !== form.confirmPassword) {
      setFormErrors({
        confirmPassword: 'Konfirmasi password harus sama.',
      });
      setFormErrorMessage('Konfirmasi password harus sama dengan password.');
      return;
    }

    setIsSubmitting(true);
    setFormErrors({});
    setFormErrorMessage('');

    try {
      if (editingEmployeeId) {
        await updateEmployee(editingEmployeeId, form);
        setMessage({ type: 'success', text: 'Data karyawan berhasil diperbarui.' });
      } else {
        await addEmployee(form);
        setMessage({ type: 'success', text: 'Karyawan baru berhasil ditambahkan.' });
      }

      handleCloseDialog();
    } catch (error) {
      const apiFieldErrors = getApiFieldErrors(error);
      setFormErrors({
        nomorInduk: getFieldError(apiFieldErrors, 'nomor_induk', 'nomorInduk'),
        namaLengkap: getFieldError(apiFieldErrors, 'nama_lengkap', 'namaLengkap'),
        email: getFieldError(apiFieldErrors, 'email'),
        password: getFieldError(apiFieldErrors, 'password'),
        confirmPassword: getFieldError(
          apiFieldErrors,
          'password_confirmation',
          'confirmPassword',
        ),
        departemen: getFieldError(apiFieldErrors, 'departemen'),
        jabatan: getFieldError(apiFieldErrors, 'jabatan'),
        tanggalBergabung: getFieldError(apiFieldErrors, 'tanggal_bergabung', 'tanggalBergabung'),
      });
      setFormErrorMessage(getApiErrorMessage(error, 'Gagal menyimpan data karyawan.'));
      setMessage({ type: 'error', text: '' });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleAskDelete(employee) {
    setSelectedEmployee(employee);
    setDeleteOpen(true);
  }

  async function handleConfirmDelete() {
    if (!selectedEmployee) {
      return;
    }

    setIsSubmitting(true);

    try {
      await deleteEmployee(selectedEmployee.id);
      setDeleteOpen(false);
      setSelectedEmployee(null);
      setMessage({ type: 'success', text: 'Data karyawan berhasil dihapus.' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: getApiErrorMessage(error, 'Data karyawan gagal dihapus.'),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleExportCsv() {
    try {
      if (dataSourceMode === 'http') {
        await exportEmployeesCsv();
      } else {
        downloadCsv(filteredEmployees);
      }

      setMessage({ type: 'success', text: 'File CSV karyawan berhasil diproses.' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: getApiErrorMessage(error, 'Export CSV karyawan gagal diproses.'),
      });
    }
  }

  return (
    <PageDataShell title="data karyawan">
      <Stack spacing={3}>
      <Box
        sx={{
          px: { xs: 2.5, md: 3.5 },
          py: { xs: 3, md: 3.5 },
          borderRadius: '20px',
          background:
            'linear-gradient(135deg, rgba(18, 32, 51, 1), rgba(25, 91, 193, 0.92) 56%, rgba(31, 157, 116, 0.70))',
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
              Admin HR
            </Typography>
            <Typography variant="h4" sx={{ mt: 0.5, mb: 1 }}>
              Manajemen Karyawan
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: 720, opacity: 0.9 }}>
              Kelola daftar karyawan, lakukan pencarian cepat, filter departemen, dan siapkan data
              untuk ekspor CSV.
            </Typography>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<DownloadRoundedIcon />}
              disabled={isSubmitting}
              onClick={handleExportCsv}
            >
              Export CSV
            </Button>
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={handleOpenCreate}
              disabled={isSubmitting}
              sx={{
                bgcolor: '#ffffff',
                color: 'primary.main',
                boxShadow: '0 10px 28px rgba(10, 37, 99, 0.18)',
                '&:hover': {
                  bgcolor: '#eef4ff',
                },
                '&.Mui-disabled': {
                  bgcolor: 'rgba(255,255,255,0.38)',
                  color: 'rgba(255,255,255,0.82)',
                },
              }}
            >
              Tambah Karyawan
            </Button>
          </Stack>
        </Stack>
      </Box>

      {message.text ? <Alert severity={message.type}>{message.text}</Alert> : null}

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Karyawan
                </Typography>
                <Typography variant="h5" sx={{ mt: 0.5 }}>
                  {summary.total}
                </Typography>
              </Box>
              <Chip
                icon={<PeopleAltOutlinedIcon />}
                label="Semua data"
                sx={{ bgcolor: 'rgba(31, 94, 255, 0.12)', color: 'primary.main' }}
              />
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Karyawan Aktif
                </Typography>
                <Typography variant="h5" sx={{ mt: 0.5 }}>
                  {summary.aktif}
                </Typography>
              </Box>
              <Chip
                label="Aktif"
                sx={{ bgcolor: 'rgba(31, 157, 116, 0.12)', color: 'secondary.main' }}
              />
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Karyawan Nonaktif
                </Typography>
                <Typography variant="h5" sx={{ mt: 0.5 }}>
                  {summary.nonaktif}
                </Typography>
              </Box>
              <Chip
                icon={<PersonOffOutlinedIcon />}
                label="Perlu review"
                sx={{ bgcolor: 'rgba(237, 138, 24, 0.14)', color: '#c26a00' }}
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
            <Typography variant="h6">Daftar Karyawan</Typography>
            <Typography variant="body2" color="text.secondary">
              Gunakan pencarian nama dan filter departemen untuk mempersempit data.
            </Typography>
          </Box>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
            <TextField
              placeholder="Cari berdasarkan nama"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              sx={{ minWidth: { xs: '100%', md: 280 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl sx={{ minWidth: { xs: '100%', md: 220 } }}>
              <InputLabel id="filter-departemen-label">Filter Departemen</InputLabel>
              <Select
                labelId="filter-departemen-label"
                label="Filter Departemen"
                value={departmentFilter}
                onChange={(event) => setDepartmentFilter(event.target.value)}
              >
                {departmentOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Stack>

        <Box sx={{ display: { xs: 'grid', md: 'none' }, gap: 1.5 }}>
          {filteredEmployees.map((employee) => (
            <Paper key={employee.id} variant="outlined" sx={{ p: 2.25, borderRadius: '20px' }}>
              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between" spacing={1.5}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle1" noWrap>
                      {employee.namaLengkap}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
                      {employee.email}
                    </Typography>
                  </Box>
                  <Chip
                    label={employee.statusAktif ? 'Aktif' : 'Nonaktif'}
                    size="small"
                    sx={
                      employee.statusAktif
                        ? { bgcolor: 'rgba(31, 157, 116, 0.12)', color: 'secondary.main' }
                        : { bgcolor: 'rgba(237, 138, 24, 0.14)', color: '#c26a00' }
                    }
                  />
                </Stack>
                <Divider />
                <Grid container spacing={1.25}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary">
                      Nomor Induk
                    </Typography>
                    <Typography variant="body2">{employee.nomorInduk}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary">
                      Departemen
                    </Typography>
                    <Typography variant="body2">{employee.departemen}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary">
                      Jabatan
                    </Typography>
                    <Typography variant="body2">{employee.jabatan}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary">
                      Bergabung
                    </Typography>
                    <Typography variant="body2">{formatDate(employee.tanggalBergabung)}</Typography>
                  </Grid>
                </Grid>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <Button
                    variant="outlined"
                    startIcon={<EditOutlinedIcon />}
                    onClick={() => handleOpenEdit(employee)}
                    fullWidth
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteOutlineRoundedIcon />}
                    onClick={() => handleAskDelete(employee)}
                    fullWidth
                  >
                    Hapus
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          ))}
          {filteredEmployees.length === 0 ? (
            <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', borderRadius: '20px' }}>
              <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                Tidak ada karyawan yang cocok
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Coba ubah kata kunci pencarian atau pilih departemen lain.
              </Typography>
            </Paper>
          ) : null}
        </Box>

        <TableContainer sx={{ display: { xs: 'none', md: 'block' } }}>
          <Table sx={{ minWidth: 880 }}>
            <TableHead>
              <TableRow>
                <TableCell>Nomor Induk</TableCell>
                <TableCell>Nama Karyawan</TableCell>
                <TableCell>Departemen</TableCell>
                <TableCell>Jabatan</TableCell>
                <TableCell>Tanggal Bergabung</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id} hover>
                  <TableCell>{employee.nomorInduk}</TableCell>
                  <TableCell>
                    <Stack spacing={0.25}>
                      <Typography variant="subtitle2">{employee.namaLengkap}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {employee.email}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{employee.departemen}</TableCell>
                  <TableCell>{employee.jabatan}</TableCell>
                  <TableCell>{formatDate(employee.tanggalBergabung)}</TableCell>
                  <TableCell>
                    <Chip
                      label={employee.statusAktif ? 'Aktif' : 'Nonaktif'}
                      size="small"
                      sx={
                        employee.statusAktif
                          ? {
                              bgcolor: 'rgba(31, 157, 116, 0.12)',
                              color: 'secondary.main',
                            }
                          : {
                              bgcolor: 'rgba(237, 138, 24, 0.14)',
                              color: '#c26a00',
                            }
                      }
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button
                        variant="text"
                        startIcon={<EditOutlinedIcon />}
                        onClick={() => handleOpenEdit(employee)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="text"
                        color="error"
                        startIcon={<DeleteOutlineRoundedIcon />}
                        onClick={() => handleAskDelete(employee)}
                      >
                        Hapus
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Box
                      sx={{
                        py: 6,
                        textAlign: 'center',
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                        Tidak ada karyawan yang cocok
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Coba ubah kata kunci pencarian atau pilih departemen lain.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <EmployeeFormDialog
        open={dialogOpen}
        title={editingEmployeeId ? 'Edit Karyawan' : 'Tambah Karyawan'}
        form={form}
        departmentOptions={departmentOptions}
        positionOptions={positionOptions}
        isEditing={Boolean(editingEmployeeId)}
        onClose={isSubmitting ? () => {} : handleCloseDialog}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        fieldErrors={formErrors}
        errorMessage={formErrorMessage}
      />

      <DeleteEmployeeDialog
        open={deleteOpen}
        employeeName={selectedEmployee?.namaLengkap ?? ''}
        onClose={() => {
          if (isSubmitting) {
            return;
          }
          setDeleteOpen(false);
          setSelectedEmployee(null);
        }}
        onConfirm={handleConfirmDelete}
        isSubmitting={isSubmitting}
      />
      </Stack>
    </PageDataShell>
  );
}
