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
  ACCOUNT_ORDERS: '/account/orders',
  ACCOUNT_ORDER_DETAIL_WITHOUT_ID: '/account/orders/:orderId',
  ACCOUNT_ORDER_DETAI: (orderId: string) => `/account/orders/${orderId}`,

  CART: '/cart',
  CART_LIST: '/cart/list',
  CART_ORDER_INFO: '/cart/order-info',
  CART_ORDER_PREVIEW: '/cart/order-preview',
  CART_ORDER_SUCCESS: '/cart/order-success',

  PRODUCTS: '/products',
  BLOGS: '/blogs',
  BLOG_DETAIL_WITH_NAME_ID: '/blogs/:nameId',
  BLOG_DETAIL: (nameId: { name: string; id: string }) => `/blogs/${generateNameId(nameId)}`,

  DASHBOARD: '/dashboard',
  DASHBOARD_USER: '/dashboard/user',
  DASHBOARD_PRODUCT_CATEGORY: '/dashboard/product-category',
  DASHBOARD_PRODUCT_CATEGORY_NEW: '/dashboard/product-category/new',
  DASHBOARD_ME: '/dashboard/me',
  DASHBOARD_PRODUCT_NEW: '/dashboard/products/new',
  DASHBOARD_ORDERS: '/dashboard/orders',
  DASHBOARD_BLOGS: '/dashboard/blogs',
  DASHBOARD_BLOGS_NEW: '/dashboard/blogs/new',
  DASHBOARD_BLOGS_DETAIL_WITHOUT_ID: '/dashboard/blogs/:blogId',
  DASHBOARD_BLOGS_DETAIL: (blogId: string) => `/dashboard/blogs/${blogId}`,
  DASHBOARD_PRODUCTS: '/dashboard/products',
  DASHBOARD_PRODUCT_DETAIL_WITHOUT_ID: '/dashboard/products/:productId',
  DASHBOARD_PRODUCT_DETAIL: (productId: string) => `/dashboard/products/${productId}`,

  NOT_FOUND: '*'
} as const

export default PATH
