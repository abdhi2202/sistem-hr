import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import {
  Alert,
  AppBar,
  Box,
  Button,
  Collapse,
  Divider,
  Drawer,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { menuByRole } from '../../data/dashboardData';
import { useHrData } from '../../context/HrDataContext';
import { useRole } from '../../context/RoleContext';
import { subscribeForbiddenEvent } from '../../services/api/events';
import { getRoleLabel } from '../../utils/dashboardContent';

const drawerWidth = 264;
const collapsedDrawerWidth = 92;
const pageMeta = {
  '/dashboard': {
    eyebrow: 'Dashboard',
    title: 'Ringkasan Sistem HR',
  },
  '/karyawan': {
    eyebrow: 'Karyawan',
    title: 'Manajemen Data Karyawan',
  },
  '/master': {
    eyebrow: 'Master Data',
    title: 'Referensi Jabatan & Departemen',
  },
  '/absensi': {
    eyebrow: 'Absensi',
    title: 'Pemantauan Kehadiran',
  },
  '/cuti': {
    eyebrow: 'Cuti',
    title: 'Pengajuan dan Persetujuan Cuti',
  },
  '/profil': {
    eyebrow: 'Profil',
    title: 'Informasi Pengguna',
  },
};

function SidebarContent({ currentPath, onNavigate, onClose, isMobile, isCollapsed, dataSourceMode }) {
  const { role, name } = useRole();
  const menuItems = menuByRole[role];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        px: isCollapsed ? 1.25 : 2,
        py: 3,
        bgcolor: '#0f1c2f',
        color: '#f5f8ff',
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
        <Box>
          <Typography variant="overline" sx={{ opacity: 0.72, letterSpacing: '0.12em' }}>
            {isCollapsed ? 'HR' : 'Sistem HR'}
          </Typography>
          {!isCollapsed ? (
            <>
              <Typography variant="h5" sx={{ mb: 0.5 }}>
                Panel Kerja
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.68 }}>
                {name || 'Pengguna aktif'} | {getRoleLabel(role)}
              </Typography>
            </>
          ) : null}
        </Box>
        {isMobile ? (
          <IconButton onClick={onClose} sx={{ color: '#f5f8ff', mt: -0.5, mr: -1 }}>
            <CloseRoundedIcon />
          </IconButton>
        ) : null}
      </Stack>
      <List sx={{ display: 'grid', gap: 1, mt: 2 }}>
        {menuItems.map((item) => {
          const isActive =
            currentPath === item.path ||
            (item.path !== '/dashboard' && currentPath.startsWith(`${item.path}/`));
          const ItemIcon = item.icon;
          return (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                onClick={() => onNavigate(item.path)}
                sx={{
                  borderRadius: 3,
                  px: isCollapsed ? 1 : 1.5,
                  py: 1.25,
                  border: '1px solid',
                  borderColor: isActive ? 'rgba(118, 168, 255, 0.42)' : 'transparent',
                  bgcolor: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                  boxShadow: isActive ? 'inset 0 0 0 1px rgba(255,255,255,0.04)' : 'none',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.08)',
                    borderColor: 'rgba(255,255,255,0.12)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: isCollapsed ? 'auto' : 40,
                    mr: isCollapsed ? 0 : 0.5,
                    color: isActive ? '#ffffff' : 'rgba(245,248,255,0.76)',
                  }}
                >
                  <ItemIcon fontSize="small" />
                </ListItemIcon>
                {!isCollapsed ? (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 700 : 500,
                    }}
                  />
                ) : null}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Box sx={{ mt: 'auto', pt: 3 }}>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', mb: 2 }} />
        {!isCollapsed ? (
          <Stack spacing={0.4}>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Copyright Muhammad Abdhi Priyatama 2026
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.64 }}>
              Seluruh hak cipta dilindungi.
            </Typography>
          </Stack>
        ) : (
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            2026
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [pendingMobilePath, setPendingMobilePath] = useState('');
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const location = useLocation();
  const navigate = useNavigate();
  const { dataSourceMode, hydrationError, refreshSnapshot } = useHrData();
  const { role, setRole, logout, name, canPreviewRole } = useRole();
  const currentPage = pageMeta[location.pathname] ?? pageMeta['/dashboard'];

  useEffect(() => {
    return subscribeForbiddenEvent(() => {
      if (dataSourceMode === 'http') {
        navigate('/403', { replace: true });
      }
    });
  }, [dataSourceMode, navigate]);

  useEffect(() => {
    if (!isDesktop) {
      setMobileOpen(false);
      return;
    }
    setDesktopSidebarOpen(true);
  }, [isDesktop]);

  useLayoutEffect(() => {
    if (!isDesktop) {
      setMobileOpen(false);
    }
  }, [isDesktop, location.pathname]);

  async function handleLogout() {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
    navigate('/login', { replace: true });
  }

  function handleSidebarToggle() {
    if (isDesktop) {
      setDesktopSidebarOpen((current) => !current);
      return;
    }
    setMobileOpen((current) => !current);
  }

  const closeSidebar = () => setMobileOpen(false);

  function handleSidebarNavigate(path) {
    if (!isDesktop) {
      setPendingMobilePath(path !== location.pathname ? path : '');
      setMobileOpen(false);
      return;
    }

    if (path !== location.pathname) {
      navigate(path);
    }
  }

  function handleMobileDrawerExited() {
    if (pendingMobilePath) {
      navigate(pendingMobilePath);
      setPendingMobilePath('');
    }
  }

  const drawer = (
    <SidebarContent
      currentPath={location.pathname}
      onNavigate={handleSidebarNavigate}
      onClose={closeSidebar}
      isMobile={!isDesktop}
      isCollapsed={isDesktop && !desktopSidebarOpen}
      dataSourceMode={dataSourceMode}
    />
  );
  const desktopDrawerSize = desktopSidebarOpen ? drawerWidth : collapsedDrawerWidth;

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      {isDesktop ? (
        <Box
          sx={{
            width: desktopDrawerSize,
            flexShrink: 0,
            transition: theme.transitions.create('width', {
              duration: theme.transitions.duration.shorter,
            }),
          }}
        >
          <Drawer
            variant="permanent"
            open
            sx={{
              width: desktopDrawerSize,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: desktopDrawerSize,
                border: 'none',
                boxShadow: 'none',
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                  duration: theme.transitions.duration.shorter,
                }),
              },
            }}
          >
            {drawer}
          </Drawer>
        </Box>
      ) : (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          transitionDuration={{ enter: 180, exit: 0 }}
          ModalProps={{
            keepMounted: false,
            onTransitionExited: handleMobileDrawerExited,
          }}
          PaperProps={{
            sx: {
              width: drawerWidth,
              border: 'none',
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      <Box
        sx={{
          flexGrow: 1,
          minWidth: 0,
          height: '100vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <AppBar
          position="sticky"
          color="transparent"
          elevation={0}
          sx={{
            top: 0,
            zIndex: (themeValue) => themeValue.zIndex.appBar,
            backdropFilter: 'blur(12px)',
            bgcolor: 'rgba(244, 247, 251, 0.86)',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Toolbar
            sx={{
              gap: 2,
              minHeight: { xs: 'auto', md: 80 },
              py: 1.5,
              alignItems: { xs: 'stretch', md: 'center' },
              flexDirection: { xs: 'column', md: 'row' },
            }}
          >
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{ width: '100%', minWidth: 0 }}
            >
              <IconButton onClick={handleSidebarToggle} edge="start" color="primary">
                <MenuRoundedIcon />
              </IconButton>
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.25 }}>
                  {currentPage.eyebrow}
                </Typography>
                <Typography variant="h6" sx={{ lineHeight: 1.25 }}>
                  {currentPage.title}
                </Typography>
              </Box>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ display: { xs: 'none', md: 'flex' }, flexShrink: 0 }}
              >
                <Paper
                  variant="outlined"
                  sx={{
                    px: 2,
                    py: 1.25,
                    borderRadius: '20px',
                    minWidth: 182,
                    boxShadow: '0 10px 24px rgba(21, 52, 102, 0.05)',
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Role aktif
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {getRoleLabel(role)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {name || 'Pengguna aktif'}
                  </Typography>
                </Paper>
                {canPreviewRole ? (
                  <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel id="role-select-label">Mode Preview</InputLabel>
                    <Select
                      labelId="role-select-label"
                      value={role}
                      label="Mode Preview"
                      onChange={(event) => setRole(event.target.value)}
                    >
                      <MenuItem value="admin_hr">Admin HR</MenuItem>
                      <MenuItem value="karyawan">Karyawan</MenuItem>
                    </Select>
                  </FormControl>
                ) : null}
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  sx={{ minWidth: 106, borderRadius: '18px' }}
                >
                  Keluar
                </Button>
              </Stack>
            </Stack>
            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              alignItems="stretch"
              sx={{ width: { xs: '100%', md: 'auto' }, display: { xs: 'flex', md: 'none' } }}
            >
              <Paper
                variant="outlined"
                sx={{
                  px: 1.5,
                  py: 1,
                  borderRadius: '20px',
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {name || 'Pengguna'}
                </Typography>
                <Typography variant="subtitle2">{getRoleLabel(role)}</Typography>
              </Paper>
              {canPreviewRole ? (
                <FormControl size="small" sx={{ flex: 1 }}>
                  <InputLabel id="role-select-label">Mode Preview</InputLabel>
                  <Select
                    labelId="role-select-label"
                    value={role}
                    label="Mode Preview"
                    onChange={(event) => setRole(event.target.value)}
                  >
                    <MenuItem value="admin_hr">Admin HR</MenuItem>
                    <MenuItem value="karyawan">Karyawan</MenuItem>
                  </Select>
                </FormControl>
              ) : null}
              <Button
                variant="outlined"
                color="primary"
                onClick={handleLogout}
                disabled={isLoggingOut}
                sx={{ minWidth: 108, borderRadius: '20px', flexShrink: 0 }}
              >
                Keluar
              </Button>
            </Stack>
          </Toolbar>
        </AppBar>

        <Collapse in={dataSourceMode === 'http' && Boolean(hydrationError)}>
          <Box sx={{ px: { xs: 2, md: 3.5 }, pt: 2 }}>
            <Alert
              severity="error"
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => {
                    refreshSnapshot();
                  }}
                >
                  Coba lagi
                </Button>
              }
              sx={{
                alignItems: 'center',
                borderRadius: 3,
              }}
            >
              Koneksi API sedang bermasalah. {hydrationError}
            </Alert>
          </Box>
        </Collapse>

        <Box sx={{ p: { xs: 2, md: 3.5 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
