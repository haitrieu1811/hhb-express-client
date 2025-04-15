import { UserRole } from '~/constants/enum'
import { getRefreshTokenFromStorage } from '~/lib/auth'
import http from '~/lib/http'
import { AuthResponse } from '~/types/users.types'
import { OnlyMessageResponse } from '~/types/utils.types'

export const REGISTER_ENDPOINT = '/users/register'
export const LOGIN_ENDPOINT = '/users/login'
export const LOGOUT_ENDPOINT = '/users/logout'

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
  }
} as const

export default usersApis
