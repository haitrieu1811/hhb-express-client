const PATH = {
  HOME: '/',

  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  DASHBOARD: '/dashboard',
  DASHBOARD_USER: '/dashboard/user',
  DASHBOARD_PRODUCT_CATEGORY: '/dashboard/product-category',

  NOT_FOUND: '*'
} as const

export default PATH
