import http from '~/lib/http'
import { ProductItem } from '~/types/products.types'
import { PaginationReqParams, PaginationResponse, SuccessResponse } from '~/types/utils.types'

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
  },

  getProducts(params?: PaginationReqParams) {
    return http.get<
      SuccessResponse<{
        products: ProductItem[]
        pagination: PaginationResponse
      }>
    >('/products', { params })
  }
} as const

export default productsApis
