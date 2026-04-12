import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

export default function DeleteEmployeeDialog({ open, employeeName, onClose, onConfirm, isSubmitting }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Hapus Karyawan</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1">
          Data <strong>{employeeName}</strong> akan dihapus dari daftar mock ini. Tindakan ini hanya
          berlaku pada tampilan demo saat ini.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Batal
        </Button>
        <Button variant="contained" color="error" onClick={onConfirm} disabled={isSubmitting}>
          Hapus
        </Button>
      </DialogActions>
    </Dialog>
  );
}
