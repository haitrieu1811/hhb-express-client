import { z } from 'zod'

import { ProductStatus } from '~/constants/enum'
import { PRODUCTS_MESSAGES } from '~/constants/message'
import { INTEGER_GREATER_THAN_ZERO_REGEX } from '~/constants/regex'

export const productSchema = z.object({
  name: z
    .string()
    .min(10, PRODUCTS_MESSAGES.PRODUCT_NAME_LENGTH_IS_INVALID)
    .max(120, PRODUCTS_MESSAGES.PRODUCT_NAME_LENGTH_IS_INVALID),
  description: z.string().min(100, PRODUCTS_MESSAGES.PRODUCT_DESCRIPTION_LENGTH_IS_INVALID),
  price: z
    .string()
    .regex(INTEGER_GREATER_THAN_ZERO_REGEX, PRODUCTS_MESSAGES.PRODUCT_PRICE_MUST_BE_A_INT_GREATER_THAN_ZERO),
  priceAfterDiscount: z
    .string()
    .regex(INTEGER_GREATER_THAN_ZERO_REGEX, PRODUCTS_MESSAGES.PRODUCT_PRICE_MUST_BE_A_INT_GREATER_THAN_ZERO),
  categoryId: z.string().min(1, PRODUCTS_MESSAGES.PRODUCT_CATEGORY_ID_IS_REQUIRED),
  status: z.enum([ProductStatus.Active.toString(), ProductStatus.Inactive.toString()])
})

export const createProductSchema = productSchema.pick({
  name: true,
  description: true,
  price: true,
  priceAfterDiscount: true,
  categoryId: true,
  status: true
})

export type CreateProductSchema = z.infer<typeof createProductSchema>
