import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function AccessDeniedState({
  title = 'Akses Dibatasi',
  description = 'Anda tidak memiliki izin untuk membuka halaman ini.',
}) {
  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 180px)',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <Paper sx={{ p: 4, maxWidth: 560, textAlign: 'center' }}>
        <Stack spacing={2} alignItems="center">
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              bgcolor: 'rgba(237, 138, 24, 0.14)',
              color: '#c26a00',
            }}
          >
            <LockOutlinedIcon />
          </Box>
          <Typography variant="h5">{title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
          <Button component={RouterLink} to="/dashboard" variant="contained">
            Kembali ke Dashboard
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
