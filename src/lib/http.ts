import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { toast } from 'sonner'

import {
  LOGIN_ENDPOINT,
  LOGOUT_ENDPOINT,
  REFRESH_TOKEN_ENDPOINT,
  REGISTER_ENDPOINT,
  RESET_PASSWORD_ENDPOINT,
  UPDATE_ME_ENDPOINT
} from '~/apis/users.apis'
import {
  clearAuthStorage,
  getAccessTokenFromStorage,
  getProfileFromStorage,
  getRefreshTokenFromStorage,
  setAccessTokenToStorage,
  setProfileToStorage,
  setRefreshTokenToStorage
} from '~/lib/auth'
import { isExpiredTokenError, isUnauthorizedError } from '~/lib/utils'
import { AuthResponse, User } from '~/types/users.types'
import { ErrorResponse, SuccessResponse } from '~/types/utils.types'

class Http {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  private profile: User | null
  private refreshTokenRequest: Promise<string> | null

  constructor() {
    this.accessToken = getAccessTokenFromStorage()
    this.refreshToken = getRefreshTokenFromStorage()
    this.profile = getProfileFromStorage()
    this.refreshTokenRequest = null
    this.instance = axios.create({
      baseURL: 'http://localhost:4000',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.instance.interceptors.request.use(
      (config) => {
        // Thêm access token vào request
        if (this.accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${this.accessToken}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      (response) => {
        const { url, method } = response.config
        if (url && [REGISTER_ENDPOINT, LOGIN_ENDPOINT, RESET_PASSWORD_ENDPOINT].includes(url)) {
          const { accessToken, refreshToken, user } = (response.data as AuthResponse).data
          setAccessTokenToStorage(accessToken)
          setRefreshTokenToStorage(refreshToken)
          setProfileToStorage(user)
          this.accessToken = accessToken
          this.refreshToken = refreshToken
          this.profile = user
        } else if (url && url === UPDATE_ME_ENDPOINT && method === 'put') {
          const { user } = (response.data as SuccessResponse<{ user: User }>).data
          this.profile = user
          setProfileToStorage(user)
        } else if (url && url === LOGOUT_ENDPOINT) {
          clearAuthStorage()
          this.accessToken = ''
          this.refreshToken = ''
          this.profile = null
        }
        return response
      },
      async (error) => {
        // Xử lý lỗi 401 (Sai, thiếu hoặc hết hạn access token)
        if (isUnauthorizedError<ErrorResponse<{ name: string; message: string }>>(error)) {
          const config = error.response?.config || ({ headers: {} } as InternalAxiosRequestConfig)
          const { url } = config
          // Xử lý khi hết hạn token
          if (isExpiredTokenError(error) && url !== REFRESH_TOKEN_ENDPOINT) {
            this.refreshTokenRequest = this.refreshTokenRequest
              ? this.refreshTokenRequest
              : this.handleRefreshToken().finally(() => {
                  setTimeout(() => {
                    this.refreshTokenRequest = null
                  }, 10000)
                })
            return this.refreshTokenRequest.then((access_token) => {
              config.headers.Authorization = `Bearer ${access_token}`
              // Tiếp tục request cũ nếu bị lỗi
              return this.instance({
                ...config,
                headers: {
                  ...config.headers,
                  Authorization: `Bearer ${access_token}`
                }
              })
            })
          }
          clearAuthStorage()
          this.accessToken = ''
          this.refreshToken = ''
          this.profile = null
          toast.error(error.response?.data.errors?.message || error.response?.data.errors.message)
        }

        return Promise.reject(error)
      }
    )
  }

  // Xử lý refresh token
  private handleRefreshToken = async () => {
    return this.instance
      .post<Omit<AuthResponse, 'user'>>(REFRESH_TOKEN_ENDPOINT, { refreshToken: this.refreshToken })
      .then((res) => {
        const { accessToken, refreshToken } = res.data.data
        setAccessTokenToStorage(accessToken)
        setRefreshTokenToStorage(refreshToken)
        this.accessToken = accessToken
        this.refreshToken = refreshToken
        return accessToken
      })
      .catch((err) => {
        clearAuthStorage()
        this.accessToken = ''
        this.refreshToken = ''
        throw err
      })
  }
}

const http = new Http().instance
export default http
