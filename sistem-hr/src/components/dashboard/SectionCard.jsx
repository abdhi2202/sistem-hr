import { Divider, Paper, Stack, Typography } from '@mui/material';

export default function SectionCard({ title, subtitle, children, action }) {
  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
        <Stack spacing={0.5}>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        </Stack>
        {action}
      </Stack>
      <Divider sx={{ my: 2.5 }} />
      {children}
    </Paper>
  );
}
