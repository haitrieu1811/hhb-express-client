import { z } from 'zod'

import { ProductCategoryStatus } from '~/constants/enum'
import { PRODUCTS_MESSAGES } from '~/constants/message'

export const productCategorySchema = z.object({
  name: z.string().min(1, PRODUCTS_MESSAGES.PRODUCT_CATEGORY_NAME_IS_REQUIRED),
  description: z.string().optional(),
  status: z.enum([ProductCategoryStatus.Active.toString(), ProductCategoryStatus.Inactive.toString()])
})

export const createProductCategorySchema = productCategorySchema.pick({
  name: true,
  description: true,
  status: true
})

export type CreateProductCategorySchema = z.infer<typeof createProductCategorySchema>
