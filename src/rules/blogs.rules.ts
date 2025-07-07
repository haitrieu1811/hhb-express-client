import { z } from 'zod'

import { BlogStatus } from '~/constants/enum'
import { BLOGS_MESSAGE } from '~/constants/message'
import { NUMBER_REGEX } from '~/constants/regex'

export const blogSchema = z.object({
  title: z.string().min(1, BLOGS_MESSAGE.BLOG_TITLE_IS_REQUIRED),
  content: z.string().min(1, BLOGS_MESSAGE.BLOG_CONTENT_IS_REQUIRED),
  status: z.enum([BlogStatus.Active.toString(), BlogStatus.Inactive.toString()]),
  order: z.string().regex(NUMBER_REGEX, BLOGS_MESSAGE.BLOG_ORDER_MUST_BE_A_INT)
})

export const createBlogSchema = blogSchema.pick({
  title: true,
  content: true,
  status: true,
  order: true
})

export type CreateBlogSchema = z.infer<typeof createBlogSchema>
