import { useQuery } from '@tanstack/react-query'
import React from 'react'

import ordersApis from '~/apis/orders.apis'
import { AppContext } from '~/providers/app.provider'

export default function useOrder(orderId: string) {
  const { isAuthenticated } = React.useContext(AppContext)

  const getOrderQuery = useQuery({
    queryKey: ['get-order', orderId],
    queryFn: () => ordersApis.getOrder(orderId),
    enabled: !!(isAuthenticated && orderId)
  })

  const order = React.useMemo(() => getOrderQuery.data?.data.data.order, [getOrderQuery.data?.data.data.order])

  return {
    getOrderQuery,
    order
  }
}
