import { UserRole, UserStatus, UserVerifyStatus } from '~/constants/enum'
import { SuccessResponse } from '~/types/utils.types'

export type BasicUser = {
  _id: string
  email: string
  fullName: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

export type User = {
  _id: string
  email: string
  fullName: string
  avatar: string
  avatarId: string
  status: UserStatus
  verifyStatus: UserVerifyStatus
  createdAt: string
  updatedAt: string
}

export type AuthResponse = SuccessResponse<{
  accessToken: string
  refreshToken: string
  user: User
}>
