import { Link } from 'react-router'

import { ModeToggle } from '~/components/mode-toggle'
import PATH from '~/constants/path'

export default function HomePage() {
  return (
    <div>
      HomePage
      <ModeToggle />
      <Link to={PATH.LOGIN}>Đăng nhập</Link>
      <Link to={PATH.REGISTER}>Đăng ký</Link>
    </div>
  )
}
