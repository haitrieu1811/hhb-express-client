import { CircleCheck, CircleX, Ellipsis, PlusCircle } from 'lucide-react'
import moment from 'moment'
import { Link } from 'react-router'

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
  const { blogs, totalBlogs } = useBlogs()
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-xl'>Danh sách blogs</CardTitle>
        <CardDescription>Có {totalBlogs} blogs.</CardDescription>
        <CardAction>
          <Button asChild variant='outline'>
            <Link to={PATH.DASHBOARD_BLOGS_NEW}>
              <PlusCircle className='size-4' />
              Thêm blog mới
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
                    <img src={blog.thumbnail.url} alt={blog.title} className='w-24 rounded object-cover aspect-video' />
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
                        <DropdownMenuItem>Cập nhật</DropdownMenuItem>
                        <DropdownMenuItem>Xóa</DropdownMenuItem>
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
  )
}
