import http from '~/lib/http'
import { BlogItem, CreateBlogReqBody, OriginalBlog } from '~/types/blogs.types'
import { PaginationReqParams, PaginationResponse, SuccessResponse } from '~/types/utils.types'

const blogsApis = {
  createBlog(body: CreateBlogReqBody) {
    return http.post<
      SuccessResponse<{
        blog: OriginalBlog
      }>
    >('/blogs', body)
  },

  getBlogs(params?: PaginationReqParams) {
    return http.get<
      SuccessResponse<{
        blogs: BlogItem[]
        pagination: PaginationResponse
      }>
    >('/blogs', { params })
  },

  getBlog(blogId: string) {
    return http.get<
      SuccessResponse<{
        blog: BlogItem
      }>
    >(`/blogs/${blogId}`)
  },

  updateBlog({ body, blogId }: { body: CreateBlogReqBody; blogId: string }) {
    return http.put<
      SuccessResponse<{
        blog: BlogItem
      }>
    >(`/blogs/${blogId}`, body)
  },

  deleteBlogs(blogIds: string[]) {
    return http.delete<
      SuccessResponse<{
        deletedCount: number
      }>
    >('/blogs', {
      data: {
        blogIds
      }
    })
  }
} as const

export default blogsApis
