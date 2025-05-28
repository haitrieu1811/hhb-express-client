import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import isEmpty from 'lodash/isEmpty'
import { Loader2, PlusCircle } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import productsApis from '~/apis/products.apis'
import CreateProductCategoryForm from '~/components/create-product-category-form'
import ProductPhotos from '~/components/create-product-form/photos'
import ProductPreview from '~/components/create-product-form/preview'
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
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'
import { ProductStatus } from '~/constants/enum'
import useProductCategories from '~/hooks/use-product-categories'
import useUploadImage from '~/hooks/use-upload-image'
import { isEntityError } from '~/lib/utils'
import { createProductSchema, CreateProductSchema } from '~/rules/products.rules'
import { ErrorResponse } from '~/types/utils.types'

export default function CreateProductForm() {
  const [thumbnailFile, setThumbnailFile] = React.useState<File | null>(null)
  const [photoFiles, setPhotoFiles] = React.useState<File[]>([])
  const [currentPreviewPhoto, setCurrentPreviewPhoto] = React.useState<string | null>(null)
  const [isOpenCreateProductCategory, setIsOpenCreateProductCategory] = React.useState<boolean>(false)

  const thumbnailPreview = React.useMemo(
    () => (thumbnailFile ? URL.createObjectURL(thumbnailFile) : null),
    [thumbnailFile]
  )

  const previewPhotos = React.useMemo(() => photoFiles.map((file) => URL.createObjectURL(file)), [photoFiles])

  const handleCancel = () => {
    form.reset()
    setThumbnailFile(null)
    setPhotoFiles([])
    toast.success('Hủy bỏ hoàn tất.')
  }

  const { productCategories } = useProductCategories()

  const form = useForm<CreateProductSchema>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '0',
      priceAfterDiscount: '0',
      status: ProductStatus.Active.toString()
    }
  })

  const name = form.watch('name')
  const description = form.watch('description')
  const price = Number(form.watch('price'))
  const priceAfterDiscount = Number(form.watch('priceAfterDiscount'))

  const { uploadImageMutation } = useUploadImage()

  const createProductMutation = useMutation({
    mutationKey: ['create-product'],
    mutationFn: productsApis.createProduct,
    onSuccess: (data) => {
      toast.success(data.data.message)
      handleCancel()
    },
    onError: (error) => {
      if (isEntityError<ErrorResponse<CreateProductSchema>>(error)) {
        const formErrors = error.response?.data.errors
        if (!isEmpty(formErrors)) {
          Object.keys(formErrors).forEach((key) => {
            form.setError(key as keyof CreateProductSchema, {
              message: formErrors[key as keyof CreateProductSchema],
              type: 'Server'
            })
          })
        }
      }
    }
  })

  const isPending = uploadImageMutation.isPending || createProductMutation.isPending

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!thumbnailFile) return
    const photoIds = []
    const form = new FormData()
    form.append('image', thumbnailFile)
    const uploadThumbnailRes = await uploadImageMutation.mutateAsync(form)
    const { medias } = uploadThumbnailRes.data.data
    const thumbnailId = medias[0]._id
    if (photoFiles.length > 0) {
      const form = new FormData()
      photoFiles.forEach((photoFile) => {
        form.append('image', photoFile)
      })
      const uploadPhotosRes = await uploadImageMutation.mutateAsync(form)
      const { medias } = uploadPhotosRes.data.data
      photoIds.push(...medias.map((media) => media._id))
    }
    createProductMutation.mutate({
      ...data,
      thumbnail: thumbnailId,
      photos: photoIds,
      price: Number(data.price),
      priceAfterDiscount: Number(data.priceAfterDiscount),
      status: Number(data.status)
    })
  })

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <div className='relative'>
          <div className='grid grid-cols-12 gap-4'>
            <div className='col-span-3'>
              {/* Xem trước sản phẩm */}
              <Card>
                <CardHeader>
                  <CardTitle>Xem trước sản phẩm</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProductPreview
                    name={name}
                    price={price}
                    priceAfterDiscount={priceAfterDiscount}
                    thumbnailPreview={thumbnailPreview}
                    description={description}
                    previewPhotos={previewPhotos}
                  />
                </CardContent>
              </Card>
            </div>
            <div className='col-span-6 space-y-4'>
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin cơ bản</CardTitle>
                </CardHeader>
                <CardContent className='space-y-8'>
                  {/* Tên sản phẩm */}
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên sản phẩm</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Mô tả sản phẩm */}
                  <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mô tả sản phẩm</FormLabel>
                        <FormControl>
                          <Textarea className='resize-none min-h-32' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Giá và phân loại sản phẩm</CardTitle>
                </CardHeader>
                <CardContent className='space-y-8'>
                  {/* Giá gốc sản phẩm */}
                  <FormField
                    control={form.control}
                    name='price'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giá gốc sản phẩm</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Giá sản phẩm sau khi giảm */}
                  <FormField
                    control={form.control}
                    name='priceAfterDiscount'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giá sản phẩm sau khi giảm</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Danh mục</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Danh mục sản phẩm */}
                  <FormField
                    control={form.control}
                    name='categoryId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Danh mục sản phẩm</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder='Chọn một danh mục sản phẩm' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {productCategories.map((productCategory) => (
                              <SelectItem key={productCategory._id} value={productCategory._id}>
                                {productCategory.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className='flex justify-end mt-4'>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() => setIsOpenCreateProductCategory(true)}
                    >
                      <PlusCircle className='size-4' />
                      Thêm danh mục sản phẩm mới
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className='col-span-3 space-y-4'>
              <Card>
                <CardHeader>
                  <CardTitle>Hình ảnh sản phẩm</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProductPhotos
                    isSubmitted={form.formState.isSubmitted}
                    previewPhotos={previewPhotos}
                    thumbnailFile={thumbnailFile}
                    thumbnailPreview={thumbnailPreview}
                    setCurrentPreviewPhoto={setCurrentPreviewPhoto}
                    setPhotoFiles={setPhotoFiles}
                    setThumbnailFile={setThumbnailFile}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Trạng thái sản phẩm</CardTitle>
                </CardHeader>
                <CardContent className='space-y-6'>
                  {/* Danh mục sản phẩm */}
                  <FormField
                    control={form.control}
                    name='status'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trạng thái hoạt động</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder='Chọn trạng thái hoạt động' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={ProductStatus.Active.toString()}>Đang hoạt động</SelectItem>
                            <SelectItem value={ProductStatus.Inactive.toString()}>Ngừng hoạt động</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
          <div className='flex justify-center p-6 space-x-4 sticky bottom-0 inset-x-0 bg-background'>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size='sm' variant='outline' disabled={isPending}>
                  Hủy bỏ
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Dừng tạo sản phẩm mới?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tất cả các thao tác bạn vừa thực hiện sẽ bị loại bỏ và không thể khôi phục.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Đóng lại</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCancel}>Đồng ý</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button size='sm' disabled={isPending}>
              {isPending && <Loader2 className='w-4 h-4 animate-spin' />}
              Thêm sản phẩm
            </Button>
          </div>
        </div>
      </form>

      {currentPreviewPhoto && (
        <Dialog
          open={!!currentPreviewPhoto}
          onOpenChange={(value) => {
            if (!value) {
              setCurrentPreviewPhoto(null)
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Hình ảnh sản phẩm</DialogTitle>
            </DialogHeader>
            <div className='flex justify-center items-center'>
              <img src={currentPreviewPhoto} alt='' className='rounded-lg' />
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={isOpenCreateProductCategory} onOpenChange={(value) => setIsOpenCreateProductCategory(value)}>
        <DialogContent className='max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Thêm danh mục sản phẩm mới</DialogTitle>
          </DialogHeader>
          <CreateProductCategoryForm onSuccess={() => setIsOpenCreateProductCategory(false)} />
        </DialogContent>
      </Dialog>
    </Form>
  )
}
