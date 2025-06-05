import { z } from 'zod'

import { AddressType } from '~/constants/enum'
import { PHONE_NUMBER_REGEX } from '~/constants/regex'

export const createAddressSchema = z.object({
  fullName: z.string().min(1, 'Tên người nhận hàng là bắt buộc,'),
  phoneNumber: z
    .string()
    .min(1, 'Số điện thoại nhận hàng là bắt buộc.')
    .regex(PHONE_NUMBER_REGEX, 'Số điện thoại không hợp lệ.'),
  provinceId: z.string().min(1, 'Hãy chọn tỉnh/thành.'),
  districtId: z.string().min(1, 'Hãy chọn quận/huyện.'),
  wardId: z.string().min(1, 'Hãy chọn phường/xã.'),
  detail: z.string().min(1, 'Địa chỉ cụ thể là bắt buộc.'),
  type: z.enum([AddressType.Home.toString(), AddressType.Office.toString()])
})

export type CreateAddressSchema = z.infer<typeof createAddressSchema>
