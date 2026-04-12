import BlockRoundedIcon from '@mui/icons-material/BlockRounded';
import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { getRoleLabel } from '../utils/dashboardContent';

export default function ForbiddenPage() {
  const { role } = useRole();

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 180px)',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <Paper sx={{ p: 4, maxWidth: 620, textAlign: 'center' }}>
        <Stack spacing={2.5} alignItems="center">
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              bgcolor: 'rgba(237, 138, 24, 0.14)',
              color: '#c26a00',
            }}
          >
            <BlockRoundedIcon />
          </Box>
          <Chip
            label={`Role aktif: ${getRoleLabel(role)}`}
            sx={{ bgcolor: '#eef3fb', color: 'text.secondary' }}
          />
          <Typography variant="h4">403 Forbidden</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 520 }}>
            Backend menolak akses ke resource ini. Periksa hak akses role, policy API, atau login
            ulang dengan akun yang memiliki izin yang sesuai.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button component={RouterLink} to="/dashboard" variant="contained">
              Kembali ke Dashboard
            </Button>
            <Button component={RouterLink} to="/login" variant="outlined">
              Kembali ke Login
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
