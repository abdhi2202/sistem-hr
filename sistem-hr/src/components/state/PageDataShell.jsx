import CloudOffRoundedIcon from '@mui/icons-material/CloudOffRounded';
import SyncRoundedIcon from '@mui/icons-material/SyncRounded';
import { Box, Button, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import { useHrData } from '../../context/HrDataContext';

function LoadingState({ title }) {
  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 180px)',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <Paper sx={{ p: 4, maxWidth: 420, textAlign: 'center' }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress color="primary" />
          <Typography variant="h6">Memuat {title}</Typography>
          <Typography variant="body2" color="text.secondary">
            Data sedang disiapkan dari sumber aktif. Mohon tunggu sebentar.
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}

function ErrorState({ title, message, onRetry }) {
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
            <CloudOffRoundedIcon />
          </Box>
          <Typography variant="h5">Gagal Memuat {title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {message}
          </Typography>
          <Button variant="contained" startIcon={<SyncRoundedIcon />} onClick={onRetry}>
            Coba Lagi
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

export default function PageDataShell({ title, children }) {
  const { isHydrated, hydrationError, dataSourceMode, refreshSnapshot } = useHrData();

  if (!isHydrated) {
    return <LoadingState title={title} />;
  }

  if (dataSourceMode === 'http' && hydrationError) {
    return (
      <ErrorState
        title={title}
        message={hydrationError}
        onRetry={() => {
          refreshSnapshot();
        }}
      />
    );
  }

  return children;
}
