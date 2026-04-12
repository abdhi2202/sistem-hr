import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid2 as Grid,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useRole } from '../context/RoleContext';
import { profileByRole } from '../data/profileData';
import { getApiErrorMessage, getApiFieldErrors, getFieldError } from '../utils/apiFeedback';

function formatDate(dateString) {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString));
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="flex-start">
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: 3,
          display: 'grid',
          placeItems: 'center',
          bgcolor: '#eef3fb',
          color: 'primary.main',
          flexShrink: 0,
        }}
      >
        <Icon fontSize="small" />
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="subtitle2" sx={{ mt: 0.25 }}>
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}

export default function ProfilePage() {
  const { role, name, email, changePassword } = useRole();
  const baseProfile = profileByRole[role] ?? profileByRole.karyawan;
  const profile = useMemo(
    () => ({
      ...baseProfile,
      namaLengkap: name || baseProfile.namaLengkap,
      email: email || baseProfile.email,
    }),
    [baseProfile, email, name],
  );
  const [preferences, setPreferences] = useState({
    emailNotif: true,
    reminderAbsensi: role === 'karyawan',
    securityAlert: true,
  });
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordFieldErrors, setPasswordFieldErrors] = useState({});
  const [passwordFeedback, setPasswordFeedback] = useState({ type: 'success', text: '' });
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);

  const initials = profile.namaLengkap
    .split(' ')
    .map((segment) => segment[0])
    .slice(0, 2)
    .join('');

  function handlePreferenceChange(field, checked) {
    setPreferences((current) => ({
      ...current,
      [field]: checked,
    }));
  }

  function openPasswordDialog() {
    setPasswordFieldErrors({});
    setPasswordFeedback({ type: 'success', text: '' });
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setIsPasswordDialogOpen(true);
  }

  function closePasswordDialog() {
    if (isPasswordSubmitting) {
      return;
    }

    setIsPasswordDialogOpen(false);
  }

  function handlePasswordFieldChange(field, value) {
    setPasswordForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handlePasswordSubmit() {
    setIsPasswordSubmitting(true);
    setPasswordFieldErrors({});
    setPasswordFeedback({ type: 'success', text: '' });

    try {
      const response = await changePassword(passwordForm);

      setPasswordFeedback({
        type: 'success',
        text: response?.message || 'Password berhasil diperbarui.',
      });
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error);
      setPasswordFieldErrors(fieldErrors);
      setPasswordFeedback({
        type: 'error',
        text: getApiErrorMessage(error, 'Password gagal diperbarui.'),
      });
    } finally {
      setIsPasswordSubmitting(false);
    }
  }

  return (
    <Stack spacing={3}>
      <Box
        sx={{
          px: { xs: 2.5, md: 3.5 },
          py: { xs: 3, md: 3.5 },
          borderRadius: '20px',
          background:
            'linear-gradient(135deg, rgba(18, 32, 51, 1), rgba(25, 91, 193, 0.90) 56%, rgba(31, 157, 116, 0.72))',
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
              {profile.roleLabel}
            </Typography>
            <Typography variant="h4" sx={{ mt: 0.5, mb: 1 }}>
              Profil Pengguna
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: 720, opacity: 0.9 }}>
              Lihat ringkasan identitas, posisi kerja, dan pengaturan preferensi akun untuk sesi demo
              ini.
            </Typography>
          </Box>
          <Chip
            icon={<PersonRoundedIcon />}
            label={`${profile.statusAktif} - ${profile.roleLabel}`}
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

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, xl: 4 }}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Stack spacing={2.5} alignItems="flex-start">
              <Avatar
                sx={{
                  width: 84,
                  height: 84,
                  fontSize: 28,
                  fontWeight: 700,
                  bgcolor: 'primary.main',
                }}
              >
                {initials}
              </Avatar>

              <Box>
                <Typography variant="h5">{profile.namaLengkap}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                  {profile.bio}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip label={profile.roleLabel} color="primary" variant="outlined" />
                <Chip
                  label={profile.departemen}
                  sx={{ bgcolor: 'rgba(31, 157, 116, 0.12)', color: 'secondary.main' }}
                />
              </Stack>

              <Divider flexItem />

              <Stack spacing={2.25} width="100%">
                <InfoRow icon={EmailRoundedIcon} label="Email" value={profile.email} />
                <InfoRow icon={PhoneRoundedIcon} label="Telepon" value={profile.telepon} />
                <InfoRow icon={LocationOnRoundedIcon} label="Lokasi Kerja" value={profile.lokasiKerja} />
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, xl: 8 }}>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Informasi Kepegawaian
                </Typography>
                <Stack spacing={2.25}>
                  <InfoRow icon={BadgeRoundedIcon} label="Nomor Induk" value={profile.nomorInduk} />
                  <InfoRow icon={WorkRoundedIcon} label="Jabatan" value={profile.jabatan} />
                  <InfoRow
                    icon={BadgeRoundedIcon}
                    label="Tanggal Bergabung"
                    value={formatDate(profile.tanggalBergabung)}
                  />
                </Stack>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Keamanan Akun
                </Typography>
                <Stack spacing={2}>
                  <InfoRow icon={SecurityRoundedIcon} label="Status Sesi" value="Sedang aktif di browser ini" />
                  <InfoRow icon={EmailRoundedIcon} label="Metode Login" value="Akun demo lokal" />
                  {role === 'karyawan' ? (
                    <Button variant="outlined" sx={{ alignSelf: 'flex-start' }} onClick={openPasswordDialog}>
                      Ubah Password
                    </Button>
                  ) : null}
                </Stack>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 0.75 }}>
                  Preferensi Notifikasi
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                  Pengaturan ini bersifat demo dan belum tersimpan ke backend.
                </Typography>

                <Stack spacing={1.5}>
                  <Paper
                    variant="outlined"
                    sx={{ p: 2, borderRadius: '20px', borderColor: 'divider', bgcolor: '#f7f9fd' }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={preferences.emailNotif}
                          onChange={(event) =>
                            handlePreferenceChange('emailNotif', event.target.checked)
                          }
                        />
                      }
                      label={
                        <Stack spacing={0.25}>
                          <Typography variant="subtitle2">Notifikasi email</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Terima pembaruan aktivitas HR ke email akun Anda.
                          </Typography>
                        </Stack>
                      }
                    />
                  </Paper>

                  <Paper
                    variant="outlined"
                    sx={{ p: 2, borderRadius: '20px', borderColor: 'divider', bgcolor: '#f7f9fd' }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={preferences.reminderAbsensi}
                          onChange={(event) =>
                            handlePreferenceChange('reminderAbsensi', event.target.checked)
                          }
                        />
                      }
                      label={
                        <Stack spacing={0.25}>
                          <Typography variant="subtitle2">Pengingat absensi</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Ingatkan clock-in atau clock-out jika belum tercatat.
                          </Typography>
                        </Stack>
                      }
                    />
                  </Paper>

                  <Paper
                    variant="outlined"
                    sx={{ p: 2, borderRadius: '20px', borderColor: 'divider', bgcolor: '#f7f9fd' }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={preferences.securityAlert}
                          onChange={(event) =>
                            handlePreferenceChange('securityAlert', event.target.checked)
                          }
                        />
                      }
                      label={
                        <Stack spacing={0.25}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <NotificationsActiveRoundedIcon fontSize="small" color="primary" />
                            <Typography variant="subtitle2">Peringatan keamanan</Typography>
                          </Stack>
                          <Typography variant="body2" color="text.secondary">
                            Dapatkan notifikasi jika ada aktivitas login yang tidak biasa.
                          </Typography>
                        </Stack>
                      }
                    />
                  </Paper>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Dialog
        open={isPasswordDialogOpen}
        onClose={closePasswordDialog}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: '24px',
          },
        }}
      >
        <DialogTitle>Ubah Password</DialogTitle>
        <DialogContent dividers sx={{ py: 2.5 }}>
          <Stack spacing={2}>
            {passwordFeedback.text ? (
              <Alert severity={passwordFeedback.type}>{passwordFeedback.text}</Alert>
            ) : null}

            <TextField
              label="Password Saat Ini"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(event) => handlePasswordFieldChange('currentPassword', event.target.value)}
              error={Boolean(getFieldError(passwordFieldErrors, 'current_password'))}
              helperText={getFieldError(passwordFieldErrors, 'current_password')}
              autoComplete="current-password"
              fullWidth
            />

            <TextField
              label="Password Baru"
              type="password"
              value={passwordForm.newPassword}
              onChange={(event) => handlePasswordFieldChange('newPassword', event.target.value)}
              error={Boolean(getFieldError(passwordFieldErrors, 'password'))}
              helperText={getFieldError(passwordFieldErrors, 'password') || 'Minimal 8 karakter.'}
              autoComplete="new-password"
              fullWidth
            />

            <TextField
              label="Konfirmasi Password Baru"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(event) => handlePasswordFieldChange('confirmPassword', event.target.value)}
              error={Boolean(getFieldError(passwordFieldErrors, 'password_confirmation'))}
              helperText={getFieldError(passwordFieldErrors, 'password_confirmation')}
              autoComplete="new-password"
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={closePasswordDialog} disabled={isPasswordSubmitting}>
            Batal
          </Button>
          <Button variant="contained" onClick={handlePasswordSubmit} disabled={isPasswordSubmitting}>
            Simpan Password
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
