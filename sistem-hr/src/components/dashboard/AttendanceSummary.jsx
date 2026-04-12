import {
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { useRole } from '../../context/RoleContext';

function getStatusTone(status) {
  if (status === 'Tepat waktu' || status === 'Hadir') {
    return { bgcolor: 'rgba(31, 157, 116, 0.12)', color: 'secondary.main' };
  }

  if (status === 'Sedikit terlambat') {
    return { bgcolor: 'rgba(237, 138, 24, 0.14)', color: '#c26a00' };
  }

  return { bgcolor: '#eef3fb', color: 'text.secondary' };
}

export default function AttendanceSummary({ items }) {
  const { role } = useRole();

  return (
    <List disablePadding sx={{ display: 'grid', gap: 1.5 }}>
      {items.map((item) => {
        if (role === 'admin_hr') {
          const initials = item.name
            .split(' ')
            .map((segment) => segment[0])
            .slice(0, 2)
            .join('');
          const tone = getStatusTone(item.status);

          return (
            <ListItem
              key={`${item.name}-${item.time}`}
              disablePadding
              sx={{
                px: 2,
                py: 1.5,
                borderRadius: '20px',
                bgcolor: '#f7f9fd',
                alignItems: 'center',
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'primary.main' }}>{initials}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={item.name}
                secondary={`${item.department} - Check-in ${item.time}`}
                primaryTypographyProps={{ fontWeight: 600 }}
                secondaryTypographyProps={{ color: 'text.secondary' }}
              />
              <Chip label={item.status} size="small" sx={tone} />
            </ListItem>
          );
        }

        return (
          <ListItem
            key={`${item.label}-${item.value}`}
            disablePadding
            sx={{
              px: 2,
              py: 1.75,
              borderRadius: '20px',
              bgcolor: '#f7f9fd',
              display: 'block',
            }}
          >
            <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ mb: 0.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {item.label}
              </Typography>
              <Typography variant="subtitle2" color="primary.main" sx={{ fontWeight: 700 }}>
                {item.value}
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {item.note}
            </Typography>
          </ListItem>
        );
      })}
    </List>
  );
}
