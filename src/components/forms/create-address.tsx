/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { Loader2 } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { addressesApis } from '~/apis/addresses.apis'
import { Button } from '~/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'
import { AddressType } from '~/constants/enum'
import useLocation from '~/hooks/use-location'
import { CreateAddressSchema, createAddressSchema } from '~/rules/addresses.rules'
import { AddressItem } from '~/types/addresses.types'
import { OnlyMessageResponse, SuccessResponse } from '~/types/utils.types'

type CreateAddressFormProps = {
  enabledGetProvinces?: boolean
  addressData?: AddressItem
  onCreateSuccess?: (data: AxiosResponse<OnlyMessageResponse, any>) => void
  onUpdateSuccess?: (
    data: AxiosResponse<
      SuccessResponse<{
        address: AddressItem
      }>,
      any
    >
  ) => void
}

export default function CreateAddressForm({
  enabledGetProvinces = false,
  addressData,
  onCreateSuccess,
  onUpdateSuccess
}: CreateAddressFormProps) {
  const isUpdateMode = !!addressData

  const form = useForm<CreateAddressSchema>({
    resolver: zodResolver(createAddressSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      detail: '',
      provinceId: '',
      districtId: '',
      wardId: '',
      type: AddressType.Home.toString()
    },
    values: {
      fullName: addressData?.fullName ?? '',
      phoneNumber: addressData?.phoneNumber ?? '',
      provinceId: addressData?.province._id ?? '',
      districtId: addressData?.district.id ?? '',
      wardId: addressData?.ward.id ?? '',
      detail: addressData?.detail ?? '',
      type: addressData?.type.toString() ?? AddressType.Home.toString()
    }
  })

  const provinceId = form.watch('provinceId')
  const districtId = form.watch('districtId')

  const { provinces, districts, wards } = useLocation({
    enabledGetProvinces,
    districtId,
    provinceId
  })

  React.useEffect(() => {
    form.setValue('districtId', '')
    form.setValue('wardId', '')
  }, [form, provinceId])

  React.useEffect(() => {
    form.setValue('wardId', '')
  }, [form, districtId])

  const createAddressMutation = useMutation({
    mutationKey: ['create-address'],
    mutationFn: addressesApis.createAddress,
    onSuccess: (data) => {
      toast.success(data.data.message)
      form.reset()
      onCreateSuccess && onCreateSuccess(data)
    }
  })

  const updateAddressMutation = useMutation({
    mutationKey: ['update-address'],
    mutationFn: addressesApis.updateAddress,
    onSuccess: (data) => {
      toast.success(data.data.message)
      onUpdateSuccess && onUpdateSuccess(data)
    }
  })

  const isPending = createAddressMutation.isPending || updateAddressMutation.isPending

  const handleSubmit = form.handleSubmit((data) => {
    const body = {
      ...data,
      type: Number(data.type)
    }
    if (!isUpdateMode) {
      createAddressMutation.mutate(body)
      return
    }
    updateAddressMutation.mutate({
      body,
      addressId: addressData._id
    })
  })

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <div className='grid gap-8 pt-4'>
          <div className='grid grid-cols-12 gap-4'>
            <div className='col-span-6'>
              {/* Họ tên */}
              <FormField
                control={form.control}
                name='fullName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ tên</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='col-span-6'>
              {/* Số điện thoại */}
              <FormField
                control={form.control}
                name='phoneNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* Tình/thành */}
          <FormField
            control={form.control}
            name='provinceId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tỉnh/thành</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Chọn tỉnh/thành' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {provinces.map((province) => (
                      <SelectItem key={province._id} value={province._id}>
                        {province.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Quận/huyện */}
          <FormField
            control={form.control}
            name='districtId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quận/huyện</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Chọn quận/huyện' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {districts.map((district) => (
                      <SelectItem key={district.id} value={district.id}>
                        {district.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Phường/xã */}
          <FormField
            control={form.control}
            name='wardId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phường/xã</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Chọn phường/xã' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {wards.map((ward) => (
                      <SelectItem key={ward.id} value={ward.id}>
                        {ward.prefix} {ward.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Địa chỉ cụ thể */}
          <FormField
            control={form.control}
            name='detail'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Địa chỉ cụ thể</FormLabel>
                <FormControl>
                  <Textarea className='min-h-26 resize-none' {...field} />
                </FormControl>
                <FormDescription>Bạn nên nhập số nhà, tên đường.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Loại địa chỉ */}
          <FormField
            control={form.control}
            name='type'
            render={({ field }) => (
              <FormItem className='space-y-3'>
                <FormLabel>Loại địa chỉ</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                    className='flex flex-col'
                  >
                    <FormItem className='flex items-center gap-3'>
                      <FormControl>
                        <RadioGroupItem value={AddressType.Home.toString()} />
                      </FormControl>
                      <FormLabel className='font-normal'>Nhà riêng</FormLabel>
                    </FormItem>
                    <FormItem className='flex items-center gap-3'>
                      <FormControl>
                        <RadioGroupItem value={AddressType.Office.toString()} />
                      </FormControl>
                      <FormLabel className='font-normal'>Cơ quan</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' disabled={isPending}>
            {isPending && <Loader2 className='size-4 animate-spin' />}
            {!isUpdateMode ? 'Thêm địa chỉ mới' : 'Cập nhật địa chỉ'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
