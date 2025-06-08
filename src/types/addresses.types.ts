import { AddressType } from '~/constants/enum'

export type ProvinceItem = {
  _id: string
  code: string
  name: string
}

export type DistrictItem = {
  id: string
  name: string
}

export type WardItem = {
  id: string
  name: string
  prefix: string
}

export type AddressItem = {
  _id: string
  fullName: string
  phoneNumber: string
  province: {
    _id: string
    code: string
    name: string
  }
  district: {
    id: string
    name: string
  }
  ward: {
    id: string
    name: string
    prefix: string
  }
  detail: string
  type: AddressType
  isDefault: boolean
  createdAt: string
  updatedAt: string
}
