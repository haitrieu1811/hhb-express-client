import { Link } from 'react-router'

import PATH from '~/constants/path'

export default function HomePage() {
  return (
    <div>
      HomePage
      <Link to={PATH.LOGIN}>Đăng nhập</Link>
      <Link to={PATH.REGISTER}>Đăng ký</Link>
    </div>
  )
}
