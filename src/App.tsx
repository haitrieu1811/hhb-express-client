import React from 'react'
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router'

import PATH from '~/constants/path'
import { AppContext } from '~/providers/app.provider'
import { protectedRoutes, publicRoutes, rejectedRoutes } from '~/routes/routes'

const ProtectedRoute = () => {
  const { isAuthenticated } = React.useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to={PATH.LOGIN} />
}
const RejectedRoute = () => {
  const { isAuthenticated } = React.useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to={PATH.HOME} />
}

const publicPages = publicRoutes.map((route) => ({
  path: route.path,
  element: (
    <route.layout>
      <route.page></route.page>
    </route.layout>
  )
}))

const protectedPages = protectedRoutes.map((route) => ({
  path: route.path,
  element: (
    <route.layout>
      <route.page></route.page>
    </route.layout>
  )
}))

const rejectedPages = rejectedRoutes.map((route) => ({
  path: route.path,
  element: (
    <route.layout>
      <route.page></route.page>
    </route.layout>
  )
}))

export default function App() {
  const router = createBrowserRouter([
    // Trang công khai
    ...publicPages,
    // Đăng nhập rồi mới được vào đây
    {
      path: '',
      element: <ProtectedRoute />,
      children: protectedPages
    },
    // Chưa đăng nhập mới được vào đây
    {
      path: '',
      element: <RejectedRoute />,
      children: rejectedPages
    }
  ])

  return <RouterProvider router={router} />
}
