import { generateNameId } from '~/lib/utils'

const PATH = {
  HOME: '/',

  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  PRODUCT_DETAIL_WITH_NAME_ID: '/products/:nameId',
  PRODUCT_DETAIL: ({ name, id }: { name: string; id: string }) => `/products/${generateNameId({ name, id })}`,
  ME: '/me',
  ACCOUNT: '/account',
  ACCOUNT_PROFILE: '/account/profile',
  ACCOUNT_CHANGE_PASSWORD: '/account/change-password',
  ACCOUNT_ADDRESSES: '/account/addresses',
  CART: '/cart',

  DASHBOARD: '/dashboard',
  DASHBOARD_USER: '/dashboard/user',
  DASHBOARD_PRODUCT_CATEGORY: '/dashboard/product-category',
  DASHBOARD_PRODUCT_CATEGORY_NEW: '/dashboard/product-category/new',
  DASHBOARD_ME: '/dashboard/me',
  DASHBOARD_PRODUCT: '/dashboard/product',
  DASHBOARD_PRODUCT_NEW: '/dashboard/product/new',

  NOT_FOUND: '*'
} as const

export default PATH
