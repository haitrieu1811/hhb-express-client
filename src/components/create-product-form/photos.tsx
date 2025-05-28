import { CloudUpload } from 'lucide-react'
import React from 'react'

import InputFile from '~/components/input-file'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { Skeleton } from '~/components/ui/skeleton'

type ProductPhotosProps = {
  thumbnailFile: File | null
  thumbnailPreview: string | null
  isSubmitted: boolean
  previewPhotos: string[]
  setThumbnailFile: React.Dispatch<React.SetStateAction<File | null>>
  setPhotoFiles: React.Dispatch<React.SetStateAction<File[]>>
  setCurrentPreviewPhoto: React.Dispatch<React.SetStateAction<string | null>>
}

export default function ProductPhotos({
  thumbnailFile,
  isSubmitted,
  thumbnailPreview,
  previewPhotos,
  setThumbnailFile,
  setPhotoFiles,
  setCurrentPreviewPhoto
}: ProductPhotosProps) {
  const handleChangeThumbnailFile = (files: File[] | undefined) => {
    if (!files) return
    setThumbnailFile(files[0])
  }

  const handleChangePhotoFiles = (files: File[] | undefined) => {
    if (!files) return
    setPhotoFiles((prevState) => [...prevState, ...files])
  }

  const handleDeletePhotoFile = (temp: string) => {
    const indexToDelete = previewPhotos.findIndex((previewPhoto) => previewPhoto === temp)
    setPhotoFiles((prevState) => prevState.filter((_, index) => index !== indexToDelete))
  }

  const handleViewPreviewPhoto = (temp: string) => {
    setCurrentPreviewPhoto(temp)
  }
  return (
    <div className='space-y-6'>
      {/* Ảnh đại diện sản phẩm */}
      <div className='space-y-3'>
        <Label>Ảnh đại diện sản phẩm</Label>
        {!thumbnailFile && <Skeleton className='aspect-video' />}
        {thumbnailPreview && <img src={thumbnailPreview} alt='' className='aspect-square object-cover rounded-lg' />}
        <InputFile onChange={(files) => handleChangeThumbnailFile(files)}>
          <Button type='button' size='sm' variant='outline'>
            <CloudUpload className='w-4 h-4' />
            {!thumbnailFile && 'Tải ảnh lên'}
            {thumbnailFile && 'Đổi ảnh khác'}
          </Button>
        </InputFile>
        {isSubmitted && !thumbnailFile && (
          <p className='text-sm text-destructive'>Ảnh đại diện sản phẩm là bắt buộc.</p>
        )}
      </div>
      {/* Danh sách hình ảnh sản phẩm */}
      <div className='space-y-3'>
        <Label>Thư viện ảnh sản phẩm</Label>
        {previewPhotos.length > 0 && (
          <div className='grid grid-cols-12 gap-2'>
            {previewPhotos.map((previewPhoto) => (
              <div key={previewPhoto} className='col-span-4 relative group'>
                <img src={previewPhoto} alt='' className='rounded-lg aspect-square object-cover' />
                <div className='absolute inset-0 bg-muted/50 flex flex-col justify-center items-center rounded-lg space-y-1 hover:cursor-pointer opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto duration-100'>
                  <Button
                    type='button'
                    size='sm'
                    className='text-xs p-1 h-auto'
                    onClick={() => handleViewPreviewPhoto(previewPhoto)}
                  >
                    Xem
                  </Button>
                  <Button
                    type='button'
                    size='sm'
                    variant='destructive'
                    className='text-xs p-1 h-auto'
                    onClick={() => handleDeletePhotoFile(previewPhoto)}
                  >
                    Xóa
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        <InputFile multiple onChange={(files) => handleChangePhotoFiles(files)}>
          <Button type='button' size='sm' variant='outline'>
            <CloudUpload className='w-4 h-4' />
            Tải ảnh lên
          </Button>
        </InputFile>
      </div>
    </div>
  )
}
