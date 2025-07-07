/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { CloudUpload, Loader2 } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import blogsApis from '~/apis/blogs.apis'
import InputFile from '~/components/input-file'
import RichTextEditor from '~/components/rich-text-editor'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import { Skeleton } from '~/components/ui/skeleton'
import { BlogStatus } from '~/constants/enum'
import useUploadImage from '~/hooks/use-upload-image'
import { createBlogSchema } from '~/rules/blogs.rules'
import { BlogItem } from '~/types/blogs.types'
import { SuccessResponse } from '~/types/utils.types'

type CreateBlogFormProps = {
  blogData?: BlogItem
  onUpdateSuccess?: (
    data: AxiosResponse<
      SuccessResponse<{
        blog: BlogItem
      }>,
      any
    >
  ) => void
}

export default function CreateBlogForm({ blogData, onUpdateSuccess }: CreateBlogFormProps) {
  const isUpdateMode = !!blogData

  const [thumbnailFile, setThumbnailFile] = React.useState<File | null>(null)

  const thumbnailPreview = React.useMemo(
    () => (thumbnailFile ? URL.createObjectURL(thumbnailFile) : null),
    [thumbnailFile]
  )

  const handleChangeThumbnailFile = (files: File[] | undefined) => {
    if (!files) return
    setThumbnailFile(files[0])
  }

  const { uploadImageMutation } = useUploadImage()

  const form = useForm({
    resolver: zodResolver(createBlogSchema),
    values: {
      title: blogData?.title ?? '',
      order: blogData?.order.toString() ?? '0',
      content: blogData?.content ?? '',
      status: blogData?.status.toString() ?? BlogStatus.Active.toString()
    }
  })

  console.log(form.watch())

  const createBlogMutation = useMutation({
    mutationKey: ['create-blog'],
    mutationFn: blogsApis.createBlog,
    onSuccess: (data) => {
      toast.success(data.data.message)
      form.reset()
      setThumbnailFile(null)
    }
  })

  const updateBlogMutation = useMutation({
    mutationKey: ['update-blog'],
    mutationFn: blogsApis.updateBlog,
    onSuccess: (data) => {
      toast.success(data.data.message)
      thumbnailFile && setThumbnailFile(null)
      !!onUpdateSuccess && onUpdateSuccess(data)
    }
  })

  const isPending = uploadImageMutation.isPending || createBlogMutation.isPending || updateBlogMutation.isPending

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!thumbnailFile && !isUpdateMode) return
    let thumbnailId = blogData?.thumbnail._id
    const body = {
      ...data,
      status: Number(data.status),
      order: Number(data.order)
    }
    if (thumbnailFile) {
      const form = new FormData()
      form.append('image', thumbnailFile)
      try {
        const res = await uploadImageMutation.mutateAsync(form)
        const { _id } = res.data.data.medias[0]
        if (!isUpdateMode) {
          createBlogMutation.mutate({
            ...body,
            thumbnail: _id
          })
        } else {
          thumbnailId = _id
        }
      } catch (error) {
        console.log(error)
      }
    }
    if (thumbnailId && isUpdateMode) {
      updateBlogMutation.mutate({
        body: {
          ...body,
          thumbnail: thumbnailId
        },
        blogId: blogData?._id
      })
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <div className='relative'>
          <div className='flex items-start space-x-4'>
            <Card className='basis-1/4'>
              <CardHeader>
                <CardTitle>Hình đại diện</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {/* Thumbnail */}
                {(thumbnailPreview || isUpdateMode) && (
                  <img
                    src={thumbnailPreview || blogData?.thumbnail.url}
                    alt={blogData?.title || ''}
                    className='aspect-video object-cover rounded-md'
                  />
                )}
                {/* Thumbnail placeholder */}
                {!thumbnailPreview && !isUpdateMode && <Skeleton className='aspect-video' />}
                <InputFile onChange={(files) => handleChangeThumbnailFile(files)}>
                  <Button type='button' variant='outline'>
                    <CloudUpload className='size-4' />
                    {!isUpdateMode ? 'Tải ảnh lên' : 'Thay đổi ảnh khác'}
                  </Button>
                </InputFile>
                {!thumbnailFile && form.formState.isSubmitted && !isUpdateMode && (
                  <p className='text-destructive text-sm'>Hình đại diện là bắt buộc</p>
                )}
              </CardContent>
            </Card>
            <Card className='flex-1'>
              <CardHeader>
                <CardTitle>Thông tin</CardTitle>
              </CardHeader>
              <CardContent className='space-y-8'>
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
                      <FormDescription>
                        Thứ tự sắp xếp càng nhỏ thì blog sẽ càng được ưu tiên xuất hiện.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Trạng thái */}
                <FormField
                  control={form.control}
                  name='status'
                  render={({ field }) => (
                    <FormItem className='space-y-3'>
                      <FormLabel>Trạng thái</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='flex flex-col'>
                          <FormItem className='flex items-center gap-3'>
                            <FormControl>
                              <RadioGroupItem value={BlogStatus.Active.toString()} />
                            </FormControl>
                            <FormLabel className='font-normal'>Hoạt động</FormLabel>
                          </FormItem>
                          <FormItem className='flex items-center gap-3'>
                            <FormControl>
                              <RadioGroupItem value={BlogStatus.Inactive.toString()} />
                            </FormControl>
                            <FormLabel className='font-normal'>Tạm dừng</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Nội dung */}
                <FormField
                  control={form.control}
                  name='content'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nội dung</FormLabel>
                      <FormControl>
                        <RichTextEditor content={field.value} defaultContent={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
          <div className='sticky bottom-0 inset-x-0 bg-background flex justify-center p-2 space-x-4 mt-4'>
            <Button type='button' variant='outline' size='sm'>
              Hủy bỏ
            </Button>
            <Button type='submit' size='sm' disabled={isPending} onClick={handleSubmit}>
              {isPending && <Loader2 className='size-4 animate-spin' />}
              {!isUpdateMode ? 'Thêm bài viết' : 'Cập nhật bài viết'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
