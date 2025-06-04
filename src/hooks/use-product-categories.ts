import { useQuery } from '@tanstack/react-query'
import React from 'react'

import productCategoriesApis, { GetProductCategories } from '~/apis/productCategories.apis'

type UseProductCategoriesProps = GetProductCategories & {
  enabled?: boolean
}

export default function useProductCategories({ enabled, ...params }: UseProductCategoriesProps) {
  const getProductCategoriesQuery = useQuery({
    queryKey: ['get-product-categories', params],
    queryFn: () => productCategoriesApis.getProductCategories(params),
    enabled
  })

  const productCategories = React.useMemo(
    () => getProductCategoriesQuery.data?.data.data.productCategories ?? [],
    [getProductCategoriesQuery.data?.data.data.productCategories]
  )

  const totalProductCategories = React.useMemo(
    () => getProductCategoriesQuery.data?.data.data.pagination.totalRows ?? 0,
    [getProductCategoriesQuery.data?.data.data.pagination.totalRows]
  )

  return { getProductCategoriesQuery, productCategories, totalProductCategories }
}
