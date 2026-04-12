import { Box, Chip, Paper, Stack, Typography } from '@mui/material';

const accentMap = {
  primary: {
    background: 'rgba(31, 94, 255, 0.12)',
    color: 'primary.main',
  },
  secondary: {
    background: 'rgba(31, 157, 116, 0.12)',
    color: 'secondary.main',
  },
  warning: {
    background: 'rgba(237, 138, 24, 0.14)',
    color: '#c26a00',
  },
  info: {
    background: 'rgba(0, 120, 212, 0.12)',
    color: '#0a6abf',
  },
};

export default function StatCard({ label, value, helper, icon: Icon, accent = 'primary' }) {
  const tones = accentMap[accent] ?? accentMap.primary;

  return (
    <Paper sx={{ p: 3 }}>
      <Stack direction="row" spacing={2} alignItems="flex-start" justifyContent="space-between">
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.75 }}>
            {label}
          </Typography>
          <Typography variant="h5" sx={{ mb: 1 }}>
            {value}
          </Typography>
          <Chip
            label={helper}
            size="small"
            sx={{
              bgcolor: '#eef3fb',
              color: 'text.secondary',
              fontWeight: 500,
              maxWidth: '100%',
              '& .MuiChip-label': {
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              },
            }}
          />
        </Box>
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: 4,
            display: 'grid',
            placeItems: 'center',
            bgcolor: tones.background,
            color: tones.color,
            flexShrink: 0,
          }}
        >
          <Icon />
        </Box>
      </Stack>
    </Paper>
  );
}
