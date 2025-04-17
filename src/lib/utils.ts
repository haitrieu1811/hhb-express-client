import axios, { AxiosError, HttpStatusCode } from 'axios'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ErrorResponse } from '~/types/utils.types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isAxiosError = <T>(error: unknown): error is AxiosError<T> => {
  return axios.isAxiosError(error)
}

export const isEntityError = <FormErrors>(error: unknown): error is AxiosError<FormErrors> => {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}

export const isUnauthorizedError = <UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> => {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized
}

export const isExpiredTokenError = <UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> => {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  return isUnauthorizedError<ErrorResponse<{}>>(error) && error.response?.data.message === 'Jwt expired'
}

export const convertMomentFromNowToVietnamese = (momentFromNow: string) =>
  momentFromNow
    .replace('a few seconds ago', 'vài giây trước')
    .replace('seconds ago', 'giây trước')
    .replace('a minute ago', '1 phút trước')
    .replace('minutes ago', 'phút trước')
    .replace('an hour ago', '1 giờ trước')
    .replace('hours ago', 'giờ trước')
    .replace('a day ago', '1 ngày trước')
    .replace('days ago', 'ngày trước')
    .replace('a month ago', '1 tháng trước')
    .replace('months ago', 'tháng trước')
    .replace('a year ago', '1 năm trước')
    .replace('years ago', 'năm trước')
