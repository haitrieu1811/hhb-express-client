import { useMutation } from '@tanstack/react-query'
import React from 'react'
import { Link } from 'react-router'
import { toast } from 'sonner'
import usersApis from '~/apis/users.apis'

import { ModeToggle } from '~/components/mode-toggle'
import { Button } from '~/components/ui/button'
import PATH from '~/constants/path'
import { AppContext } from '~/providers/app.provider'

export default function HomePage() {
  const { isAuthenticated, setIsAuthenticated, setProfile } = React.useContext(AppContext)

  const logoutMutation = useMutation({
    mutationKey: ['logout'],
    mutationFn: usersApis.logout,
    onSuccess: (data) => {
      toast.success(data.data.message)
      setIsAuthenticated(false)
      setProfile(null)
    }
  })

  return (
    <div>
      HomePage
      <ModeToggle />
      <Link to={PATH.LOGIN}>Đăng nhập</Link>
      <Link to={PATH.REGISTER}>Đăng ký</Link>
      {isAuthenticated && (
        <Button variant='link' onClick={() => logoutMutation.mutate()}>
          Đăng xuất
        </Button>
      )}
    </div>
  )
}
