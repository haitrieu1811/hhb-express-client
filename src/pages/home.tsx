import React from 'react'
import { Link } from 'react-router'

import { ModeToggle } from '~/components/mode-toggle'
import PATH from '~/constants/path'
import { AppContext } from '~/providers/app.provider'

export default function HomePage() {
  const { isAuthenticated } = React.useContext(AppContext)

  return (
    <div>
      HomePage
      <ModeToggle />
      <Link to={PATH.LOGIN}>Đăng nhập</Link>
      <Link to={PATH.REGISTER}>Đăng ký</Link>
      {isAuthenticated && <Link to={PATH.DASHBOARD}>Dashboard</Link>}
    </div>
  )
}
