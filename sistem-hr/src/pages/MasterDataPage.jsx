import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import BusinessCenterRoundedIcon from '@mui/icons-material/BusinessCenterRounded';
import { Alert, Box, Chip, Grid2 as Grid, Paper, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import LookupPanel from '../components/master/LookupPanel';
import AccessDeniedState from '../components/state/AccessDeniedState';
import PageDataShell from '../components/state/PageDataShell';
import { useHrData } from '../context/HrDataContext';
import { useRole } from '../context/RoleContext';
import { getApiErrorMessage, getApiFieldErrors, getFieldError } from '../utils/apiFeedback';

export default function MasterDataPage() {
  const { role } = useRole();
  const {
    departments,
    positions,
    saveDepartment,
    deleteDepartment,
    savePosition,
    deletePosition,
  } = useHrData();
  const [message, setMessage] = useState({ type: 'success', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lookupErrors, setLookupErrors] = useState({
    departemen: { message: '', field: '' },
    jabatan: { message: '', field: '' },
  });

  if (role !== 'admin_hr') {
    return <AccessDeniedState description="Modul master data hanya tersedia untuk Admin HR." />;
  }

  function saveLookup(handler, label) {
    return async (item) => {
      const key = label.toLowerCase();

      if (!item.nama) {
        setLookupErrors((current) => ({
          ...current,
          [key]: {
            message: `Nama ${label.toLowerCase()} wajib diisi.`,
            field: `Nama ${label.toLowerCase()} wajib diisi.`,
          },
        }));
        return;
      }

      setIsSubmitting(true);
      setLookupErrors((current) => ({
        ...current,
        [key]: { message: '', field: '' },
      }));

      try {
        await handler(item);
        setMessage({ type: 'success', text: `${label} berhasil disimpan.` });
      } catch (error) {
        const apiFieldErrors = getApiFieldErrors(error);
        setLookupErrors((current) => ({
          ...current,
          [key]: {
            message: getApiErrorMessage(error, `${label} gagal disimpan.`),
            field: getFieldError(apiFieldErrors, `nama_${key}`, 'nama') || '',
          },
        }));
      } finally {
        setIsSubmitting(false);
      }
    };
  }

  function deleteLookup(handler, label) {
    return async (id) => {
      setIsSubmitting(true);

      try {
        await handler(id);
        setMessage({ type: 'success', text: `${label} berhasil dihapus.` });
      } catch (error) {
        setMessage({
          type: 'error',
          text: getApiErrorMessage(error, `${label} gagal dihapus.`),
        });
      } finally {
        setIsSubmitting(false);
      }
    };
  }

  return (
    <PageDataShell title="master data">
      <Stack spacing={3}>
      <Box
        sx={{
          px: { xs: 2.5, md: 3.5 },
          py: { xs: 3, md: 3.5 },
          borderRadius: '20px',
          background:
            'linear-gradient(135deg, rgba(18, 32, 51, 1), rgba(25, 91, 193, 0.90) 54%, rgba(31, 157, 116, 0.70))',
          color: '#ffffff',
        }}
      >
        <Stack
          direction={{ xs: 'column', lg: 'row' }}
          justifyContent="space-between"
          spacing={2}
          alignItems={{ xs: 'flex-start', lg: 'center' }}
        >
          <Box>
            <Typography variant="overline" sx={{ opacity: 0.8, letterSpacing: '0.14em' }}>
              Admin HR
            </Typography>
            <Typography variant="h4" sx={{ mt: 0.5, mb: 1 }}>
              Master Data
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: 720, opacity: 0.9 }}>
              Kelola referensi departemen dan jabatan agar modul karyawan, absensi, dan cuti tetap
              konsisten.
            </Typography>
          </Box>
          <Chip
            icon={<AccountTreeRoundedIcon />}
            label="Lookup HR"
            sx={{
              bgcolor: 'rgba(255,255,255,0.12)',
              color: '#ffffff',
              '& .MuiChip-icon': {
                color: '#ffffff',
              },
            }}
          />
        </Stack>
      </Box>

      {message.text ? <Alert severity={message.type}>{message.text}</Alert> : null}

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" spacing={2}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Departemen
                </Typography>
                <Typography variant="h5" sx={{ mt: 0.5 }}>
                  {departments.length}
                </Typography>
              </Box>
              <Chip
                icon={<ApartmentRoundedIcon />}
                label="Organisasi"
                sx={{ bgcolor: 'rgba(31, 94, 255, 0.12)', color: 'primary.main' }}
              />
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" spacing={2}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Jabatan
                </Typography>
                <Typography variant="h5" sx={{ mt: 0.5 }}>
                  {positions.length}
                </Typography>
              </Box>
              <Chip
                icon={<BadgeRoundedIcon />}
                label="Struktur posisi"
                sx={{ bgcolor: 'rgba(31, 157, 116, 0.12)', color: 'secondary.main' }}
              />
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" spacing={2}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Referensi
                </Typography>
                <Typography variant="h5" sx={{ mt: 0.5 }}>
                  {departments.length + positions.length}
                </Typography>
              </Box>
              <Chip
                icon={<BusinessCenterRoundedIcon />}
                label="Siap dipakai"
                sx={{ bgcolor: '#eef3fb', color: 'text.secondary' }}
              />
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, xl: 6 }}>
          <LookupPanel
            title="Master Departemen"
            description="Tambahkan atau rapikan daftar departemen yang dipakai di seluruh sistem."
            itemLabel="Departemen"
            items={departments}
            emptyMessage="Belum ada departemen"
            onSave={saveLookup(saveDepartment, 'Departemen')}
            onDelete={deleteLookup(deleteDepartment, 'Departemen')}
            isSubmitting={isSubmitting}
            errorMessage={lookupErrors.departemen.message}
            fieldError={lookupErrors.departemen.field}
            onClearError={() =>
              setLookupErrors((current) => ({
                ...current,
                departemen: { message: '', field: '' },
              }))
            }
          />
        </Grid>
        <Grid size={{ xs: 12, xl: 6 }}>
          <LookupPanel
            title="Master Jabatan"
            description="Kelola jabatan untuk form karyawan dan struktur organisasi internal."
            itemLabel="Jabatan"
            items={positions}
            emptyMessage="Belum ada jabatan"
            onSave={saveLookup(savePosition, 'Jabatan')}
            onDelete={deleteLookup(deletePosition, 'Jabatan')}
            isSubmitting={isSubmitting}
            errorMessage={lookupErrors.jabatan.message}
            fieldError={lookupErrors.jabatan.field}
            onClearError={() =>
              setLookupErrors((current) => ({
                ...current,
                jabatan: { message: '', field: '' },
              }))
            }
          />
        </Grid>
      </Grid>
      </Stack>
    </PageDataShell>
  );
}
