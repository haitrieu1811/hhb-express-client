/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { Angry, Annoyed, CloudUpload, Laugh, Loader2, LucideIcon, Meh, Smile, Star, X } from 'lucide-react'
import React from 'react'

import reviewsApis from '~/apis/reviews.apis'
import InputFile from '~/components/input-file'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import useUploadImage from '~/hooks/use-upload-image'
import { cn } from '~/lib/utils'
import { ProductInOrder } from '~/types/orders.types'
import { ProductItem } from '~/types/products.types'
import { CreateReviewReqBody, OriginalReview } from '~/types/reviews.types'
import { SuccessResponse } from '~/types/utils.types'

type RatingFormProps = {
  productData: ProductItem | ProductInOrder
  onSuccess?: (
    data: AxiosResponse<
      SuccessResponse<{
        review: OriginalReview
      }>,
      any
    >
  ) => void
}

export default function RatingForm({ productData, onSuccess }: RatingFormProps) {
  const [currentStar, setCurrentStar] = React.useState<number | null>(null)
  const [currentReaction, setCurrentReaction] = React.useState<{
    icon: LucideIcon
    message: string
  } | null>(null)
  const [photos, setPhotos] = React.useState<File[]>([])
  const [content, setContent] = React.useState<string>('')

  const previewPhotos = React.useMemo(() => photos.map((photo) => URL.createObjectURL(photo)), [photos])

  // Cập nhật reaction
  React.useEffect(() => {
    if (!currentStar) return
    switch (currentStar) {
      case 1:
        setCurrentReaction({
          icon: Angry,
          message: 'Thất vọng'
        })
        break
      case 2:
        setCurrentReaction({
          icon: Annoyed,
          message: 'Không hài lòng'
        })
        break
      case 3:
        setCurrentReaction({
          icon: Meh,
          message: 'Bình thường'
        })
        break
      case 4:
        setCurrentReaction({
          icon: Smile,
          message: 'Hài lòng'
        })
        break
      case 5:
        setCurrentReaction({
          icon: Laugh,
          message: 'Tuyệt vời'
        })
        break
      default:
        break
    }
  }, [currentStar])

  const handleChangePhotos = (files: File[] | undefined) => {
    if (!files) return
    setPhotos((prevState) => [...prevState, ...files])
  }

  const handleRemovePhoto = (tempName: string) => {
    const _index = previewPhotos.findIndex((previewPhoto) => previewPhoto === tempName)
    setPhotos((prevState) => prevState.filter((_, index) => index !== _index))
  }

  const { uploadImageMutation } = useUploadImage()

  const createReviewMutation = useMutation({
    mutationKey: ['create-review'],
    mutationFn: reviewsApis.createReview,
    onSuccess: (data) => {
      onSuccess && onSuccess(data)
    }
  })

  const isPending = uploadImageMutation.isPending || createReviewMutation.isPending

  const handleSubmit = async () => {
    if (!currentStar) return
    const body: CreateReviewReqBody = {
      content,
      starPoints: currentStar,
      photos: []
    }
    if (photos.length > 0) {
      const form = new FormData()
      photos.forEach((item) => {
        form.append('image', item)
      })
      const res = await uploadImageMutation.mutateAsync(form)
      const { medias } = res.data.data
      const photoIds = medias.map((media) => media._id)
      body.photos = photoIds
    }
    createReviewMutation.mutate({
      body,
      productId: productData._id
    })
  }

  return (
    <div className='grid grid-cols-12 gap-8'>
      <div className='col-span-4'>
        <div className='bg-muted p-4 rounded-md flex flex-col items-center justify-center space-y-2'>
          <img
            src={productData.thumbnail.url}
            alt={productData.name}
            className='aspect-square object-cover rounded-md shrink-0'
          />
          <h3 className='font-medium text-sm text-center'>{productData.name}</h3>
        </div>
      </div>
      <div className='col-span-8 space-y-8'>
        <div className='space-y-3'>
          <Label>Số sao:</Label>
          <div className='flex items-center space-x-6'>
            <div className='flex space-x-1'>
              {Array(5)
                .fill(0)
                .map((_, index) => {
                  const starValue = index + 1
                  const isActive = currentStar && starValue <= currentStar
                  return (
                    <button
                      key={index}
                      className={cn('border p-1 hover:cursor-pointer rounded', {
                        'border-yellow-500': isActive
                      })}
                      onMouseEnter={() => setCurrentStar(starValue)}
                    >
                      <Star
                        className={cn('size-4', {
                          'fill-yellow-500 stroke-yellow-500': isActive
                        })}
                      />
                    </button>
                  )
                })}
            </div>
            {currentReaction && (
              <div
                className={cn('flex items-center space-x-2', {
                  'text-red-500 dark:text-red-600': currentStar === 1,
                  'text-violet-500 dark:text-violet-600': currentStar === 2,
                  'text-yellow-500 dark:text-yellow-600': currentStar === 3,
                  'text-blue-500 dark:text-blue-600': currentStar === 4,
                  'text-green-500 dark:text-green-600': currentStar === 5
                })}
              >
                <currentReaction.icon className='size-5' />
                <span className='text-xs font-medium'>{currentReaction.message}</span>
              </div>
            )}
          </div>
          {!currentStar && <p className='text-xs text-destructive'>Số sao là bắt buộc.</p>}
        </div>
        <div className='space-y-3'>
          <Label>
            Hình ảnh thực tế <span className='text-xs text-muted-foreground'>(tùy chọn)</span>
          </Label>
          {previewPhotos.length > 0 && (
            <div className='grid grid-cols-12 gap-2'>
              {previewPhotos.map((previewPhoto, index) => (
                <div key={index} className='col-span-2 relative'>
                  <a href={previewPhoto} target='_blank'>
                    <img src={previewPhoto} alt={previewPhoto} className='aspect-square rounded object-cover' />
                  </a>
                  <button
                    className='absolute -top-1 -right-1 bg-destructive p-1 rounded-full hover:cursor-pointer'
                    onClick={() => handleRemovePhoto(previewPhoto)}
                  >
                    <X className='size-3 stroke-primary-foreground' />
                  </button>
                </div>
              ))}
            </div>
          )}
          <InputFile multiple onChange={(files) => handleChangePhotos(files)}>
            <Button variant='outline' size='sm'>
              <CloudUpload className='size-4' />
              Tải ảnh lên
            </Button>
          </InputFile>
        </div>
        <div className='space-y-3'>
          <Label>
            Nội dung nhận xét <span className='text-xs text-muted-foreground'>(tùy chọn)</span>
          </Label>
          <Textarea value={content} className='min-h-28 resize-none' onChange={(e) => setContent(e.target.value)} />
        </div>
        <Button disabled={isPending} className='w-full' onClick={handleSubmit}>
          {isPending && <Loader2 className='size-4 animate-spin' />}
          Thêm đánh giá
        </Button>
      </div>
    </div>
  )
}
