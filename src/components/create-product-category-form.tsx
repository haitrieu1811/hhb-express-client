/* eslint-disable @typescript-eslint/no-unused-expressions */
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Image, Loader2 } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import productCategoriesApis from '~/apis/productCategories.apis'
import InputFile from '~/components/input-file'
import { Button } from '~/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import useUploadImage from '~/hooks/use-upload-image'
import { createProductCategorySchema, CreateProductCategorySchema } from '~/rules/productCategories.rules'

export default function CreateProductCategoryForm({ onSuccess }: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  const [thumbnailFile, setThumbnailFile] = React.useState<File | null>(null)

  const thumbnailPreview = React.useMemo(
    () => (thumbnailFile ? URL.createObjectURL(thumbnailFile) : null),
    [thumbnailFile]
  )

  const handleChangeThumbnailFile = (files?: File[]) => {
    if (!files) return
    setThumbnailFile(files[0])
  }

  const form = useForm<CreateProductCategorySchema>({
    resolver: zodResolver(createProductCategorySchema),
    defaultValues: {
      name: '',
      description: ''
    }
  })

  const { uploadImageMutation } = useUploadImage()

  const createProductCategoryMutation = useMutation({
    mutationKey: ['create-product-category'],
    mutationFn: productCategoriesApis.createProductCategory,
    onSuccess: (data) => {
      toast.success(data.data.message)
      form.reset()
      setThumbnailFile(null)
      queryClient.invalidateQueries({ queryKey: ['get-product-categories'] })
      onSuccess && onSuccess()
    }
  })

  const isPending = uploadImageMutation.isPending || createProductCategoryMutation.isPending
  const isValidForm = form.formState.isSubmitSuccessful && !!thumbnailFile

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!isValidForm) return
    const formData = new FormData()
    formData.append('image', thumbnailFile)
    const uploadImageResponse = await uploadImageMutation.mutateAsync(formData)
    const { _id: imageId } = uploadImageResponse.data.data.medias[0]
    createProductCategoryMutation.mutate({
      ...data,
      thumbnail: imageId
    })
  })

  return (
    <Form {...form}>
      <form className='space-y-8' onSubmit={handleSubmit}>
        {/* Tên */}
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên danh mục</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Mô tả */}
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả danh mục</FormLabel>
              <FormControl>
                <Textarea className='resize-none min-h-32' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Hình thu nhỏ */}
        <div className='space-y-4'>
          <div className='flex space-x-4'>
            <InputFile onChange={(files) => handleChangeThumbnailFile(files)}>
              <div className='flex flex-col items-center justify-center space-y-2 border-[2px] border-dashed size-28 text-muted-foreground rounded-md aspect-square'>
                <Image />
                <div className='text-sm'>Hình thu nhỏ</div>
              </div>
            </InputFile>
            {!thumbnailFile && <div className='size-28 bg-muted rounded-md' />}
            {thumbnailFile && thumbnailPreview && (
              <img src={thumbnailPreview} alt='' className='size-28 aspect-square rounded-md' />
            )}
          </div>
          {!thumbnailFile && form.formState.isSubmitted && (
            <p className='text-sm text-destructive'>Hình thu nhỏ danh mục là bắt buộc</p>
          )}
        </div>

        {/* Submit */}
        <div className='flex justify-end'>
          <Button type='submit' disabled={isPending}>
            {isPending && <Loader2 className='w-4 h-4 mr-1 animate-spin' />}
            Tạo danh mục sản phẩm
          </Button>
        </div>
      </form>
    </Form>
  )
}
