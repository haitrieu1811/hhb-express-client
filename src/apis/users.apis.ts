import { UserRole } from '~/constants/enum'
import { getRefreshTokenFromStorage } from '~/lib/auth'
import http from '~/lib/http'
import { AuthResponse, BasicUser, User } from '~/types/users.types'
import { OnlyMessageResponse, PaginationReqParams, PaginationResponse, SuccessResponse } from '~/types/utils.types'

export const REGISTER_ENDPOINT = '/users/register'
export const LOGIN_ENDPOINT = '/users/login'
export const LOGOUT_ENDPOINT = '/users/logout'
export const RESET_PASSWORD_ENDPOINT = '/users/reset-password'
export const REFRESH_TOKEN_ENDPOINT = '/users/refresh-token'
export const UPDATE_ME_ENDPOINT = '/users/me'

const usersApis = {
  register(body: { email: string; password: string; confirmPassword: string; role: UserRole }) {
    return http.post<AuthResponse>(REGISTER_ENDPOINT, body)
  },

  login(body: { email: string; password: string }) {
    return http.post<AuthResponse>(LOGIN_ENDPOINT, body)
  },

  logout() {
    const refreshToken = getRefreshTokenFromStorage()
    return http.post<OnlyMessageResponse>(LOGOUT_ENDPOINT, { refreshToken })
  },

  forgotPassword(email: string) {
    return http.post<OnlyMessageResponse>('/users/forgot-password', { email })
  },

  resetPassword(body: { forgotPasswordToken: string; password: string; confirmPassword: string }) {
    return http.post<AuthResponse>(RESET_PASSWORD_ENDPOINT, body)
  },

  getAllUsers(params?: PaginationReqParams) {
    return http.get<
      SuccessResponse<{
        users: BasicUser[]
        pagination: PaginationResponse
      }>
    >('/users/all', { params })
  },

  getMe() {
    return http.get<
      SuccessResponse<{
        user: User
      }>
    >('/users/me')
  },

  updateMe(body: { fullName: string; avatar?: string | null }) {
    return http.put<
      SuccessResponse<{
        user: User
      }>
    >(UPDATE_ME_ENDPOINT, body)
  },

  changePassword(body: { oldPassword: string; password: string; confirmPassword: string }) {
    return http.post<OnlyMessageResponse>('/users/change-password', body)
  }
} as const

export default usersApis
