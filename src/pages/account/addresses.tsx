import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Loader2, PlusCircle } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { addressesApis } from '~/apis/addresses.apis'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'
import { AddressType } from '~/constants/enum'
import { CreateAddressSchema, createAddressSchema } from '~/rules/addresses.rules'

export default function AccountAddressesPage() {
  const [isOpenCreateAddressDialog, setIsOpenCreateAddressDialog] = React.useState<boolean>(false)

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
    }
  })

  const provinceId = form.watch('provinceId')
  const districtId = form.watch('districtId')

  console.log(form.watch())

  const getProvincesQuery = useQuery({
    queryKey: ['get-provinces'],
    queryFn: () => addressesApis.getProvinces(),
    enabled: isOpenCreateAddressDialog,
    staleTime: 10000
  })

  const provinces = React.useMemo(
    () => getProvincesQuery.data?.data.data.provinces ?? [],
    [getProvincesQuery.data?.data.data.provinces]
  )

  const getDistrictsQuery = useQuery({
    queryKey: ['get-districts', provinceId],
    queryFn: () => addressesApis.getDistricts(provinceId),
    enabled: !!provinceId
  })

  const districts = React.useMemo(
    () => getDistrictsQuery.data?.data.data.districts ?? [],
    [getDistrictsQuery.data?.data.data.districts]
  )

  const getWardsQuery = useQuery({
    queryKey: ['get-wards', { provinceId, districtId }],
    queryFn: () => addressesApis.getWards({ provinceId, districtId }),
    enabled: !!(provinceId && districtId)
  })

  const wards = React.useMemo(() => getWardsQuery.data?.data.data.wards ?? [], [getWardsQuery.data?.data.data.wards])

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
      setIsOpenCreateAddressDialog(false)
    }
  })

  const handleSubmit = form.handleSubmit((data) => {
    createAddressMutation.mutate({
      ...data,
      type: Number(data.type)
    })
  })

  return (
    <Card className='rounded-md'>
      <CardHeader>
        <CardTitle className='text-lg'>Địa chỉ của tôi</CardTitle>
        <CardDescription>
          Đảm bảo địa chỉ nhận hàng luôn chính xác để chúng tôi giao sản phẩm đến tay bạn
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex justify-end'>
          <Button size='sm' variant='outline' onClick={() => setIsOpenCreateAddressDialog(true)}>
            <PlusCircle className='size-4' />
            Thêm địa chỉ mới
          </Button>
          <Dialog open={isOpenCreateAddressDialog} onOpenChange={setIsOpenCreateAddressDialog}>
            <DialogContent className='max-h-[90vh] overflow-y-auto'>
              <DialogHeader>
                <DialogTitle>Thêm địa chỉ mới</DialogTitle>
                <DialogDescription>Đảm bảo địa chỉ nhận hàng luôn chính xác</DialogDescription>
              </DialogHeader>
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
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                          <FormDescription>Nhập số nhà, tên đường.</FormDescription>
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
                    <Button type='submit'>
                      {createAddressMutation.isPending && <Loader2 className='size-4 animate-spin' />}
                      Thêm địa chỉ mới
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}
