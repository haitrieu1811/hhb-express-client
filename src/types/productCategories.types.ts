import { PaginationResponse, SuccessResponse } from '~/types/utils.types'

export type ProductCategoryItem = {
  _id: string
  name: string
  description: string
  thumbnail: string
  thumbnailId: string
  status: string
  createdAt: string
  updatedAt: string
}

export type GetProductCategoriesResponse = SuccessResponse<{
  productCategories: ProductCategoryItem[]
  pagination: PaginationResponse
}>

export type CreateProductCategoryResponse = SuccessResponse<{
  productCategory: ProductCategoryItem
}>
