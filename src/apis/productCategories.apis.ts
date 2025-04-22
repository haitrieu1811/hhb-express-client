import http from '~/lib/http'
import { CreateProductCategoryResponse, GetProductCategoriesResponse } from '~/types/productCategories.types'
import { PaginationReqParams } from '~/types/utils.types'

const productCategoriesApis = {
  getProductCategories(params?: PaginationReqParams) {
    return http.get<GetProductCategoriesResponse>('/product-categories', { params })
  },

  createProductCategory(body: { name: string; description?: string; thumbnail: string }) {
    return http.post<CreateProductCategoryResponse>('/product-categories', body)
  }
} as const

export default productCategoriesApis
