/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import React from 'react'
import { toast } from 'sonner'

import cartItemsApis from '~/apis/cartItems.apis'
import { AppContext } from '~/providers/app.provider'
import { OnlyMessageResponse } from '~/types/utils.types'

type UseCartProps = {
  enabledGetMyCart?: boolean
  onAddProductToCartSuccess?: (data: AxiosResponse<OnlyMessageResponse, any>) => void
}

export default function useCart({ enabledGetMyCart = true, onAddProductToCartSuccess }: UseCartProps) {
  const { isAuthenticated } = React.useContext(AppContext)

  const getMyCartQuery = useQuery({
    queryKey: ['get-my-cart'],
    queryFn: () => cartItemsApis.getMyCart(),
    enabled: isAuthenticated && enabledGetMyCart
  })

  const myCart = React.useMemo(
    () => getMyCartQuery.data?.data.data.cartItems ?? [],
    [getMyCartQuery.data?.data.data.cartItems]
  )
  const totalItems = getMyCartQuery.data?.data.data.totalItems ?? 0
  const totalAmount = getMyCartQuery.data?.data.data.totalAmount ?? 0

  const addProductToCartMutation = useMutation({
    mutationKey: ['add-product-to-cart'],
    mutationFn: cartItemsApis.addProductToCart,
    onSuccess: (data) => {
      toast.success(data.data.message)
      getMyCartQuery.refetch()
      onAddProductToCartSuccess && onAddProductToCartSuccess(data)
    }
  })

  return {
    addProductToCartMutation,
    getMyCartQuery,
    myCart,
    totalItems,
    totalAmount
  }
}
