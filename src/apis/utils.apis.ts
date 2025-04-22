import http from '~/lib/http'
import { UploadImageResponse } from '~/types/utils.types'

const utilsApis = {
  uploadImage(body: FormData) {
    return http.post<UploadImageResponse>('/medias/upload-images', body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
} as const

export default utilsApis
