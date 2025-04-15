import React from 'react'
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router'

import PATH from '~/constants/path'
import MainLayout from '~/layouts/main'
import DashboardPage from '~/pages/dashboard'
import HomePage from '~/pages/home'
import LoginPage from '~/pages/login'
import RegisterPage from '~/pages/register'
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
    {
      path: PATH.HOME,
      element: (
        <MainLayout>
          <HomePage />
        </MainLayout>
      )
    },
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
        }
      ]
    }
  ])

  return <RouterProvider router={router} />
}
