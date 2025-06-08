import { SuccessResponse } from '~/types/utils.types'

export type CartItem = {
  _id: string
  product: {
    _id: string
    thumbnail: string
    name: string
    price: number
    priceAfterDiscount: number
    createdAt: string
    updatedAt: string
  }
  unitPrice: number
  unitPriceAfterDiscount: number
  quantity: number
  createdAt: string
  updatedAt: string
}

export type GetMyCartResponse = SuccessResponse<{
  totalItems: number
  totalAmount: number
  cartItems: CartItem[]
}>
