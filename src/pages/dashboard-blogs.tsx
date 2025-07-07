import { useMutation } from '@tanstack/react-query'
import { CircleCheck, CircleX, Ellipsis, PlusCircle } from 'lucide-react'
import moment from 'moment'
import React from 'react'
import { Link } from 'react-router'
import { toast } from 'sonner'

import blogsApis from '~/apis/blogs.apis'
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
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { BlogStatus } from '~/constants/enum'
import PATH from '~/constants/path'
import useBlogs from '~/hooks/use-blogs'
import { cn, convertMomentFromNowToVietnamese } from '~/lib/utils'

export default function DashboardBlogsPage() {
  const [currentDeleteId, setCurrentDeleteId] = React.useState<string | null>(null)

  const { blogs, totalBlogs, getBlogsQuery } = useBlogs()

  const deleteBlogsMutation = useMutation({
    mutationKey: ['delete-blogs'],
    mutationFn: blogsApis.deleteBlogs,
    onSuccess: (data) => {
      toast.success(data.data.message)
      getBlogsQuery.refetch()
    }
  })

  return (
    <React.Fragment>
      <Card>
        <CardHeader>
          <CardTitle className='text-xl'>Danh sách bài viết</CardTitle>
          <CardDescription>Có {totalBlogs} bài viết.</CardDescription>
          <CardAction>
            <Button asChild variant='outline'>
              <Link to={PATH.DASHBOARD_BLOGS_NEW}>
                <PlusCircle className='size-4' />
                Thêm bài viết mới
              </Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Blog</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Tạo lúc</TableHead>
                <TableHead>Cập nhật</TableHead>
                <TableHead className='text-right'>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.map((blog) => (
                <TableRow key={blog._id}>
                  <TableCell>
                    <div className='flex items-start space-x-3'>
                      <img
                        src={blog.thumbnail.url}
                        alt={blog.title}
                        className='w-24 rounded object-cover aspect-video'
                      />
                      <div className='text-sm font-medium line-clamp-1'>{blog.title}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant='outline'
                      className={cn('rounded', {
                        'text-green-500': blog.status === BlogStatus.Active,
                        'text-red-500': blog.status === BlogStatus.Inactive
                      })}
                    >
                      {blog.status === BlogStatus.Active ? (
                        <CircleCheck className='stroke-green-500' />
                      ) : (
                        <CircleX className='stroke-red-500' />
                      )}
                      {blog.status === BlogStatus.Active ? 'Hoạt động' : 'Tạm dừng'}
                    </Badge>
                  </TableCell>
                  <TableCell>{convertMomentFromNowToVietnamese(moment(blog.createdAt).fromNow())}</TableCell>
                  <TableCell>{convertMomentFromNowToVietnamese(moment(blog.updatedAt).fromNow())}</TableCell>
                  <TableCell>
                    <div className='flex justify-end'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size='icon' variant='outline'>
                            <Ellipsis className='size-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link to={PATH.DASHBOARD_BLOGS_DETAIL(blog._id)}>Cập nhật</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setCurrentDeleteId(blog._id)}>Xóa</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* Xác nhận xóa blog */}
      <AlertDialog
        open={!!currentDeleteId}
        onOpenChange={(value) => {
          if (!value) {
            setCurrentDeleteId(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn muốn xóa bài viết này?</AlertDialogTitle>
            <AlertDialogDescription>Bài viết sẽ bị xóa vĩnh viễn và không thể khôi phục lại.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteBlogsMutation.mutate([currentDeleteId as string])}>
              Tiếp tục
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  )
}
