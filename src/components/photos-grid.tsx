import React from 'react'

import { cn } from '~/lib/utils'

export default function PhotosGrid({
  photos,
  defaultPhoto
}: {
  photos: {
    _id: string
    url: string
  }[]
  defaultPhoto: string
}) {
  const [currentPhoto, setCurrentPhoto] = React.useState<string>(defaultPhoto)
  return (
    <div className='grid grid-cols-12 gap-4'>
      <div className='col-span-6'>
        {currentPhoto && <img src={currentPhoto} alt='' className='w-full object-contain rounded-md' />}
      </div>
      {photos.length > 0 && (
        <div className='col-span-6'>
          <div className='grid grid-cols-12 gap-4'>
            {photos.map((photo) => (
              <div
                key={photo._id}
                className={cn('col-span-3 p-1 border-2 rounded-md hover:cursor-pointer', {
                  'border-foreground': photo.url === currentPhoto
                })}
                onClick={() => setCurrentPhoto(photo.url)}
              >
                <img src={photo.url} alt='' className='aspect-square rounded-md object-cover' />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
