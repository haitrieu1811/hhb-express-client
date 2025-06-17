import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, PlusCircle, TriangleAlert } from 'lucide-react'
import React from 'react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'

import ordersApis from '~/apis/orders.apis'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Button } from '~/components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import PATH from '~/constants/path'
import useMyAddresses from '~/hooks/use-my-addresses'
import { cn, formatCurrency } from '~/lib/utils'
import { AppContext } from '~/providers/app.provider'
import { AddressItem } from '~/types/addresses.types'

export default function CartOrderInfoPage() {
  const queryClient = useQueryClient()

  const navigate = useNavigate()

  const { addresses } = useMyAddresses()

  const {
    checkedCartItems,
    extendedMyCart,
    totalCheckedAmount,
    totalCartAmount,
    totalCheckedCartItems,
    totalCartItems
  } = React.useContext(AppContext)

  const [currentAddress, setCurrentAddress] = React.useState<null | AddressItem>(null)
  const [isOpenAddressesDialog, setIsOpenAddressesDialog] = React.useState<boolean>(false)
  const [note, setNote] = React.useState<string>('')

  React.useEffect(() => {
    const defaultAddress = addresses.find((address) => address.isDefault)
    if (!defaultAddress) return
    setCurrentAddress(defaultAddress)
  }, [addresses])

  const checkoutItems = React.useMemo(
    () => (checkedCartItems.length > 0 ? checkedCartItems : extendedMyCart),
    [checkedCartItems, extendedMyCart]
  )
  const totalCheckoutAmount = totalCheckedAmount > 0 ? totalCheckedAmount : totalCartAmount
  const totalCheckoutItems = totalCheckedCartItems > 0 ? totalCheckedCartItems : totalCartItems

  const handleChangeAddress = (address: AddressItem) => {
    if (address._id === currentAddress?._id) return
    setCurrentAddress(address)
    setIsOpenAddressesDialog(false)
    toast.success('Thay đổi địa chỉ nhận hàng thành công')
  }

  const createOrderMutation = useMutation({
    mutationKey: ['create-order'],
    mutationFn: ordersApis.createOrder,
    onSuccess: () => {
      navigate(PATH.CART_ORDER_SUCCESS)
      queryClient.invalidateQueries({
        queryKey: ['get-my-cart']
      })
    }
  })

  const handleOrder = () => {
    if (!currentAddress) return
    createOrderMutation.mutate({
      items: checkedCartItems.map((checkedCartItem) => checkedCartItem._id),
      totalItems: totalCheckedCartItems,
      totalAmount: totalCheckedAmount,
      note,
      addressId: currentAddress._id
    })
  }

  return (
    <div className='space-y-4'>
      <div>
        <div className='bg-[repeating-linear-gradient(45deg,#6fa6d6,#6fa6d6_33px,transparent_0,transparent_41px,#f18d9b_0,#f18d9b_74px,transparent_0,transparent_82px)] h-1' />
        <Card className='rounded-t-none'>
          <CardHeader>
            <CardTitle className='text-xl'>Địa chỉ nhận hàng</CardTitle>
            <CardAction>
              <Button variant='link' onClick={() => setIsOpenAddressesDialog(true)}>
                Thay đổi địa chỉ
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className='flex justify-between items-center space-x-10'>
              <div className='relative'>
                <div className='text-muted-foreground'>Người nhận hàng:</div>
                <div className='flex items-center space-x-2 font-medium'>
                  <div>{currentAddress?.fullName}</div>
                  <div className='w-[1px] h-3 bg-muted-foreground' />
                  <div className='text-sm'>{currentAddress?.phoneNumber}</div>
                </div>
              </div>
              <div className='text-center'>
                <div className='text-muted-foreground'>Giao tới:</div>
                <div className='font-medium'>
                  {currentAddress?.detail}, {currentAddress?.ward.prefix} {currentAddress?.ward.name},{' '}
                  {currentAddress?.district.name}, {currentAddress?.province.name}
                </div>
              </div>
              <Dialog open={isOpenAddressesDialog} onOpenChange={setIsOpenAddressesDialog}>
                <DialogContent className='max-h-[90vh] overflow-y-auto'>
                  <DialogHeader>
                    <DialogTitle>Thay đổi địa chỉ nhận hàng</DialogTitle>
                  </DialogHeader>
                  <div className='space-y-4'>
                    {addresses.map((address) => (
                      <div
                        key={address._id}
                        className={cn('space-y-2 border  rounded-md p-4 hover:cursor-pointer', {
                          'border-transparent': address._id !== currentAddress?._id,
                          'border-blue-500': address._id === currentAddress?._id
                        })}
                        onClick={() => handleChangeAddress(address)}
                      >
                        <div className='flex items-center space-x-4 text-sm font-medium'>
                          <div>{address.fullName}</div>
                          <div>{address.phoneNumber}</div>
                        </div>
                        <div className='text-sm text-muted-foreground'>
                          {address?.detail}, {address?.ward.prefix} {address?.ward.name}, {address?.district.name},{' '}
                          {address?.province.name}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant='outline'>
                    <PlusCircle className='size-4' />
                    Thêm địa chỉ mới
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sản phẩm</TableHead>
                <TableHead>Đơn giá</TableHead>
                <TableHead className='text-center'>Số lượng</TableHead>
                <TableHead className='text-right'>Thành tiền</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {checkoutItems.map((checkoutItem) => (
                <TableRow key={checkoutItem._id}>
                  <TableCell>
                    <Link
                      to={PATH.PRODUCT_DETAIL({
                        name: checkoutItem.product.name,
                        id: checkoutItem.product._id
                      })}
                      className='flex items-center space-x-4 hover:underline'
                    >
                      <img
                        src={checkoutItem.product.thumbnail}
                        alt={checkoutItem.product.name}
                        className='size-16 rounded-md object-cover shrink-0'
                      />
                      <span className='flex-1 text-sm font-medium'>{checkoutItem.product.name}</span>
                    </Link>
                  </TableCell>
                  <TableCell>{formatCurrency(checkoutItem.unitPriceAfterDiscount)}&#8363;</TableCell>
                  <TableCell className='text-center'>{checkoutItem.quantity}</TableCell>
                  <TableCell className='font-semibold text-right'>
                    {formatCurrency(checkoutItem.unitPriceAfterDiscount * checkoutItem.quantity)}&#8363;
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className='flex items-center justify-between space-x-10'>
            <div className='space-y-4'>
              <div className='space-y-3'>
                <Label>Lời nhắn</Label>
                <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder='Lưu ý cho người bán' />
              </div>
              <Alert className='text-yellow-600'>
                <TriangleAlert />
                <AlertTitle>Lưu ý!</AlertTitle>
                <AlertDescription className='text-yellow-600'>
                  Hãy kiểm tra sản phẩm và số lượng sản phẩm chính xác để không mua nhầm sản phẩm.
                </AlertDescription>
              </Alert>
            </div>
            <div className='space-y-4 text-sm text-muted-foreground'>
              <div className='flex items-center justify-between space-x-20'>
                <span>Tổng tiền hàng</span>
                <span>{formatCurrency(totalCheckoutAmount)}&#8363;</span>
              </div>
              <div className='flex items-center justify-between space-x-20'>
                <span>Tổng sản phẩm</span>
                <span className='text-foreground font-semibold text-2xl'>{totalCheckoutItems}</span>
              </div>
              <div className='flex items-center justify-between space-x-20'>
                <span>Tổng thanh toán</span>
                <span className='text-foreground font-semibold text-2xl'>
                  {formatCurrency(totalCheckoutAmount)}&#8363;
                </span>
              </div>
              <div className='flex justify-end'>
                <Button disabled={createOrderMutation.isPending} size='lg' className='uppercase' onClick={handleOrder}>
                  {createOrderMutation.isPending && <Loader2 className='size-4 animate-spin' />}
                  Đặt hàng
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
