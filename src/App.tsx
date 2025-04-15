import { Route, Routes } from 'react-router'

import PATH from '~/constants/path'
import MainLayout from '~/layouts/main'
import HomePage from '~/pages/home'
import LoginPage from '~/pages/login'
import RegisterPage from '~/pages/register'

function App() {
  return (
    <Routes>
      <Route
        path={PATH.HOME}
        element={
          <MainLayout>
            <HomePage />
          </MainLayout>
        }
      />

      <Route
        path={PATH.LOGIN}
        element={
          <MainLayout>
            <LoginPage />
          </MainLayout>
        }
      />

      <Route
        path={PATH.REGISTER}
        element={
          <MainLayout>
            <RegisterPage />
          </MainLayout>
        }
      />
    </Routes>
  )
}

export default App
