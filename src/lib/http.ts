import axios, { AxiosInstance } from 'axios'

import { LOGIN_ENDPOINT, LOGOUT_ENDPOINT, REGISTER_ENDPOINT } from '~/apis/users.apis'
import {
  clearAuthStorage,
  getAccessTokenFromStorage,
  getProfileFromStorage,
  getRefreshTokenFromStorage,
  setAccessTokenToStorage,
  setProfileToStorage,
  setRefreshTokenToStorage
} from '~/lib/auth'
import { AuthResponse, BasicUser } from '~/types/users.types'

class Http {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  private profile: BasicUser | null

  constructor() {
    this.accessToken = getAccessTokenFromStorage()
    this.refreshToken = getRefreshTokenFromStorage()
    this.profile = getProfileFromStorage()
    this.instance = axios.create({
      baseURL: 'http://localhost:4000',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.instance.interceptors.request.use(
      (config) => {
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url && [REGISTER_ENDPOINT, LOGIN_ENDPOINT].includes(url)) {
          const { accessToken, refreshToken, user } = (response.data as AuthResponse).data
          setAccessTokenToStorage(accessToken)
          setRefreshTokenToStorage(refreshToken)
          setProfileToStorage(user)
          this.accessToken = accessToken
          this.refreshToken = refreshToken
          this.profile = user
        } else if (url && url === LOGOUT_ENDPOINT) {
          clearAuthStorage()
          this.accessToken = ''
          this.refreshToken = ''
          this.profile = null
        }
        return response
      },
      (error) => {
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance
export default http
