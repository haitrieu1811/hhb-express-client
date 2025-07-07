import PATH from '~/constants/path'
import DashboardLayout from '~/layouts/dashboard'
import ShopLayout from '~/layouts/shop'
import AccountPage from '~/pages/account'
import AccountAddressesPage from '~/pages/account/addresses'
import AccountChangePasswordPage from '~/pages/account/change-password'
import AccountOrderDetailPage from '~/pages/account/order-detail'
import AccountOrdersPage from '~/pages/account/orders'
import AccountProfilePage from '~/pages/account/profile'
import BlogDetailPage from '~/pages/blog-detail'
import BlogsPage from '~/pages/blogs'
import CartPage from '~/pages/cart'
import CartListPage from '~/pages/cart/list'
import CartOrderInfoPage from '~/pages/cart/order-info'
import CartOrderSuccessPage from '~/pages/cart/order-success'
import DashboardPage from '~/pages/dashboard'
import DashboardBlogDetailPage from '~/pages/dashboard-blog-detail'
import DashboardBlogNewPage from '~/pages/dashboard-blog-new'
import DashboardBlogsPage from '~/pages/dashboard-blogs'
import DashboardMePage from '~/pages/dashboard-me'
import DashboardOrdersPage from '~/pages/dashboard-orders'
import DashboardProductPage from '~/pages/dashboard-product'
import DashboardProductCategoryPage from '~/pages/dashboard-product-category'
import DashboardProductCategoryNewPage from '~/pages/dashboard-product-category-new'
import DashboardProductNewPage from '~/pages/dashboard-product-new'
import DashboardUserPage from '~/pages/dashboard-user'
import ForgotPasswordPage from '~/pages/forgot-password'
import HomePage from '~/pages/home'
import LoginPage from '~/pages/login'
import ProductDetailPage from '~/pages/product-detail'
import ProductsPage from '~/pages/products'
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
  },
  {
    path: PATH.PRODUCTS,
    layout: ShopLayout,
    page: ProductsPage
  },
  {
    path: PATH.BLOGS,
    layout: ShopLayout,
    page: BlogsPage
  },
  {
    path: PATH.BLOG_DETAIL_WITH_NAME_ID,
    layout: ShopLayout,
    page: BlogDetailPage
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
    path: PATH.DASHBOARD_ORDERS,
    layout: DashboardLayout,
    page: DashboardOrdersPage
  },
  {
    path: PATH.DASHBOARD_BLOGS,
    layout: DashboardLayout,
    page: DashboardBlogsPage
  },
  {
    path: PATH.DASHBOARD_BLOGS_NEW,
    layout: DashboardLayout,
    page: DashboardBlogNewPage
  },
  {
    path: PATH.DASHBOARD_BLOGS_DETAIL_WITHOUT_ID,
    layout: DashboardLayout,
    page: DashboardBlogDetailPage
  },
  {
    path: PATH.CART,
    layout: ShopLayout,
    page: CartPage,
    children: [
      {
        path: PATH.CART_LIST,
        page: CartListPage
      },
      {
        path: PATH.CART_ORDER_INFO,
        page: CartOrderInfoPage
      },
      {
        path: PATH.CART_ORDER_SUCCESS,
        page: CartOrderSuccessPage
      }
    ]
  },
  {
    path: PATH.ACCOUNT,
    layout: ShopLayout,
    page: AccountPage,
    children: [
      {
        path: PATH.ACCOUNT_PROFILE,
        page: AccountProfilePage
      },
      {
        path: PATH.ACCOUNT_CHANGE_PASSWORD,
        page: AccountChangePasswordPage
      },
      {
        path: PATH.ACCOUNT_ADDRESSES,
        page: AccountAddressesPage
      },
      {
        path: PATH.ACCOUNT_ORDERS,
        page: AccountOrdersPage
      },
      {
        path: PATH.ACCOUNT_ORDER_DETAIL_WITHOUT_ID,
        page: AccountOrderDetailPage
      }
    ]
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
