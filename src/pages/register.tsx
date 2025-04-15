import { Link } from 'react-router'

import PATH from '~/constants/path'

export default function RegisterPage() {
  return (
    <div>
      RegisterPage
      <Link to={PATH.HOME}>Trang chủ</Link>
    </div>
  )
}
