import { useQuery } from '@tanstack/react-query'
import React from 'react'

import { addressesApis } from '~/apis/addresses.apis'
import { AppContext } from '~/providers/app.provider'

export default function useMyAddresses() {
  const { isAuthenticated } = React.useContext(AppContext)

  const getMyAddressesQuery = useQuery({
    queryKey: ['get-my-addresses'],
    queryFn: () => addressesApis.getMyAddresses(),
    enabled: isAuthenticated
  })

  const addresses = React.useMemo(
    () => getMyAddressesQuery.data?.data.data.addresses ?? [],
    [getMyAddressesQuery.data?.data.data.addresses]
  )

  return {
    getMyAddressesQuery,
    addresses
  }
}
