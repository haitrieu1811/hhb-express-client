export type SuccessResponse<Data> = {
  message: string
  data: Data
}

export type ErrorResponse<Errors> = {
  message: string
  errors: Errors
}

export type OnlyMessageResponse = {
  message: string
}

export type PaginationReqParams = {
  page?: string
  limit?: string
}

export type PaginationResponse = {
  page: number
  limit: number
  totalRows: number
  totalPages: number
}
