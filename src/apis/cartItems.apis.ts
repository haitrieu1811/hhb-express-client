import http from '~/lib/http'
import { GetMyCartResponse } from '~/types/cartItems.types'
import { OnlyMessageResponse } from '~/types/utils.types'

const cartItemsApis = {
  addProductToCart({ productId, quantity }: { productId: string; quantity: number }) {
    return http.post<OnlyMessageResponse>(`/cart-items/add/product/${productId}`, { quantity })
  },

  getMyCart() {
    return http.get<GetMyCartResponse>('/cart-items/me')
  }
} as const

export default cartItemsApis
