import { UserRole } from '~/constants/enum'
import http from '~/lib/http'
import { AuthResponse } from '~/types/users.types'

export const REGISTER_ENDPOINT = '/users/register'

const usersApis = {
  register(body: { email: string; password: string; confirmPassword: string; role: UserRole }) {
    return http.post<AuthResponse>(REGISTER_ENDPOINT, body)
  }
} as const

export default usersApis
