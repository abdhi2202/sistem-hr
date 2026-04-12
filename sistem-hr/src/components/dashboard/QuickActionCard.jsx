import ArrowOutwardOutlinedIcon from '@mui/icons-material/ArrowOutwardOutlined';
import { Button, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function QuickActionCard({ title, description, cta, to }) {
  const navigate = useNavigate();

  function handleNavigate() {
    if (to) {
      navigate(to);
    }
  }

  return (
    <Paper
      onClick={handleNavigate}
      sx={{
        p: 3,
        height: '100%',
        background:
          'linear-gradient(135deg, rgba(31, 94, 255, 0.08), rgba(31, 157, 116, 0.08))',
        cursor: to ? 'pointer' : 'default',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        '&:hover': to
          ? {
              transform: 'translateY(-2px)',
              boxShadow: '0 14px 36px rgba(24, 61, 124, 0.12)',
            }
          : undefined,
      }}
    >
      <Stack spacing={2.5} height="100%" justifyContent="space-between">
        <Stack spacing={1}>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Stack>
        <Button
          variant="contained"
          color="primary"
          endIcon={<ArrowOutwardOutlinedIcon />}
          sx={{ alignSelf: 'flex-start' }}
          onClick={(event) => {
            event.stopPropagation();
            handleNavigate();
          }}
        >
          {cta}
        </Button>
      </Stack>
    </Paper>
  );
}
