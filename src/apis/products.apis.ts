import http from '~/lib/http'
import { ProductItem } from '~/types/products.types'
import { SuccessResponse } from '~/types/utils.types'

export type CreateProductReqBody = {
  thumbnail: string
  photos?: string[]
  name: string
  description: string
  price: number
  priceAfterDiscount?: number
  categoryId: string
  status?: number
}

const productsApis = {
  createProduct(body: CreateProductReqBody) {
    return http.post<
      SuccessResponse<{
        product: ProductItem
      }>
    >('/products', body)
  }
} as const

export default productsApis
