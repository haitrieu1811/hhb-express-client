/* eslint-disable react-hooks/rules-of-hooks */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import moment from 'moment'
import React from 'react'
import { toast } from 'sonner'

import productCategoriesApis from '~/apis/productCategories.apis'
import CreateProductCategoryForm from '~/components/create-product-category-form'
import { DataTableColumnHeader } from '~/components/data-table-column-header'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '~/components/ui/alert-dialog'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '~/components/ui/sheet'
import { ProductCategoryStatus } from '~/constants/enum'
import { convertMomentFromNowToVietnamese } from '~/lib/utils'
import { ProductCategoryItem } from '~/types/productCategories.types'

const productCategoryStatusBadge = {
  [ProductCategoryStatus.Active.toString()]: <Badge className='bg-green-500'>Hoạt động</Badge>,
  [ProductCategoryStatus.Inactive.toString()]: <Badge className='bg-red-500'>Ngừng hoạt động</Badge>
}

export const ProductCategoryColumns: ColumnDef<ProductCategoryItem>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tên danh mục sản phẩm' />,
    cell: ({ row }) => {
      const productcategory = row.original
      return (
        <div className='flex items-center space-x-3'>
          <img
            src={productcategory.thumbnail}
            alt={productcategory.name}
            className='shrink-0 size-10 aspect-square rounded-md'
          />
          <div className='flex-1'>{productcategory.name}</div>
        </div>
      )
    }
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    cell: ({ row }) => productCategoryStatusBadge[row.original.status]
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tạo lúc' />,
    cell: ({ row }) => <div>{convertMomentFromNowToVietnamese(moment(row.original.createdAt).fromNow())}</div>
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Cập nhật' />,
    cell: ({ row }) => <div>{convertMomentFromNowToVietnamese(moment(row.original.updatedAt).fromNow())}</div>
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const queryClient = useQueryClient()

      const [isOpenDeleteDialog, setIsOpenDeleteDialog] = React.useState<boolean>(false)
      const [isOpenUpdateSheet, setIsOpenUpdateSheet] = React.useState<boolean>(false)

      const deleteProductCategoryMutation = useMutation({
        mutationKey: ['delete-product-category'],
        mutationFn: productCategoriesApis.deleteProductCategory,
        onSuccess: (data) => {
          toast.success(data.data.message)
          queryClient.invalidateQueries({
            queryKey: ['get-product-categories']
          })
        }
      })

      const getProductCategoryQuery = useQuery({
        queryKey: ['get-product-category', row.original._id],
        queryFn: () => productCategoriesApis.getProductCategory(row.original._id),
        enabled: !!isOpenUpdateSheet
      })

      const productCategory = React.useMemo(
        () => getProductCategoryQuery.data?.data.data.productCategory,
        [getProductCategoryQuery.data?.data.data.productCategory]
      )

      return (
        <div className='flex justify-end'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'>
                <MoreHorizontal />
                <span className='sr-only'>Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-[160px]'>
              <DropdownMenuItem onClick={() => setIsOpenUpdateSheet(true)}>Cập nhật</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsOpenDeleteDialog(true)}>
                Xóa
                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={isOpenDeleteDialog} onOpenChange={(value) => setIsOpenDeleteDialog(value)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Bạn có chắc muốn xóa danh mục sản phẩm này?</AlertDialogTitle>
                <AlertDialogDescription>
                  Danh mục sản phẩm sẽ bị xóa vĩnh viễn và không thể khôi phục.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteProductCategoryMutation.mutate(row.original._id)}>
                  Tiếp tục
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Sheet open={isOpenUpdateSheet} onOpenChange={(value) => setIsOpenUpdateSheet(value)}>
            <SheetContent className='max-h-screen overflow-y-auto'>
              <SheetHeader>
                <SheetTitle>{productCategory?.name}</SheetTitle>
                <SheetDescription>{productCategory?.description}</SheetDescription>
              </SheetHeader>
              <div className='p-4'>
                <CreateProductCategoryForm productCategoryData={productCategory} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )
    }
  }
]
