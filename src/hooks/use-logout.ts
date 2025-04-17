import { useMutation } from '@tanstack/react-query'
import React from 'react'
import { toast } from 'sonner'

import usersApis from '~/apis/users.apis'
import { AppContext } from '~/providers/app.provider'

export default function useLogout() {
  const { setIsAuthenticated, setProfile } = React.useContext(AppContext)

  const logoutMutation = useMutation({
    mutationKey: ['logout'],
    mutationFn: usersApis.logout,
    onSuccess: (data) => {
      toast.success(data.data.message)
      setIsAuthenticated(false)
      setProfile(null)
    }
  })

  return {
    logoutMutation
  }
}
