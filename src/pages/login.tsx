import { Link } from 'react-router'

import PATH from '~/constants/path'

export default function LoginPage() {
  return (
    <div>
      LoginPage
      <Link to={PATH.HOME}>Trang chủ</Link>
    </div>
  )
}
