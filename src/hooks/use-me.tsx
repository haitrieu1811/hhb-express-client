import { useQuery } from '@tanstack/react-query'
import React from 'react'

import usersApis from '~/apis/users.apis'
import { AppContext } from '~/providers/app.provider'

export default function useMe() {
  const { isAuthenticated } = React.useContext(AppContext)

  const getMeQuery = useQuery({
    queryKey: ['get-me'],
    queryFn: () => usersApis.getMe(),
    enabled: !!isAuthenticated
  })

  const meData = React.useMemo(() => getMeQuery.data?.data.data.user, [getMeQuery.data?.data.data.user])

  return {
    getMeQuery,
    meData
  }
}
