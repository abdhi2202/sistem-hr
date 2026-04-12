import { Chip, List, ListItem, Stack, Typography } from '@mui/material';
import { useRole } from '../../context/RoleContext';

function getChipStyle(value) {
  if (value === 'Tinggi' || value === 'Pending') {
    return { bgcolor: 'rgba(237, 138, 24, 0.14)', color: '#c26a00' };
  }

  if (value === 'Disetujui') {
    return { bgcolor: 'rgba(31, 157, 116, 0.12)', color: 'secondary.main' };
  }

  return { bgcolor: '#eef3fb', color: 'text.secondary' };
}

export default function LeaveSummary({ items }) {
  const { role } = useRole();

  return (
    <List disablePadding sx={{ display: 'grid', gap: 1.5 }}>
      {items.map((item, index) => {
        if (role === 'admin_hr') {
          return (
            <ListItem
              key={`${item.name}-${index}`}
              disablePadding
              sx={{
                px: 2,
                py: 1.75,
                borderRadius: '20px',
                bgcolor: '#f7f9fd',
                display: 'block',
              }}
            >
              <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ mb: 0.75 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {item.name}
                </Typography>
                <Chip label={item.urgency} size="small" sx={getChipStyle(item.urgency)} />
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {item.period}
              </Typography>
              <Typography variant="body2">{item.reason}</Typography>
            </ListItem>
          );
        }

        return (
          <ListItem
            key={`${item.period}-${index}`}
            disablePadding
            sx={{
              px: 2,
              py: 1.75,
              borderRadius: '20px',
              bgcolor: '#f7f9fd',
              display: 'block',
            }}
          >
            <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ mb: 0.75 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {item.period}
              </Typography>
              <Chip label={item.status} size="small" sx={getChipStyle(item.status)} />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {item.reason}
            </Typography>
          </ListItem>
        );
      })}
    </List>
  );
}
