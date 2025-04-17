'use client'

import { Table } from '@tanstack/react-table'
import { Trash2, X } from 'lucide-react'

import { DataTableFacetedFilter } from '~/components/data-table-faceted-filter'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
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

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchField?: string
  facetedFilters?: {
    columnName: string
    title: string
    options: {
      label: string
      value: string
      icon?: React.ComponentType<{
        className?: string
      }>
    }[]
  }[]
}

export function DataTableToolbar<TData>({ table, searchField, facetedFilters }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  return (
    <div className='flex justify-between items-center space-x-2'>
      <div className='flex flex-1 items-center space-x-2'>
        {searchField && (
          <Input
            placeholder='Tìm kiếm...'
            value={(table.getColumn(searchField)?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn(searchField)?.setFilterValue(event.target.value)}
            className='h-8 w-[150px] lg:w-[250px]'
          />
        )}
        {facetedFilters?.map((item, index) => (
          <DataTableFacetedFilter
            key={index}
            column={table.getColumn(item.columnName)}
            title={item.title}
            options={item.options}
          />
        ))}
        {isFiltered && (
          <Button variant='ghost' onClick={() => table.resetColumnFilters()} className='h-8 px-2 lg:px-3'>
            Đặt lại
            <X />
          </Button>
        )}
      </div>
      <div className='flex space-x-2'>
        {table.getSelectedRowModel().rows.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='destructive' size='sm'>
                <Trash2 className='w-4 h-4 mr-1' />
                Xóa bản ghi đã chọn
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xóa tất cả bản ghi đã chọn?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tất cả bản ghi sẽ bị xóa vĩnh viễn và không thể khôi phục.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                <AlertDialogAction>Tiếp tục</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  )
}
