import { useQuery } from '@tanstack/react-query'
import React from 'react'

import productsApis from '~/apis/products.apis'

export default function usePublicProducts() {
  const getProductsQuery = useQuery({
    queryKey: ['get-products'],
    queryFn: () => productsApis.getProducts()
  })

  const products = React.useMemo(
    () => getProductsQuery.data?.data.data.products ?? [],
    [getProductsQuery.data?.data.data.products]
  )

  const totalProducts = getProductsQuery.data?.data.data.pagination.totalRows ?? 0

  return {
    products,
    totalProducts
  }
}
