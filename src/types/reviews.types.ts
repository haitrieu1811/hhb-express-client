export type CreateReviewReqBody = {
  starPoints: number
  photos?: string[]
  content?: string
}

export type OriginalReview = {
  _id: string
  userId: string
  productId: string
  starPoints: number
  photos: string[]
  content: string
  createdAt: string
  updatedAt: string
}

export type ReviewItem = {
  _id: string
  starPoints: number
  photos: string[]
  content: string
  author: {
    _id: string
    email: string
    fullName: string
    avatar: string
    createdAt: string
    updatedAt: string
  }
  createdAt: string
  updatedAt: string
}

export type ReviewStatistics = {
  starPoints: number
  totalOneStar: number
  totalTwoStar: number
  totalThreeStar: number
  totalFourStar: number
  totalFiveStar: number
}
