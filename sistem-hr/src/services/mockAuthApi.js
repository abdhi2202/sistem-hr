export const demoAccounts = {
  admin_hr: {
    email: 'admin@ssms.test',
    password: 'password123',
    name: 'Admin HR Demo',
    role: 'admin_hr',
    label: 'Akun Demo Admin HR',
  },
  karyawan: {
    email: 'karyawan@ssms.test',
    password: 'password123',
    name: 'Karyawan Demo',
    role: 'karyawan',
    label: 'Akun Demo Karyawan',
  },
};

export const mockAuthApi = {
  async login({ email, password, role = 'admin_hr' }) {
    const account = demoAccounts[role];

    if (!account || email !== account.email || password !== account.password) {
      throw new Error('Email, password, atau role demo tidak cocok.');
    }

    return {
      token: `mock-token-${account.role}`,
      user: {
        name: account.name,
        email: account.email,
      },
      role: account.role,
    };
  },

  async logout() {
    return {
      success: true,
    };
  },

  async changePassword({ email, currentPassword, newPassword }) {
    const account = Object.values(demoAccounts).find((item) => item.email === email);

    if (!account || account.password !== currentPassword) {
      const error = new Error('Password saat ini tidak sesuai.');
      error.payload = {
        errors: {
          current_password: ['Password saat ini tidak sesuai.'],
        },
      };

      throw error;
    }

    account.password = newPassword;

    return {
      message: 'Password berhasil diperbarui.',
    };
  },
};
