import { z } from 'zod'

import { PRODUCTS_MESSAGES } from '~/constants/message'

export const productCategorySchema = z.object({
  name: z.string().min(1, PRODUCTS_MESSAGES.PRODUCT_CATEGORY_NAME_IS_REQUIRED),
  description: z.string().optional()
})

export const createProductCategorySchema = productCategorySchema.pick({
  name: true,
  description: true
})

export type CreateProductCategorySchema = z.infer<typeof createProductCategorySchema>
