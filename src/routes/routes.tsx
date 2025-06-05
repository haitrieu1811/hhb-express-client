import PATH from '~/constants/path'
import DashboardLayout from '~/layouts/dashboard'
import ShopLayout from '~/layouts/shop'
import AccountPage from '~/pages/account'
import DashboardPage from '~/pages/dashboard'
import DashboardMePage from '~/pages/dashboard-me'
import DashboardProductPage from '~/pages/dashboard-product'
import DashboardProductCategoryPage from '~/pages/dashboard-product-category'
import DashboardProductCategoryNewPage from '~/pages/dashboard-product-category-new'
import DashboardProductNewPage from '~/pages/dashboard-product-new'
import DashboardUserPage from '~/pages/dashboard-user'
import ForgotPasswordPage from '~/pages/forgot-password'
import HomePage from '~/pages/home'
import LoginPage from '~/pages/login'
import MePage from '~/pages/me'
import ProductDetailPage from '~/pages/product-detail'
import RegisterPage from '~/pages/register'
import ResetPasswordPage from '~/pages/reset-password'

export const publicRoutes = [
  {
    path: PATH.HOME,
    layout: ShopLayout,
    page: HomePage
  },
  {
    path: PATH.PRODUCT_DETAIL_WITH_NAME_ID,
    layout: ShopLayout,
    page: ProductDetailPage
  }
]

export const protectedRoutes = [
  {
    path: PATH.DASHBOARD,
    layout: DashboardLayout,
    page: DashboardPage
  },
  {
    path: PATH.DASHBOARD_USER,
    layout: DashboardLayout,
    page: DashboardUserPage
  },
  {
    path: PATH.DASHBOARD_PRODUCT_CATEGORY,
    layout: DashboardLayout,
    page: DashboardProductCategoryPage
  },
  {
    path: PATH.DASHBOARD_PRODUCT_CATEGORY_NEW,
    layout: DashboardLayout,
    page: DashboardProductCategoryNewPage
  },
  {
    path: PATH.DASHBOARD_ME,
    layout: DashboardLayout,
    page: DashboardMePage
  },
  {
    path: PATH.DASHBOARD_PRODUCT,
    layout: DashboardLayout,
    page: DashboardProductPage
  },
  {
    path: PATH.DASHBOARD_PRODUCT_NEW,
    layout: DashboardLayout,
    page: DashboardProductNewPage
  },
  {
    path: PATH.ME,
    layout: ShopLayout,
    page: MePage
  },
  {
    path: PATH.ACCOUNT,
    layout: ShopLayout,
    page: AccountPage
  }
]

export const rejectedRoutes = [
  {
    path: PATH.LOGIN,
    layout: ShopLayout,
    page: LoginPage
  },
  {
    path: PATH.REGISTER,
    layout: ShopLayout,
    page: RegisterPage
  },
  {
    path: PATH.FORGOT_PASSWORD,
    layout: ShopLayout,
    page: ForgotPasswordPage
  },
  {
    path: PATH.RESET_PASSWORD,
    layout: ShopLayout,
    page: ResetPasswordPage
  }
]
