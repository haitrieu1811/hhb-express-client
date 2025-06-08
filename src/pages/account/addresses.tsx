import { useMutation, useQuery } from '@tanstack/react-query'
import { Loader2, PlusCircle } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

import { addressesApis } from '~/apis/addresses.apis'
import CreateAddressForm from '~/components/forms/create-address'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Separator } from '~/components/ui/separator'
import { AddressType } from '~/constants/enum'
import { AppContext } from '~/providers/app.provider'

export default function AccountAddressesPage() {
  const { isAuthenticated } = React.useContext(AppContext)

  const [isOpenCreateAddressDialog, setIsOpenCreateAddressDialog] = React.useState<boolean>(false)
  const [currentAddressId, setCurrentAddressId] = React.useState<string | null>(null)

  const getMyAddressesQuery = useQuery({
    queryKey: ['get-my-addresses'],
    queryFn: () => addressesApis.getMyAddresses(),
    enabled: isAuthenticated
  })

  const addresses = React.useMemo(
    () => getMyAddressesQuery.data?.data.data.addresses ?? [],
    [getMyAddressesQuery.data?.data.data.addresses]
  )

  const getAddressQuery = useQuery({
    queryKey: ['get-address', currentAddressId],
    queryFn: () => addressesApis.getAddress(currentAddressId as string),
    enabled: !!currentAddressId
  })

  const address = React.useMemo(
    () => getAddressQuery.data?.data.data.address,
    [getAddressQuery.data?.data.data.address]
  )

  const deleteAddressMutation = useMutation({
    mutationKey: ['delete-address'],
    mutationFn: addressesApis.deleteAddress,
    onSuccess: (data) => {
      toast.success(data.data.message)
      getMyAddressesQuery.refetch()
    }
  })

  const setDefaultAddressMutation = useMutation({
    mutationKey: ['set-default-address'],
    mutationFn: addressesApis.setDefaultAddress,
    onSuccess: (data) => {
      toast.success(data.data.message)
      getMyAddressesQuery.refetch()
    }
  })

  return (
    <React.Fragment>
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
          </div>
          {/* Danh sách địa chỉ */}
          <div className='mt-10'>
            {addresses.map((address, index) => (
              <React.Fragment key={address._id}>
                {index > 0 && <Separator className='my-6' />}
                <div className='flex justify-between items-center'>
                  <div className='text-sm space-y-2'>
                    <div className='flex items-center space-x-2'>
                      <div className='font-medium'>{address.fullName}</div>
                      <Separator orientation='vertical' className='' />
                      <div className='text-muted-foreground'>{address.phoneNumber}</div>
                    </div>
                    <div className='text-muted-foreground'>
                      {address.detail} {address.ward.prefix} {address.ward.name}, {address.district.name},{' '}
                      {address.province.name}
                    </div>
                    <div className='flex space-x-1'>
                      {address.isDefault && <Badge>Mặc định</Badge>}
                      <Badge variant='outline'>{address.type === AddressType.Home ? 'Nhà riêng' : 'Cơ quan'}</Badge>
                    </div>
                  </div>
                  <div className='space-y-2 flex flex-col items-center'>
                    <div className='flex items-center'>
                      <Button variant='link' size='sm' onClick={() => setCurrentAddressId(address._id)}>
                        Cập nhật
                      </Button>
                      <Button
                        variant='link'
                        size='sm'
                        disabled={deleteAddressMutation.isPending}
                        onClick={() => deleteAddressMutation.mutate(address._id)}
                      >
                        {deleteAddressMutation.isPending && <Loader2 className='size-3 animate-spin' />}
                        Xóa
                      </Button>
                    </div>
                    <Button
                      variant='outline'
                      size='sm'
                      disabled={setDefaultAddressMutation.isPending}
                      onClick={() => setDefaultAddressMutation.mutate(address._id)}
                    >
                      {setDefaultAddressMutation.isPending && <Loader2 className='size-4 animate-spin' />}
                      Thiết lập mặc định
                    </Button>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* Thêm địa chỉ mới */}
      <Dialog open={isOpenCreateAddressDialog} onOpenChange={setIsOpenCreateAddressDialog}>
        <DialogContent className='max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Thêm địa chỉ mới</DialogTitle>
            <DialogDescription>Đảm bảo địa chỉ nhận hàng luôn chính xác</DialogDescription>
          </DialogHeader>
          <CreateAddressForm
            enabledGetProvinces={isOpenCreateAddressDialog}
            onCreateSuccess={() => {
              setIsOpenCreateAddressDialog(false)
              getMyAddressesQuery.refetch()
            }}
          />
        </DialogContent>
      </Dialog>
      {/* Cập nhật địa chỉ */}
      <Dialog
        open={!!currentAddressId}
        onOpenChange={(value) => {
          if (!value) {
            setCurrentAddressId(null)
          }
        }}
      >
        <DialogContent className='max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Cập nhật địa chỉ</DialogTitle>
            <DialogDescription>Đảm bảo địa chỉ nhận hàng luôn chính xác</DialogDescription>
          </DialogHeader>
          {address && (
            <CreateAddressForm
              enabledGetProvinces={!!currentAddressId}
              addressData={address}
              onCreateSuccess={() => {
                setCurrentAddressId(null)
                getMyAddressesQuery.refetch()
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}
