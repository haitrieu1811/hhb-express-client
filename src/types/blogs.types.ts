import { BlogStatus } from '~/constants/enum'

export type CreateBlogReqBody = {
  title: string
  thumbnail: string
  content: string
  status?: BlogStatus
  order?: number
}

export type BlogItem = {
  _id: string
  thumbnail: {
    _id: string
    url: string
  }
  title: string
  author: {
    _id: string
    email: string
    fullName: string
    avatar: string
    createdAt: string
    updatedAt: string
  }
  content: string
  status: BlogStatus
  createdAt: string
  updatedAt: string
}

export type OriginalBlog = {
  _id: string
  userId: string
  thumbnail: string
  title: string
  content: string
  status: BlogStatus
  order: number
  createdAt: string
  updatedAt: string
}
