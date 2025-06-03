import React from 'react'
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router'

import PATH from '~/constants/path'
import DashboardLayout from '~/layouts/dashboard'
import ShopLayout from '~/layouts/shop'
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
import ProductDetailPage from '~/pages/product-detail'
import RegisterPage from '~/pages/register'
import ResetPasswordPage from '~/pages/reset-password'
import { AppContext } from '~/providers/app.provider'

const ProtectedRoute = () => {
  const { isAuthenticated } = React.useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to={PATH.LOGIN} />
}
const RejectedRoute = () => {
  const { isAuthenticated } = React.useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to={PATH.HOME} />
}

export default function App() {
  const router = createBrowserRouter([
    // Trang công khai
    {
      path: PATH.HOME,
      element: (
        <ShopLayout>
          <HomePage />
        </ShopLayout>
      )
    },
    {
      path: PATH.PRODUCT_DETAIL_WITH_NAME_ID,
      element: (
        <ShopLayout>
          <ProductDetailPage />
        </ShopLayout>
      )
    },
    // Đăng nhập rồi mới được vào đây
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: PATH.DASHBOARD,
          element: (
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          )
        },
        {
          path: PATH.DASHBOARD_USER,
          element: (
            <DashboardLayout>
              <DashboardUserPage />
            </DashboardLayout>
          )
        },
        {
          path: PATH.DASHBOARD_PRODUCT_CATEGORY,
          element: (
            <DashboardLayout>
              <DashboardProductCategoryPage />
            </DashboardLayout>
          )
        },
        {
          path: PATH.DASHBOARD_PRODUCT_CATEGORY_NEW,
          element: (
            <DashboardLayout>
              <DashboardProductCategoryNewPage />
            </DashboardLayout>
          )
        },
        {
          path: PATH.DASHBOARD_ME,
          element: (
            <DashboardLayout>
              <DashboardMePage />
            </DashboardLayout>
          )
        },
        {
          path: PATH.DASHBOARD_PRODUCT,
          element: (
            <DashboardLayout>
              <DashboardProductPage />
            </DashboardLayout>
          )
        },
        {
          path: PATH.DASHBOARD_PRODUCT_NEW,
          element: (
            <DashboardLayout>
              <DashboardProductNewPage />
            </DashboardLayout>
          )
        }
      ]
    },
    // Chưa đăng nhập mới được vào đây
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: PATH.LOGIN,
          element: <LoginPage />
        },
        {
          path: PATH.REGISTER,
          element: <RegisterPage />
        },
        {
          path: PATH.FORGOT_PASSWORD,
          element: <ForgotPasswordPage />
        },
        {
          path: PATH.RESET_PASSWORD,
          element: <ResetPasswordPage />
        }
      ]
    }
  ])

  return <RouterProvider router={router} />
}
