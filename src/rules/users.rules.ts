import { z } from 'zod'

import { USERS_MESSAGES } from '~/constants/message'

export const userSchema = z.object({
  email: z.string().email(USERS_MESSAGES.EMAIL_IS_INVALID),
  password: z.string().min(8, USERS_MESSAGES.PASSWORD_LENGTH_INVALID).max(32, USERS_MESSAGES.PASSWORD_LENGTH_INVALID),
  confirmPassword: z.string().min(1, USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED),
  fullName: z
    .string()
    .min(1, USERS_MESSAGES.FULLNAME_LENGTH_IS_INVALID)
    .max(50, USERS_MESSAGES.FULLNAME_LENGTH_IS_INVALID)
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

export const loginSchema = userSchema.pick({
  email: true,
  password: true
})

export const forgotPasswordSchema = userSchema.pick({
  email: true
})

export const resetPasswordSchema = userSchema
  .pick({
    password: true,
    confirmPassword: true
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

export const updateMeSchema = userSchema.pick({
  email: true,
  fullName: true
})

export const changePasswordSchema = userSchema
  .pick({
    password: true,
    confirmPassword: true
  })
  .extend({
    oldPassword: z.string().min(1, USERS_MESSAGES.OLD_PASSWORD_IS_REQUIRED)
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: USERS_MESSAGES.CONFIRM_PASSWORD_IS_NOT_MATCH
      })
    }
  })

export type RegisterSchema = z.infer<typeof registerSchema>
export type LoginSchema = z.infer<typeof loginSchema>
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>
export type UpdateMeSchema = z.infer<typeof updateMeSchema>
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>
