import { AddressType, OrderStatus } from '~/constants/enum'

export type CreateOrderReqBody = {
  items: string[]
  totalItems: number
  totalAmount: number
  note?: string
  addressId: string
}

export type ProductInOrder = {
  _id: string
  thumbnail: {
    _id: string
    url: string
  }
  name: string
  price: number
  priceAfterDiscount: number
  status: number
  approvalStatus: number
  createdAt: string
  updatedAt: string
  category: {
    _id: string
    name: string
    createdAt: string
    updatedAt: string
  }
}

export type OrderItem = {
  _id: string
  code: string
  items: {
    _id: string
    unitPrice: number
    unitPriceAfterDiscount: number
    quantity: number
    status: number
    createdAt: string
    updatedAt: string
    product: ProductInOrder
  }[]
  address: {
    _id: string
    fullName: string
    phoneNumber: string
    detail: string
    type: AddressType
    isDefault: boolean
    createdAt: string
    updatedAt: string
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
  }
  totalItems: number
  totalAmount: number
  note: string
  status: OrderStatus
  orderedAt: string | null
  confirmedAt: string | null
  shippedAt: string | null
  succeededAt: string | null
  canceledAt: string | null
  createdAt: string
  updatedAt: string
}
