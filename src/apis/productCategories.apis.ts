import { ProductCategoryStatus } from '~/constants/enum'
import http from '~/lib/http'
import { CreateProductCategoryResponse, GetProductCategoriesResponse } from '~/types/productCategories.types'
import { OnlyMessageResponse, PaginationReqParams } from '~/types/utils.types'

type CreateProductCategoryReqBody = {
  name: string
  description?: string
  thumbnail: string
  status: ProductCategoryStatus
}

export type GetProductCategories = PaginationReqParams & {
  name?: string
}

const productCategoriesApis = {
  getProductCategories(params?: GetProductCategories) {
    return http.get<GetProductCategoriesResponse>('/product-categories', { params })
  },

  createProductCategory(body: CreateProductCategoryReqBody) {
    return http.post<CreateProductCategoryResponse>('/product-categories', body)
  },

  deleteProductCategory(productCategoryId: string) {
    return http.delete<OnlyMessageResponse>(`/product-categories/${productCategoryId}`)
  },

  getProductCategory(productCategoryId: string) {
    return http.get<CreateProductCategoryResponse>(`/product-categories/${productCategoryId}`)
  },

  updateProductCategory({
    body,
    productCategoryId
  }: {
    body: CreateProductCategoryReqBody
    productCategoryId: string
  }) {
    return http.put<CreateProductCategoryResponse>(`/product-categories/${productCategoryId}`, body)
  }
} as const

export default productCategoriesApis
