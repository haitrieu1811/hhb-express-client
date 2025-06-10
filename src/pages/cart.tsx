import { CheckedState } from '@radix-ui/react-checkbox'
import { useMutation } from '@tanstack/react-query'
import keyBy from 'lodash/keyBy'
import { Loader2, Trash } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router'
import { toast } from 'sonner'

import cartItemsApis from '~/apis/cartItems.apis'
import QuantityController from '~/components/quantity-controller'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '~/components/ui/alert-dialog'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import { Label } from '~/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import PATH from '~/constants/path'
import useCart from '~/hooks/use-cart'
import { cn, formatCurrency } from '~/lib/utils'
import { AppContext } from '~/providers/app.provider'

export default function CartPage() {
  const { extendedMyCart, setExtendedMyCart } = React.useContext(AppContext)

  const { getMyCartQuery, myCart, totalItems } = useCart({})

  const isCheckedAll = extendedMyCart.every((cartItem) => cartItem.checked)

  const checkedCartItems = React.useMemo(() => extendedMyCart.filter((cartItem) => cartItem.checked), [extendedMyCart])

  const totalCheckedCartItems = checkedCartItems.reduce((acc, cartItem) => (acc += cartItem.quantity), 0)

  const totalCheckedAmount = checkedCartItems.reduce(
    (acc, cartItem) => (acc += cartItem.quantity * cartItem.unitPriceAfterDiscount),
    0
  )

  const handleCheckAll = () => {
    setExtendedMyCart((prevState) =>
      prevState.map((cartItem) => ({
        ...cartItem,
        checked: !isCheckedAll
      }))
    )
  }

  const handleCheck = ({ checked, index }: { checked: CheckedState; index: number }) => {
    setExtendedMyCart((prevState) =>
      prevState.map((cartItem, cartItemIndex) => {
        if (cartItemIndex === index) {
          return {
            ...cartItem,
            checked: checked as boolean
          }
        }
        return {
          ...cartItem
        }
      })
    )
  }

  React.useEffect(() => {
    setExtendedMyCart((prevState) => {
      const extendedMyCartObject = keyBy(prevState, '_id')
      return myCart.map((cartItem) => ({
        ...cartItem,
        checked: !!extendedMyCartObject[cartItem._id]?.checked
      }))
    })
  }, [myCart, setExtendedMyCart])

  const updateCartItemMutation = useMutation({
    mutationKey: ['update-cart-item'],
    mutationFn: cartItemsApis.updateCartItem,
    onSuccess: (data) => {
      toast.success(data.data.message)
      getMyCartQuery.refetch()
    }
  })

  const deleteCartItemsMutation = useMutation({
    mutationKey: ['delete-cart-items'],
    mutationFn: cartItemsApis.deleteCartItems,
    onSuccess: (data) => {
      toast.success(data.data.message)
      getMyCartQuery.refetch()
    }
  })

  return (
    <div className='pt-4 space-y-4'>
      <h1 className='text-2xl font-medium text-center capitalize'>Giỏ hàng</h1>
      {totalItems > 0 && !getMyCartQuery.isLoading && (
        <div className='space-y-4 relative'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox checked={isCheckedAll} onCheckedChange={handleCheckAll} />
                </TableHead>
                <TableHead>Sản phẩm</TableHead>
                <TableHead>Đơn giá</TableHead>
                <TableHead>Số lượng</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead className='text-right'>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {extendedMyCart.map((cartItem, index) => (
                <TableRow
                  key={cartItem._id}
                  className={cn({
                    'bg-muted/50': cartItem.checked
                  })}
                >
                  <TableCell>
                    <Checkbox
                      checked={cartItem.checked}
                      onCheckedChange={(checked) => handleCheck({ checked, index })}
                    />
                  </TableCell>
                  <TableCell className='font-medium'>
                    <Link
                      to={PATH.PRODUCT_DETAIL({
                        name: cartItem.product.name,
                        id: cartItem.product._id
                      })}
                      className='flex items-center space-x-4 hover:underline'
                    >
                      <img
                        src={cartItem.product.thumbnail}
                        alt={cartItem.product.name}
                        className='shrink-0 rounded-md size-16'
                      />
                      <span className='flex-1'>{cartItem.product.name}</span>
                    </Link>
                  </TableCell>
                  <TableCell>{formatCurrency(cartItem.unitPriceAfterDiscount)}&#8363;</TableCell>
                  <TableCell>
                    <QuantityController
                      value={cartItem.quantity}
                      disabled={
                        updateCartItemMutation.isPending && updateCartItemMutation.variables.cartItemId === cartItem._id
                      }
                      onIncrease={(quantity) =>
                        updateCartItemMutation.mutate({
                          quantity,
                          cartItemId: cartItem._id
                        })
                      }
                      onDecrease={(quantity) =>
                        updateCartItemMutation.mutate({
                          quantity,
                          cartItemId: cartItem._id
                        })
                      }
                    />
                  </TableCell>
                  <TableCell className='text-destructive font-medium'>
                    {formatCurrency(cartItem.unitPriceAfterDiscount * cartItem.quantity)}&#8363;
                  </TableCell>
                  <TableCell className='text-right'>
                    <Button
                      size='icon'
                      variant='outline'
                      onClick={() => deleteCartItemsMutation.mutate([cartItem._id])}
                    >
                      <Trash className='size-4' />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className='border rounded-md bg-background px-2 py-4 flex justify-between items-center space-x-10 sticky bottom-0 inset-x-0'>
            <div className='flex items-center space-x-4'>
              <div className='flex items-center space-x-2'>
                <Checkbox id='checkAll' checked={isCheckedAll} onCheckedChange={handleCheckAll} />
                <Label htmlFor='checkAll'>Chọn tất cả</Label>
              </div>
              {totalCheckedCartItems > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size='sm' variant='link' className='text-destructive'>
                      Xóa mục đã chọn
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Xóa các mục đã chọn?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Thông tin các mục đã chọn sẽ bị xóa sạch và không thể khôi phục lại được.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteCartItemsMutation.mutate(checkedCartItems.map((cartItem) => cartItem._id))}
                      >
                        Tiếp tục
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
            <div className='flex items-center space-x-6'>
              <div
                className={cn('text-right opacity-0 pointer-events-none', {
                  'opacity-100 pointer-events-auto': totalCheckedCartItems > 0
                })}
              >
                <div className='text-sm'>Tổng cộng ({totalCheckedCartItems} sản phẩm)</div>
                <div className='text-lg text-destructive font-medium'>{formatCurrency(totalCheckedAmount)}&#8363;</div>
              </div>
              <Button size='lg' className='uppercase'>
                Mua hàng
              </Button>
            </div>
          </div>
        </div>
      )}
      {getMyCartQuery.isLoading && (
        <div className='p-10 flex justify-center items-center'>
          <Loader2 className='animate-spin' />
        </div>
      )}
    </div>
  )
}
