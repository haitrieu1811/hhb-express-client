import { UserRole } from '~/constants/enum'
import { SuccessResponse } from '~/types/utils.types'

export type BasicUser = {
  _id: string
  email: string
  fullName: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

export type AuthResponse = SuccessResponse<{
  accessToken: string
  refreshToken: string
  user: BasicUser
}>
