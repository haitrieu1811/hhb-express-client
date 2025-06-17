import { OrderStatus } from '~/constants/enum'
import http from '~/lib/http'
import { CreateOrderReqBody, OrderItem } from '~/types/orders.types'
import { OnlyMessageResponse, PaginationReqParams, PaginationResponse, SuccessResponse } from '~/types/utils.types'

const ordersApis = {
  createOrder(body: CreateOrderReqBody) {
    return http.post<OnlyMessageResponse>('/orders', body)
  },

  getMyOrders(params?: PaginationReqParams) {
    return http.get<
      SuccessResponse<{
        orders: OrderItem[]
        pagination: PaginationResponse
      }>
    >('/orders/me', { params })
  },

  getOrder(orderId: string) {
    return http.get<
      SuccessResponse<{
        order: OrderItem
      }>
    >(`/orders/${orderId}`)
  },

  updateOrder({ orderId, status }: { orderId: string; status: OrderStatus }) {
    return http.put<OnlyMessageResponse>(`/orders/${orderId}`, { status })
  }
} as const

export default ordersApis
