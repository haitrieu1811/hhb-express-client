/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'

import ordersApis from '~/apis/orders.apis'
import { OnlyMessageResponse } from '~/types/utils.types'

type UseUpdateOrderProps = {
  onSuccess?: (data: AxiosResponse<OnlyMessageResponse, any>) => void
}

export default function useUpdateOrder({ onSuccess }: UseUpdateOrderProps) {
  const updateOrderMutation = useMutation({
    mutationKey: ['update-order'],
    mutationFn: ordersApis.updateOrder,
    onSuccess: (data) => {
      onSuccess && onSuccess(data)
    }
  })

  return {
    updateOrderMutation
  }
}
