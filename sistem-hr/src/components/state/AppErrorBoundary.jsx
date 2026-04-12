import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import React from 'react';

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('Aplikasi mengalami error render.', error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'grid',
            placeItems: 'center',
            px: 2,
            bgcolor: 'background.default',
          }}
        >
          <Paper sx={{ p: 4, width: '100%', maxWidth: 560, textAlign: 'center' }}>
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
                <ReportProblemRoundedIcon />
              </Box>
              <Typography variant="h5">Halaman tidak berhasil dimuat</Typography>
              <Typography variant="body2" color="text.secondary">
                {this.state.error?.message || 'Terjadi error saat menampilkan halaman ini.'}
              </Typography>
              <Button variant="contained" onClick={this.handleReload}>
                Muat Ulang
              </Button>
            </Stack>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}
