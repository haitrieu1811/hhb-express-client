import { AddressType } from '~/constants/enum'
import http from '~/lib/http'
import { DistrictItem, ProvinceItem, WardItem } from '~/types/addresses.types'
import { OnlyMessageResponse, SuccessResponse } from '~/types/utils.types'

type CreateAddressReqBody = {
  fullName: string
  phoneNumber: string
  provinceId: string
  districtId: string
  wardId: string
  detail: string
  type: AddressType
}

export const addressesApis = {
  getProvinces() {
    return http.get<
      SuccessResponse<{
        provinces: ProvinceItem[]
        totalProvinces: number
      }>
    >('/provinces')
  },

  getDistricts(provinceId: string) {
    return http.get<
      SuccessResponse<{
        districts: DistrictItem[]
        totalDistricts: number
      }>
    >(`/provinces/${provinceId}/districts`)
  },

  getWards({ provinceId, districtId }: { provinceId: string; districtId: string }) {
    return http.get<
      SuccessResponse<{
        wards: WardItem[]
        totalWards: number
      }>
    >(`/provinces/${provinceId}/districts/${districtId}/wards`)
  },

  createAddress(body: CreateAddressReqBody) {
    return http.post<OnlyMessageResponse>('/addresses', body)
  }
} as const
