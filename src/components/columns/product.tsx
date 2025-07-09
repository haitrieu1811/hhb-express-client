import { ColumnDef } from '@tanstack/react-table'
import { CheckCircle, MoreHorizontal, Pause } from 'lucide-react'
import moment from 'moment'

import { DataTableColumnHeader } from '~/components/data-table-column-header'
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
import { ProductStatus } from '~/constants/enum'
import { cn, convertMomentFromNowToVietnamese } from '~/lib/utils'
import { ProductItem } from '~/types/products.types'

export const productColumns: ColumnDef<ProductItem>[] = [
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
    header: ({ column }) => <DataTableColumnHeader column={column} title='Sản phẩm' />,
    cell: ({ row }) => {
      const product = row.original
      return (
        <div className='flex items-center space-x-4'>
          <img
            src={product.thumbnail.url}
            alt={product.name}
            className='w-[60px] aspect-square object-cover rounded-md shrink-0'
          />
          <div className='font-medium'>{product.name}</div>
        </div>
      )
    }
  },
  {
    accessorKey: 'categoryId',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Danh mục' />,
    cell: ({ row }) => <Badge variant='outline'>{row.original.category.name}</Badge>
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    cell: ({ row }) => (
      <Badge
        className={cn({
          'bg-green-500/10 text-green-500': row.original.status === ProductStatus.Active.toString(),
          'bg-red-500/10 text-red-500': row.original.status === ProductStatus.Inactive.toString()
        })}
      >
        {row.original.status === ProductStatus.Active.toString() && <CheckCircle className='size-4' />}
        {row.original.status === ProductStatus.Active.toString() && 'Hoạt động'}
        {row.original.status === ProductStatus.Inactive.toString() && <Pause className='size-4' />}
        {row.original.status === ProductStatus.Inactive.toString() && 'Tạm dừng'}
      </Badge>
    )
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tạo lúc' />,
    cell: ({ row }) => convertMomentFromNowToVietnamese(moment(row.original.createdAt).fromNow())
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Cập nhật' />,
    cell: ({ row }) => convertMomentFromNowToVietnamese(moment(row.original.createdAt).fromNow())
  },
  {
    id: 'actions',
    cell: () => {
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
              <DropdownMenuItem>Cập nhật</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Xóa
                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  }
]
