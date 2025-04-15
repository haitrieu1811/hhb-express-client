import { BasicUser } from '~/types/users.types'

export const localStorageEventTarget = new EventTarget()

export const getAccessTokenFromStorage = () => {
  return localStorage.getItem('accessToken') || ''
}

export const getRefreshTokenFromStorage = () => {
  return localStorage.getItem('refreshToken') || ''
}

export const setAccessTokenToStorage = (accessToken: string) => {
  localStorage.setItem('accessToken', accessToken)
}

export const setRefreshTokenToStorage = (refreshToken: string) => {
  localStorage.setItem('refreshToken', refreshToken)
}

export const clearAuthStorage = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('profile')
  const clearAuthLSEvent = new Event('clearAuthLS')
  localStorageEventTarget.dispatchEvent(clearAuthLSEvent)
}

export const getProfileFromStorage = (): BasicUser | null => {
  const profile = localStorage.getItem('profile')
  return profile ? JSON.parse(profile) : null
}

export const setProfileToStorage = (profile: BasicUser) => {
  localStorage.setItem('profile', JSON.stringify(profile))
}
