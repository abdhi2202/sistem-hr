function asArray(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
}

function asItem(payload) {
  if (payload?.data) {
    return payload.data;
  }

  return payload;
}

export function normalizeAuthResponse(payload) {
  const item = asItem(payload) ?? {};
  const user = item.user ?? {};

  return {
    token: item.token ?? item.access_token ?? '',
    role: item.role ?? user.role ?? 'karyawan',
    user: {
      name: user.name ?? user.nama ?? user.nama_lengkap ?? '',
      email: user.email ?? '',
    },
  };
}

export function toLoginApiPayload(form) {
  return {
    email: form.email,
    password: form.password,
  };
}

export function toChangePasswordApiPayload(form) {
  return {
    current_password: form.currentPassword,
    password: form.newPassword,
    password_confirmation: form.confirmPassword,
  };
}

function toBoolean(value, fallback = true) {
  if (typeof value === 'boolean') {
    return value;
  }

  if (value === 1 || value === '1' || value === 'true') {
    return true;
  }

  if (value === 0 || value === '0' || value === 'false') {
    return false;
  }

  return fallback;
}

function getDepartmentName(item) {
  return (
    item.departemen?.nama_departemen ??
    item.departemen?.nama ??
    item.department?.name ??
    item.departemen_nama ??
    item.department_name ??
    (typeof item.departemen === 'string' ? item.departemen : '') ??
    (typeof item.department === 'string' ? item.department : '') ??
    ''
  );
}

function getPositionName(item) {
  return (
    item.jabatan?.nama_jabatan ??
    item.jabatan?.nama ??
    item.position?.name ??
    item.jabatan_nama ??
    item.position_name ??
    (typeof item.jabatan === 'string' ? item.jabatan : '') ??
    (typeof item.position === 'string' ? item.position : '') ??
    ''
  );
}

export function normalizeEmployeeList(payload) {
  return asArray(payload).map(normalizeEmployeeItem);
}

export function normalizeEmployeeItem(payload) {
  const item = asItem(payload) ?? {};

  return {
    id: item.id,
    nomorInduk: item.nomorInduk ?? item.nomor_induk ?? '',
    namaLengkap: item.namaLengkap ?? item.nama_lengkap ?? item.name ?? '',
    email: item.email ?? item.user?.email ?? '',
    departemen: getDepartmentName(item),
    jabatan: getPositionName(item),
    tanggalBergabung: item.tanggalBergabung ?? item.tanggal_bergabung ?? '',
    statusAktif: toBoolean(item.statusAktif ?? item.status_aktif, true),
  };
}

export function toEmployeeApiPayload(form) {
  const payload = {
    nomor_induk: form.nomorInduk,
    nama_lengkap: form.namaLengkap,
    email: form.email,
    departemen: form.departemen,
    jabatan: form.jabatan,
    tanggal_bergabung: form.tanggalBergabung,
    status_aktif: form.statusAktif,
  };

  if (form.password) {
    payload.password = form.password;
    payload.password_confirmation = form.confirmPassword;
  }

  return payload;
}

export function normalizeDepartmentList(payload) {
  return asArray(payload).map((item) => ({
    id: item.id,
    nama: item.nama ?? item.nama_departemen ?? '',
    penggunaan:
      item.penggunaan ?? item.karyawan_count ?? item.karyawans_count ?? item.employee_count ?? 0,
  }));
}

export function normalizeDepartmentItem(payload) {
  const item = asItem(payload) ?? {};

  return {
    id: item.id,
    nama: item.nama ?? item.nama_departemen ?? '',
    penggunaan:
      item.penggunaan ?? item.karyawan_count ?? item.karyawans_count ?? item.employee_count ?? 0,
  };
}

export function normalizePositionList(payload) {
  return asArray(payload).map((item) => ({
    id: item.id,
    nama: item.nama ?? item.nama_jabatan ?? '',
    penggunaan:
      item.penggunaan ?? item.karyawan_count ?? item.karyawans_count ?? item.employee_count ?? 0,
  }));
}

export function normalizePositionItem(payload) {
  const item = asItem(payload) ?? {};

  return {
    id: item.id,
    nama: item.nama ?? item.nama_jabatan ?? '',
    penggunaan:
      item.penggunaan ?? item.karyawan_count ?? item.karyawans_count ?? item.employee_count ?? 0,
  };
}

export function toDepartmentApiPayload(form) {
  return {
    nama_departemen: form.nama,
  };
}

export function toPositionApiPayload(form) {
  return {
    nama_jabatan: form.nama,
  };
}

export function normalizeAttendanceList(payload) {
  return asArray(payload).map((item) => ({
    id: item.id,
    nama: item.nama ?? item.karyawan?.nama_lengkap ?? item.nama_karyawan ?? '',
    departemen:
      item.departemen ??
      item.karyawan?.departemen?.nama_departemen ??
      item.karyawan?.departemen?.nama ??
      '',
    tanggal: item.tanggal ?? '',
    waktuMasuk: item.waktuMasuk ?? item.waktu_masuk ?? '',
    waktuKeluar: item.waktuKeluar ?? item.waktu_keluar ?? '',
    status: item.status ?? 'Hadir',
  }));
}

export function normalizeLeaveList(payload) {
  return asArray(payload).map((item) => ({
    id: item.id,
    nama: item.nama ?? item.karyawan?.nama_lengkap ?? item.nama_karyawan ?? '',
    departemen:
      item.departemen ??
      item.karyawan?.departemen?.nama_departemen ??
      item.karyawan?.departemen?.nama ??
      '',
    tanggalMulai: item.tanggalMulai ?? item.tanggal_mulai ?? '',
    tanggalSelesai: item.tanggalSelesai ?? item.tanggal_selesai ?? '',
    alasan: item.alasan ?? '',
    status: item.status ?? item.status_pengajuan ?? 'Pending',
  }));
}

export function normalizeLeaveItem(payload) {
  const item = asItem(payload) ?? {};

  return {
    id: item.id,
    tanggalMulai: item.tanggalMulai ?? item.tanggal_mulai ?? '',
    tanggalSelesai: item.tanggalSelesai ?? item.tanggal_selesai ?? '',
    alasan: item.alasan ?? '',
    status: item.status ?? item.status_pengajuan ?? 'Pending',
  };
}

export function toLeaveApiPayload(form) {
  return {
    tanggal_mulai: form.tanggalMulai,
    tanggal_selesai: form.tanggalSelesai,
    alasan: form.alasan,
  };
}
