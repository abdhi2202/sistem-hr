import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded';
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { demoAccounts } from '../services/mockAuthApi';
import { getApiErrorMessage, getApiFieldErrors, getFieldError } from '../utils/apiFeedback';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login, authMode, authNotice, clearAuthNotice } = useRole();
  const [form, setForm] = useState({
    email: demoAccounts.admin_hr.email,
    password: demoAccounts.admin_hr.password,
    role: 'admin_hr',
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextPath = useMemo(() => location.state?.from?.pathname ?? '/dashboard', [location.state]);

  if (isAuthenticated) {
    return <Navigate to={nextPath} replace />;
  }

  function applyDemo(role) {
    setForm({
      email: demoAccounts[role].email,
      password: demoAccounts[role].password,
      role,
    });
    setError('');
    setFieldErrors({});
  }

  function handleChange(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setFieldErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextFieldErrors = {};

    if (!form.email || !form.password) {
      if (!form.email) {
        nextFieldErrors.email = ['Email wajib diisi.'];
      }
      if (!form.password) {
        nextFieldErrors.password = ['Password wajib diisi.'];
      }
      setFieldErrors(nextFieldErrors);
      setError('Email dan password wajib diisi.');
      return;
    }

    if (form.password.length < 6) {
      setFieldErrors({
        password: ['Password minimal 6 karakter.'],
      });
      setError('Password minimal 6 karakter.');
      return;
    }

    setError('');
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      await login({
        role: form.role,
        email: form.email,
        password: form.password,
      });
      navigate(nextPath, { replace: true });
    } catch (loginError) {
      setFieldErrors(getApiFieldErrors(loginError));
      setError(getApiErrorMessage(loginError, 'Login gagal diproses.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 2, md: 4 },
        background:
          'radial-gradient(circle at top left, rgba(31, 94, 255, 0.18), transparent 35%), linear-gradient(180deg, #eef3fb 0%, #f7f9fd 100%)',
      }}
    >
      <Container maxWidth="lg">
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 2, md: 3 }} alignItems="stretch">
          <Paper
            sx={{
              flex: 1.05,
              p: { xs: 2.5, sm: 3, md: 4 },
              color: '#ffffff',
              background:
                'linear-gradient(145deg, rgba(15, 28, 47, 1), rgba(31, 94, 255, 0.92) 62%, rgba(31, 157, 116, 0.82))',
              position: 'relative',
              overflow: 'hidden',
              minHeight: { xs: 'auto', md: 540 },
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                right: -40,
                top: -30,
                width: 180,
                height: 180,
                borderRadius: '50%',
                bgcolor: 'rgba(255,255,255,0.08)',
              }}
            />
            <Stack spacing={3} sx={{ position: 'relative' }}>
              <Chip
                icon={<BadgeOutlinedIcon />}
                label="Sistem HR Perusahaan"
                sx={{
                  alignSelf: 'flex-start',
                  bgcolor: 'rgba(255,255,255,0.12)',
                  color: '#ffffff',
                }}
              />
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    mb: 1,
                    fontSize: { xs: '2.6rem', sm: '3rem', md: '3.6rem' },
                    lineHeight: { xs: 1.08, md: 1.02 },
                    maxWidth: 520,
                  }}
                >
                  Selamat datang kembali
                </Typography>
              </Box>
              {authMode === 'mock' ? (
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
                  <Chip
                    label="Admin HR"
                    sx={{ bgcolor: 'rgba(255,255,255,0.14)', color: '#ffffff' }}
                  />
                  <Chip
                    label="Karyawan"
                    sx={{ bgcolor: 'rgba(255,255,255,0.14)', color: '#ffffff' }}
                  />
                </Stack>
              ) : null}
            </Stack>
          </Paper>

          <Paper sx={{ flex: 0.95, p: { xs: 2.5, sm: 3, md: 4 } }}>
            <Stack spacing={3} component="form" onSubmit={handleSubmit}>
              <Box>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  Masuk
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {authMode === 'mock'
                    ? 'Gunakan akun demo sesuai role.'
                    : 'Masukkan email dan password akun Anda.'}
                </Typography>
              </Box>

              {authNotice ? (
                <Alert severity="warning" onClose={clearAuthNotice}>
                  {authNotice}
                </Alert>
              ) : null}
              {error ? <Alert severity="error">{error}</Alert> : null}

              {authMode === 'mock' ? (
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
                  <Button
                    variant={form.role === 'admin_hr' ? 'contained' : 'outlined'}
                    onClick={() => applyDemo('admin_hr')}
                  >
                    {demoAccounts.admin_hr.label}
                  </Button>
                  <Button
                    variant={form.role === 'karyawan' ? 'contained' : 'outlined'}
                    onClick={() => applyDemo('karyawan')}
                  >
                    {demoAccounts.karyawan.label}
                  </Button>
                </Stack>
              ) : null}

              <TextField
                label="Email"
                type="email"
                value={form.email}
                onChange={(event) => handleChange('email', event.target.value)}
                fullWidth
                error={Boolean(getFieldError(fieldErrors, 'email'))}
                helperText={getFieldError(fieldErrors, 'email') || ' '}
              />

              <TextField
                label="Password"
                type="password"
                value={form.password}
                onChange={(event) => handleChange('password', event.target.value)}
                fullWidth
                error={Boolean(getFieldError(fieldErrors, 'password'))}
                helperText={getFieldError(fieldErrors, 'password') || ' '}
              />

              {authMode === 'mock' ? (
                <>
                  <FormControl fullWidth>
                    <InputLabel id="login-role-label">Masuk sebagai</InputLabel>
                    <Select
                      labelId="login-role-label"
                      label="Masuk sebagai"
                      value={form.role}
                      onChange={(event) => applyDemo(event.target.value)}
                    >
                      <MenuItem value="admin_hr">Admin HR</MenuItem>
                      <MenuItem value="karyawan">Karyawan</MenuItem>
                    </Select>
                  </FormControl>

                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: 4,
                      bgcolor: '#f7f9fd',
                      borderColor: 'divider',
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Kredensial demo
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Email akan terisi otomatis sesuai role. Password demo: `password123`
                    </Typography>
                  </Paper>
                </>
              ) : (
                <Paper
                  variant="outlined"
                  sx={{
                    p: { xs: 1.75, sm: 2.25 },
                    borderRadius: '20px',
                    bgcolor: 'transparent',
                    borderColor: 'rgba(80, 118, 201, 0.16)',
                    background:
                      'linear-gradient(180deg, rgba(246, 249, 255, 0.98) 0%, rgba(237, 243, 255, 0.92) 100%)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7)',
                  }}
                >
                  <Stack spacing={1.25}>
                    <Typography variant="subtitle2">Kredensial backend demo</Typography>
                    <Stack spacing={1}>
                      <Box
                        sx={{
                          p: { xs: 1.25, sm: 1.5 },
                          borderRadius: '18px',
                          bgcolor: 'rgba(255,255,255,0.72)',
                          border: '1px solid rgba(80, 118, 201, 0.14)',
                        }}
                      >
                        <Typography variant="caption" color="text.secondary" display="block">
                          Admin HR
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: 'break-word' }}>
                          admin@ssms.test / password
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          p: { xs: 1.25, sm: 1.5 },
                          borderRadius: '18px',
                          bgcolor: 'rgba(255,255,255,0.72)',
                          border: '1px solid rgba(80, 118, 201, 0.14)',
                        }}
                      >
                        <Typography variant="caption" color="text.secondary" display="block">
                          Karyawan
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: 'break-word' }}>
                          rina.paramita@ssms.test / password
                        </Typography>
                      </Box>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      Role mengikuti hasil autentikasi backend.
                    </Typography>
                  </Stack>
                </Paper>
              )}

              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<LockOpenRoundedIcon />}
                disabled={isSubmitting}
              >
                Masuk ke Dashboard
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
