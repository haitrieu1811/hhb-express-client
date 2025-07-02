import { zodResolver } from '@hookform/resolvers/zod'
import { CloudUpload } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Skeleton } from '~/components/ui/skeleton'
import { BlogStatus } from '~/constants/enum'
import { createBlogSchema } from '~/rules/blogs.rules'

export default function CreateBlogForm() {
  const form = useForm({
    resolver: zodResolver(createBlogSchema),
    defaultValues: {
      title: '',
      content: '',
      order: '0',
      status: BlogStatus.Active.toString()
    }
  })

  const handleSubmit = form.handleSubmit((data) => {
    console.log(data)
  })

  return (
    <div className='grid grid-cols-12 gap-4'>
      <Card className='col-span-4'>
        <CardHeader>
          <CardTitle>Hình đại diện</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Skeleton className='aspect-video' />
          <Button variant='outline'>
            <CloudUpload className='size-4' />
            Tải ảnh lên
          </Button>
        </CardContent>
      </Card>
      <Card className='col-span-8'>
        <CardHeader>
          <CardTitle>Thông tin</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className='space-y-8' onSubmit={handleSubmit}>
              {/* Tiêu đề */}
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Thứ tự sắp xếp */}
              <FormField
                control={form.control}
                name='order'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thứ tự sắp xếp</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>Thứ tự sắp xếp càng nhỏ thì blog sẽ càng được ưu tiên xuất hiện.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Nội dung */}
              <Label className='mb-2'>Nội dung</Label>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
