import { z } from 'zod'

import { USERS_MESSAGES } from '~/constants/message'

export const userSchema = z.object({
  email: z.string().email(USERS_MESSAGES.EMAIL_IS_INVALID),
  password: z.string().min(8, USERS_MESSAGES.PASSWORD_LENGTH_INVALID).max(32, USERS_MESSAGES.PASSWORD_LENGTH_INVALID)
})

export const registerSchema = userSchema
  .pick({
    email: true,
    password: true
  })
  .extend({
    confirmPassword: z.string().min(1, USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED)
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: USERS_MESSAGES.CONFIRM_PASSWORD_IS_NOT_MATCH,
        path: ['confirmPassword']
      })
    }
  })

export type RegisterSchema = z.infer<typeof registerSchema>
