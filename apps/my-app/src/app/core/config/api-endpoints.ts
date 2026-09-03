export const API_ENDPOINTS = {
  auth: {
    inquiryCustomerProfile: 'v1/auth/inquiryCustomerProfile',
    updateProfile: 'v1/auth/updateProfile',
    login: 'auth/login',
    logout: 'auth/logout',
    refresh: 'auth/refresh',
    profile: 'auth/profile',
  },
  captcha: {
    generate: 'captcha/generate',
    verify: 'captcha/verify',
  },
  users: {
    list: 'users',
    detail: (id: number | string) => `users/${id}`,
    create: 'users',
    update: (id: number | string) => `users/${id}`,
    delete: (id: number | string) => `users/${id}`,
  },
} as const;
