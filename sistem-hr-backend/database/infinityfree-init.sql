SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin_hr','karyawan') NOT NULL DEFAULT 'karyawan',
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `departemens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nama_departemen` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `departemens_nama_departemen_unique` (`nama_departemen`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `jabatans` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nama_jabatan` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `jabatans_nama_jabatan_unique` (`nama_jabatan`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `karyawans` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `departemen_id` bigint unsigned NOT NULL,
  `jabatan_id` bigint unsigned NOT NULL,
  `nama_lengkap` varchar(255) NOT NULL,
  `nomor_induk` varchar(255) NOT NULL,
  `tanggal_bergabung` date NOT NULL,
  `status_aktif` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `karyawans_nomor_induk_unique` (`nomor_induk`),
  KEY `karyawans_user_id_foreign` (`user_id`),
  KEY `karyawans_departemen_id_foreign` (`departemen_id`),
  KEY `karyawans_jabatan_id_foreign` (`jabatan_id`),
  CONSTRAINT `karyawans_departemen_id_foreign` FOREIGN KEY (`departemen_id`) REFERENCES `departemens` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `karyawans_jabatan_id_foreign` FOREIGN KEY (`jabatan_id`) REFERENCES `jabatans` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `karyawans_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `absensis` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `karyawan_id` bigint unsigned NOT NULL,
  `tanggal` date NOT NULL,
  `waktu_masuk` time DEFAULT NULL,
  `waktu_keluar` time DEFAULT NULL,
  `status` enum('Hadir','Izin','Sakit','Alpha') NOT NULL DEFAULT 'Hadir',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `absensis_karyawan_id_tanggal_unique` (`karyawan_id`,`tanggal`),
  CONSTRAINT `absensis_karyawan_id_foreign` FOREIGN KEY (`karyawan_id`) REFERENCES `karyawans` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `cutis` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `karyawan_id` bigint unsigned NOT NULL,
  `tanggal_mulai` date NOT NULL,
  `tanggal_selesai` date NOT NULL,
  `alasan` text NOT NULL,
  `status_pengajuan` enum('Pending','Disetujui','Ditolak') NOT NULL DEFAULT 'Pending',
  `disetujui_oleh` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cutis_karyawan_id_foreign` (`karyawan_id`),
  KEY `cutis_disetujui_oleh_foreign` (`disetujui_oleh`),
  CONSTRAINT `cutis_disetujui_oleh_foreign` FOREIGN KEY (`disetujui_oleh`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `cutis_karyawan_id_foreign` FOREIGN KEY (`karyawan_id`) REFERENCES `karyawans` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `departemens` (`id`, `nama_departemen`, `created_at`, `updated_at`) VALUES
  (1, 'Finance', '2026-04-13 00:00:00', '2026-04-13 00:00:00'),
  (2, 'People Ops', '2026-04-13 00:00:00', '2026-04-13 00:00:00')
ON DUPLICATE KEY UPDATE
  `nama_departemen` = VALUES(`nama_departemen`),
  `updated_at` = VALUES(`updated_at`);

INSERT INTO `jabatans` (`id`, `nama_jabatan`, `created_at`, `updated_at`) VALUES
  (1, 'Senior Finance Officer', '2026-04-13 00:00:00', '2026-04-13 00:00:00'),
  (2, 'HR Officer', '2026-04-13 00:00:00', '2026-04-13 00:00:00')
ON DUPLICATE KEY UPDATE
  `nama_jabatan` = VALUES(`nama_jabatan`),
  `updated_at` = VALUES(`updated_at`);

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES
  (1, 'Admin HR', 'admin@ssms.test', '$2y$10$tGFsXDIL5C1rJMBL5r0m4e7.8zdAG7ysBVLSiIlRt5JIxegSJz23G', 'admin_hr', '2026-04-13 00:00:00', '2026-04-13 00:00:00'),
  (2, 'Rina Paramita', 'rina.paramita@ssms.test', '$2y$10$tGFsXDIL5C1rJMBL5r0m4e7.8zdAG7ysBVLSiIlRt5JIxegSJz23G', 'karyawan', '2026-04-13 00:00:00', '2026-04-13 00:00:00'),
  (3, 'Nadia Putri', 'nadia.putri@ssms.test', '$2y$10$tGFsXDIL5C1rJMBL5r0m4e7.8zdAG7ysBVLSiIlRt5JIxegSJz23G', 'karyawan', '2026-04-13 00:00:00', '2026-04-13 00:00:00')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `password` = VALUES(`password`),
  `role` = VALUES(`role`),
  `updated_at` = VALUES(`updated_at`);

INSERT INTO `karyawans` (`id`, `user_id`, `departemen_id`, `jabatan_id`, `nama_lengkap`, `nomor_induk`, `tanggal_bergabung`, `status_aktif`, `created_at`, `updated_at`) VALUES
  (1, 2, 1, 1, 'Rina Paramita', 'EMP-001', '2023-02-14', 1, '2026-04-13 00:00:00', '2026-04-13 00:00:00'),
  (2, 3, 2, 2, 'Nadia Putri', 'EMP-002', '2024-01-08', 1, '2026-04-13 00:00:00', '2026-04-13 00:00:00')
ON DUPLICATE KEY UPDATE
  `user_id` = VALUES(`user_id`),
  `departemen_id` = VALUES(`departemen_id`),
  `jabatan_id` = VALUES(`jabatan_id`),
  `nama_lengkap` = VALUES(`nama_lengkap`),
  `tanggal_bergabung` = VALUES(`tanggal_bergabung`),
  `status_aktif` = VALUES(`status_aktif`),
  `updated_at` = VALUES(`updated_at`);
