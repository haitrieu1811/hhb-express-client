import { useQuery } from '@tanstack/react-query'
import React from 'react'

import productsApis, { GetPublicProductsReqParams } from '~/apis/products.apis'

type UsePublicProductsProps = GetPublicProductsReqParams & {
  enabled?: boolean
}

export default function usePublicProducts({ enabled, ...params }: UsePublicProductsProps) {
  const getProductsQuery = useQuery({
    queryKey: ['get-products', params],
    queryFn: () => productsApis.getProducts(params),
    enabled
  })

  const products = React.useMemo(
    () => getProductsQuery.data?.data.data.products ?? [],
    [getProductsQuery.data?.data.data.products]
  )

  const totalProducts = getProductsQuery.data?.data.data.pagination.totalRows ?? 0

  return {
    products,
    totalProducts,
    getProductsQuery
  }
}
