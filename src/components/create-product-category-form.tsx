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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'
import { ProductCategoryStatus } from '~/constants/enum'
import useUploadImage from '~/hooks/use-upload-image'
import { createProductCategorySchema, CreateProductCategorySchema } from '~/rules/productCategories.rules'
import { ProductCategoryItem } from '~/types/productCategories.types'

export default function CreateProductCategoryForm({
  productCategoryData,
  onSuccess
}: {
  productCategoryData?: ProductCategoryItem
  onSuccess?: () => void
}) {
  const queryClient = useQueryClient()

  const isUpdateMode = !!productCategoryData

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
      description: '',
      status: productCategoryData?.status ? productCategoryData.status : ProductCategoryStatus.Active.toString()
    }
  })

  // Đặt giá trị mặc định cho form khi ở chế độ update
  React.useEffect(() => {
    if (!isUpdateMode) return
    const { setValue } = form
    setValue('name', productCategoryData.name)
    setValue('description', productCategoryData.description)
  }, [form, productCategoryData, isUpdateMode])

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

  const updateProductCategoryMutation = useMutation({
    mutationKey: ['update-product-category'],
    mutationFn: productCategoriesApis.updateProductCategory,
    onSuccess: (data) => {
      toast.success(data.data.message)
      queryClient.invalidateQueries({ queryKey: ['get-product-categories'] })
      queryClient.invalidateQueries({ queryKey: ['get-product-category', data.data.data.productCategory._id] })
      onSuccess && onSuccess()
    }
  })

  const isPending =
    uploadImageMutation.isPending || createProductCategoryMutation.isPending || updateProductCategoryMutation.isPending

  const handleSubmit = form.handleSubmit(async (data) => {
    let thumbnailId: string = ''
    if (isUpdateMode) {
      thumbnailId = productCategoryData.thumbnailId
    }
    if (thumbnailFile) {
      const formData = new FormData()
      formData.append('image', thumbnailFile)
      const uploadImageResponse = await uploadImageMutation.mutateAsync(formData)
      const { _id: imageId } = uploadImageResponse.data.data.medias[0]
      thumbnailId = imageId
    }
    if (!isUpdateMode) {
      if (!thumbnailFile) return
      createProductCategoryMutation.mutate({
        ...data,
        thumbnail: thumbnailId,
        status: Number(data.status)
      })
    } else {
      updateProductCategoryMutation.mutate({
        body: {
          ...data,
          thumbnail: thumbnailId,
          status: Number(data.status)
        },
        productCategoryId: productCategoryData._id
      })
    }
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
            {/* Image placeholder */}
            {!thumbnailFile && !isUpdateMode && <div className='size-28 bg-muted rounded-md' />}
            {/* Hình ảnh preview */}
            {(isUpdateMode || thumbnailPreview) && (
              <img
                src={
                  thumbnailPreview
                    ? thumbnailPreview
                    : productCategoryData?.thumbnail
                      ? productCategoryData.thumbnail
                      : ''
                }
                alt=''
                className='size-28 aspect-square rounded-md'
              />
            )}
          </div>
          {!thumbnailFile && form.formState.isSubmitted && !isUpdateMode && (
            <p className='text-sm text-destructive'>Hình thu nhỏ danh mục là bắt buộc</p>
          )}
        </div>

        {/* Trạng thái */}
        <FormField
          control={form.control}
          name='status'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trạng thái</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a verified email to display' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={ProductCategoryStatus.Active.toString()}>Hoạt động</SelectItem>
                  <SelectItem value={ProductCategoryStatus.Inactive.toString()}>Ngừng hoạt động</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Khi danh mục sản phẩm dừng hoạt động thì tất cả sản phẩm thuộc danh mục đó sẽ bị ẩn.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <div className='flex justify-end'>
          <Button type='submit' disabled={isPending}>
            {isPending && <Loader2 className='w-4 h-4 mr-1 animate-spin' />}
            {!isUpdateMode && 'Tạo danh mục sản phẩm'}
            {isUpdateMode && 'Cập nhật danh mục sản phẩm'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
