import { SuccessResponse } from '~/types/utils.types'

export type BasicUser = {
  _id: string
  email: string
  fullName: string
  createdAt: string
  updatedAt: string
}

export type AuthResponse = SuccessResponse<{
  accessToken: string
  refreshToken: string
  user: BasicUser
}>
