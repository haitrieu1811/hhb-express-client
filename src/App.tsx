import React from 'react'
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router'

import PATH from '~/constants/path'
import MainLayout from '~/layouts/main'
import DashboardPage from '~/pages/dashboard'
import ForgotPasswordPage from '~/pages/forgot-password'
import HomePage from '~/pages/home'
import LoginPage from '~/pages/login'
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
        <MainLayout>
          <HomePage />
        </MainLayout>
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
            <MainLayout>
              <DashboardPage />
            </MainLayout>
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
