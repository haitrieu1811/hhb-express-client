import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import moment from 'moment'

import { DataTableColumnHeader } from '~/components/data-table-column-header'
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
import { convertMomentFromNowToVietnamese } from '~/lib/utils'
import { ProductCategoryItem } from '~/types/productCategories.types'

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
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tên danh mục sản phẩm' />
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
    cell: () => (
      <div className='flex justify-end'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'>
              <MoreHorizontal />
              <span className='sr-only'>Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-[160px]'>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Make a copy</DropdownMenuItem>
            <DropdownMenuItem>Favorite</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Delete
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }
]
