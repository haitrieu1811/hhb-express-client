import { useQuery } from '@tanstack/react-query'
import React from 'react'

import productsApis, { GetPublicProductsReqParams } from '~/apis/products.apis'
import { PaginationResponse } from '~/types/utils.types'

const defaultPagination: PaginationResponse = {
  page: 1,
  limit: 20,
  totalPages: 0,
  totalRows: 0
}

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

  const pagination = React.useMemo(
    () => getProductsQuery.data?.data.data.pagination ?? defaultPagination,
    [getProductsQuery.data?.data.data.pagination]
  )

  return {
    products,
    totalProducts,
    getProductsQuery,
    pagination
  }
}
