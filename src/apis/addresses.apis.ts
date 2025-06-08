import { AddressType } from '~/constants/enum'
import http from '~/lib/http'
import { AddressItem, DistrictItem, ProvinceItem, WardItem } from '~/types/addresses.types'
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
  },

  getMyAddresses() {
    return http.get<
      SuccessResponse<{
        addresses: AddressItem[]
      }>
    >('/addresses/me')
  },

  getAddress(addressId: string) {
    return http.get<
      SuccessResponse<{
        address: AddressItem
      }>
    >(`/addresses/${addressId}`)
  },

  updateAddress({ body, addressId }: { body: CreateAddressReqBody; addressId: string }) {
    return http.put<
      SuccessResponse<{
        address: AddressItem
      }>
    >(`/addresses/${addressId}`, body)
  },

  deleteAddress(addressId: string) {
    return http.delete<OnlyMessageResponse>(`/addresses/${addressId}`)
  },

  setDefaultAddress(addressId: string) {
    return http.post<OnlyMessageResponse>(`/addresses/${addressId}/set-default`)
  }
} as const
