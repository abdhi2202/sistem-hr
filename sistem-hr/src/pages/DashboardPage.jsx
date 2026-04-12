import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import { Box, Grid2 as Grid, Paper, Stack, Typography } from '@mui/material';
import AttendanceSummary from '../components/dashboard/AttendanceSummary';
import LeaveSummary from '../components/dashboard/LeaveSummary';
import QuickActionCard from '../components/dashboard/QuickActionCard';
import SectionCard from '../components/dashboard/SectionCard';
import StatCard from '../components/dashboard/StatCard';
import PageDataShell from '../components/state/PageDataShell';
import { useHrData } from '../context/HrDataContext';
import { useRole } from '../context/RoleContext';
import { getDashboardContentByRole, getRoleLabel } from '../utils/dashboardContent';

function getFormattedDate() {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());
}

export default function DashboardPage() {
  const { role } = useRole();
  const hrData = useHrData();
  const content = getDashboardContentByRole(role, hrData);

  return (
    <PageDataShell title="dashboard">
      <Stack spacing={3}>
        <Paper
          sx={{
            px: { xs: 2.5, md: 3 },
            py: { xs: 2.5, md: 3 },
            borderRadius: '20px',
            border: '1px solid',
            borderColor: 'divider',
            background:
              'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(247,250,255,1) 100%)',
          }}
        >
          <Stack spacing={2}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              justifyContent="space-between"
              spacing={2}
              alignItems={{ xs: 'flex-start', md: 'center' }}
            >
              <Box>
                <Typography variant="overline" color="primary.main" sx={{ letterSpacing: '0.14em' }}>
                  {getRoleLabel(role)}
                </Typography>
                <Typography variant="h5" sx={{ mt: 0.5, mb: 0.75 }}>
                  Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 680 }}>
                  {content.greeting}
                </Typography>
              </Box>
              <Paper
                variant="outlined"
                sx={{
                  px: 1.75,
                  py: 1.1,
                  borderRadius: '20px',
                  bgcolor: 'background.paper',
                  minWidth: { xs: '100%', sm: 'auto' },
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <CalendarMonthRoundedIcon color="action" fontSize="small" />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {getFormattedDate()}
                  </Typography>
                </Stack>
              </Paper>
            </Stack>
          </Stack>
        </Paper>

        <Grid container spacing={2.5}>
          {content.stats.map((stat) => (
            <Grid key={stat.label} size={{ xs: 12, sm: 6, xl: 3 }}>
              <StatCard {...stat} />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, xl: 7 }}>
            <SectionCard
              title={content.attendanceSummary.title}
              subtitle={content.attendanceSummary.subtitle}
            >
              <AttendanceSummary items={content.attendanceSummary.items} />
            </SectionCard>
          </Grid>

          <Grid size={{ xs: 12, xl: 5 }}>
            <SectionCard
              title={content.leaveSummary.title}
              subtitle={content.leaveSummary.subtitle}
            >
              <LeaveSummary items={content.leaveSummary.items} />
            </SectionCard>
          </Grid>
        </Grid>

        <Box>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Aksi Cepat
          </Typography>
          <Grid container spacing={2.5}>
            {content.quickActions.map((action) => (
              <Grid key={action.title} size={{ xs: 12, md: 6 }}>
                <QuickActionCard {...action} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Stack>
    </PageDataShell>
  );
}
