import http from '~/lib/http'
import { CreateReviewReqBody, OriginalReview, ReviewItem, ReviewStatistics } from '~/types/reviews.types'
import { PaginationResponse, SuccessResponse } from '~/types/utils.types'

const reviewsApis = {
  createReview({ body, productId }: { body: CreateReviewReqBody; productId: string }) {
    return http.post<
      SuccessResponse<{
        review: OriginalReview
      }>
    >(`/reviews/products/${productId}`, body)
  },

  getReviewdProductIds() {
    return http.get<
      SuccessResponse<{
        reviewdProductIds: string[]
      }>
    >('/reviews/product-ids')
  },

  getReviewsByProductId(productId: string) {
    return http.get<
      SuccessResponse<{
        reviews: ReviewItem[]
        statistics: ReviewStatistics
        pagination: PaginationResponse
      }>
    >(`/reviews/products/${productId}`)
  }
} as const

export default reviewsApis
