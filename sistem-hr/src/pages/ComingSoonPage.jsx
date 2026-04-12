import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function ComingSoonPage() {
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
              bgcolor: 'rgba(31, 94, 255, 0.12)',
              color: 'primary.main',
            }}
          >
            <ConstructionRoundedIcon />
          </Box>
          <Typography variant="h5">Halaman Sedang Disiapkan</Typography>
          <Typography variant="body1" color="text.secondary">
            Modul ini belum dibuat pada tahap sekarang. Dashboard dan login sudah siap untuk
            direview lebih dulu.
          </Typography>
          <Button component={RouterLink} to="/dashboard" variant="contained">
            Kembali ke Dashboard
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
