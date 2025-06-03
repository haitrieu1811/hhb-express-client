import { useQuery } from '@tanstack/react-query'
import React from 'react'

import productCategoriesApis, { GetProductCategories } from '~/apis/productCategories.apis'

export default function useProductCategories({ page, name, limit }: GetProductCategories) {
  const getProductCategoriesQuery = useQuery({
    queryKey: ['get-product-categories', { page, name, limit }],
    queryFn: () => productCategoriesApis.getProductCategories({ page, name, limit })
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
