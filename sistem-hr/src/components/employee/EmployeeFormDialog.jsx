import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid2 as Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
} from '@mui/material';
export default function EmployeeFormDialog({
  open,
  title,
  form,
  departmentOptions,
  positionOptions,
  isEditing = false,
  isSubmitting,
  onClose,
  onChange,
  onSubmit,
  fieldErrors = {},
  errorMessage = '',
}) {
  return (
    <Dialog open={open} onClose={isSubmitting ? () => {} : onClose} fullWidth maxWidth="md">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ pt: 0.5 }}>
          {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
          <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Nomor Induk"
              value={form.nomorInduk}
              onChange={(event) => onChange('nomorInduk', event.target.value)}
              fullWidth
              error={Boolean(fieldErrors.nomorInduk)}
              helperText={fieldErrors.nomorInduk || ' '}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Nama Lengkap"
              value={form.namaLengkap}
              onChange={(event) => onChange('namaLengkap', event.target.value)}
              fullWidth
              error={Boolean(fieldErrors.namaLengkap)}
              helperText={fieldErrors.namaLengkap || ' '}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Email"
              type="email"
              name="employee-email"
              autoComplete="new-email"
              value={form.email}
              onChange={(event) => onChange('email', event.target.value)}
              fullWidth
              error={Boolean(fieldErrors.email)}
              helperText={fieldErrors.email || ' '}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label={isEditing ? 'Password Baru' : 'Password Awal'}
              type="password"
              name="employee-password"
              autoComplete="new-password"
              value={form.password}
              onChange={(event) => onChange('password', event.target.value)}
              fullWidth
              error={Boolean(fieldErrors.password)}
              helperText={
                fieldErrors.password ||
                (isEditing
                  ? 'Kosongkan jika password tidak ingin diubah.'
                  : 'Minimal 8 karakter. Password ini dipakai karyawan untuk login.')
              }
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label={isEditing ? 'Konfirmasi Password Baru' : 'Konfirmasi Password'}
              type="password"
              name="employee-password-confirmation"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={(event) => onChange('confirmPassword', event.target.value)}
              fullWidth
              error={Boolean(fieldErrors.confirmPassword)}
              helperText={fieldErrors.confirmPassword || ' '}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth error={Boolean(fieldErrors.departemen)}>
              <InputLabel id="departemen-label">Departemen</InputLabel>
              <Select
                labelId="departemen-label"
                label="Departemen"
                value={form.departemen}
                onChange={(event) => onChange('departemen', event.target.value)}
              >
                {departmentOptions
                  .filter((option) => option !== 'Semua Departemen')
                  .map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
              </Select>
              <FormHelperText>{fieldErrors.departemen || ' '}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth error={Boolean(fieldErrors.jabatan)}>
              <InputLabel id="jabatan-label">Jabatan</InputLabel>
              <Select
                labelId="jabatan-label"
                label="Jabatan"
                value={form.jabatan}
                onChange={(event) => onChange('jabatan', event.target.value)}
              >
                <MenuItem value="" disabled>
                  Pilih Jabatan
                </MenuItem>
                {positionOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{fieldErrors.jabatan || ' '}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Tanggal Bergabung"
              type="date"
              value={form.tanggalBergabung}
              onChange={(event) => onChange('tanggalBergabung', event.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={Boolean(fieldErrors.tanggalBergabung)}
              helperText={fieldErrors.tanggalBergabung || ' '}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              spacing={2}
              sx={{
                px: 2,
                py: 1.5,
                borderRadius: 3,
                bgcolor: '#f7f9fd',
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={form.statusAktif}
                    onChange={(event) => onChange('statusAktif', event.target.checked)}
                  />
                }
                label={form.statusAktif ? 'Status aktif' : 'Status nonaktif'}
              />
            </Stack>
          </Grid>
          </Grid>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Batal
        </Button>
        <Button variant="contained" onClick={onSubmit} disabled={isSubmitting}>
          Simpan
        </Button>
      </DialogActions>
    </Dialog>
  );
}
