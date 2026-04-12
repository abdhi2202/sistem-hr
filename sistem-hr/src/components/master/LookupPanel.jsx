import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

export default function LookupPanel({
  title,
  description,
  itemLabel,
  items,
  emptyMessage,
  isSubmitting,
  onSave,
  onDelete,
  errorMessage = '',
  fieldError = '',
  onClearError,
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [draftName, setDraftName] = useState('');

  function handleOpenCreate() {
    onClearError?.();
    setEditingItem(null);
    setDraftName('');
    setDialogOpen(true);
  }

  function handleOpenEdit(item) {
    onClearError?.();
    setEditingItem(item);
    setDraftName(item.nama);
    setDialogOpen(true);
  }

  function handleSave() {
    onSave({
      id: editingItem?.id ?? null,
      nama: draftName.trim(),
      penggunaan: editingItem?.penggunaan ?? 0,
    });
    setDialogOpen(false);
    setEditingItem(null);
    setDraftName('');
  }

  function handleAskDelete(item) {
    setEditingItem(item);
    setDeleteOpen(true);
  }

  function handleConfirmDelete() {
    onDelete(editingItem.id);
    setDeleteOpen(false);
    setEditingItem(null);
  }

  return (
    <>
      <Paper sx={{ p: 3, height: '100%' }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: 2.5 }}
        >
          <Box>
            <Typography variant="h6">{title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={handleOpenCreate}
            disabled={isSubmitting}
          >
            Tambah {itemLabel}
          </Button>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <List disablePadding sx={{ display: 'grid', gap: 1.5 }}>
          {items.map((item) => (
            <ListItem
              key={item.id}
              disablePadding
              sx={{
                px: 2,
                py: 1.75,
                borderRadius: '20px',
                bgcolor: '#f7f9fd',
                display: 'block',
              }}
            >
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                spacing={2}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
              >
                <ListItemText
                  primary={item.nama}
                  secondary={`${item.penggunaan} karyawan terkait`}
                  primaryTypographyProps={{ fontWeight: 600 }}
                  secondaryTypographyProps={{ color: 'text.secondary' }}
                />
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    label={`${item.penggunaan} dipakai`}
                    size="small"
                    sx={{ bgcolor: '#eef3fb', color: 'text.secondary' }}
                  />
                  <Button
                    variant="text"
                    startIcon={<EditOutlinedIcon />}
                    onClick={() => handleOpenEdit(item)}
                    disabled={isSubmitting}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="text"
                    color="error"
                    startIcon={<DeleteOutlineRoundedIcon />}
                    onClick={() => handleAskDelete(item)}
                    disabled={isSubmitting}
                  >
                    Hapus
                  </Button>
                </Stack>
              </Stack>
            </ListItem>
          ))}

          {items.length === 0 ? (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                {emptyMessage}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tambahkan data baru untuk mulai mengisi master referensi HR.
              </Typography>
            </Box>
          ) : null}
        </List>
      </Paper>

      <Dialog
        open={dialogOpen}
        onClose={() => {
          if (isSubmitting) {
            return;
          }
          setDialogOpen(false);
          setEditingItem(null);
          setDraftName('');
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{editingItem ? `Edit ${itemLabel}` : `Tambah ${itemLabel}`}</DialogTitle>
        <DialogContent dividers>
          <TextField
            label={`Nama ${itemLabel}`}
            value={draftName}
            onChange={(event) => {
              setDraftName(event.target.value);
              onClearError?.();
            }}
            fullWidth
            autoFocus
            error={Boolean(fieldError)}
            helperText={fieldError || ' '}
          />
          {errorMessage ? <Alert severity="error" sx={{ mt: 2 }}>{errorMessage}</Alert> : null}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => {
              if (isSubmitting) {
                return;
              }
              setDialogOpen(false);
              setEditingItem(null);
              setDraftName('');
            }}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={!draftName.trim() || isSubmitting}>
            Simpan
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteOpen}
        onClose={() => {
          if (isSubmitting) {
            return;
          }
          setDeleteOpen(false);
          setEditingItem(null);
        }}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Hapus {itemLabel}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1">
            Data <strong>{editingItem?.nama ?? '-'}</strong> akan dihapus dari master mock ini.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => {
              if (isSubmitting) {
                return;
              }
              setDeleteOpen(false);
              setEditingItem(null);
            }}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button variant="contained" color="error" onClick={handleConfirmDelete} disabled={isSubmitting}>
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
