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
