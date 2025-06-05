import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Camera, Loader2, Trash2 } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import usersApis from '~/apis/users.apis'
import InputFile from '~/components/input-file'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import useUploadImage from '~/hooks/use-upload-image'
import { AppContext } from '~/providers/app.provider'
import { updateMeSchema, UpdateMeSchema } from '~/rules/users.rules'
import { User } from '~/types/users.types'

export default function ProfileForm({ user }: { user: User }) {
  const queryClient = useQueryClient()

  const { setProfile } = React.useContext(AppContext)

  const [avatarFile, setAvatarFile] = React.useState<File | null>(null)

  const avatarPreview = React.useMemo(() => (avatarFile ? URL.createObjectURL(avatarFile) : ''), [avatarFile])

  const handleChangeAvatarFile = (files: File[] | undefined) => {
    if (!files) return
    setAvatarFile(files[0])
  }

  const form = useForm<UpdateMeSchema>({
    resolver: zodResolver(updateMeSchema),
    defaultValues: {
      email: user.email,
      fullName: user.fullName
    }
  })

  const { uploadImageMutation } = useUploadImage()

  const updateMeMutation = useMutation({
    mutationKey: ['update-me'],
    mutationFn: usersApis.updateMe,
    onSuccess: (data) => {
      toast.success(data.data.message)
      queryClient.invalidateQueries({ queryKey: ['get-me'] })
      setProfile(data.data.data.user)
      setAvatarFile(null)
    }
  })

  const isPending = uploadImageMutation.isPending || updateMeMutation.isPending

  const handleSubmit = form.handleSubmit(async (data) => {
    let avatar: undefined | string
    if (user.avatar) {
      avatar = user.avatarId
    }
    if (avatarFile) {
      const form = new FormData()
      form.append('image', avatarFile)
      const res = await uploadImageMutation.mutateAsync(form)
      const { _id } = res.data.data.medias[0]
      avatar = _id
    }
    updateMeMutation.mutate({
      ...data,
      avatar
    })
  })

  const handleCancel = () => {
    setAvatarFile(null)
    form.setValue('fullName', user.fullName)
  }

  const handleDeleteAvatar = () => {
    updateMeMutation.mutate({
      fullName: user.fullName,
      avatar: null
    })
  }

  return (
    <div className='grid grid-cols-12 gap-10'>
      <div className='col-span-8'>
        <Form {...form}>
          <form className='grid gap-6' onSubmit={handleSubmit}>
            {/* Email */}
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input disabled {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            {/* FullName */}
            <FormField
              control={form.control}
              name='fullName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ tên</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex justify-end space-x-2'>
              {/* Submit */}
              <Button type='submit' disabled={isPending}>
                {isPending && <Loader2 className='size-4 animate-spin' />}
                Cập nhật
              </Button>
              {/* Cancel */}
              <Button variant='outline' type='button' onClick={handleCancel}>
                Hủy bỏ
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <div className='col-span-4 px-1 flex flex-col items-center space-y-6'>
        <Avatar className='size-20'>
          <AvatarImage src={avatarPreview || user.avatar} alt={user.fullName} />
          <AvatarFallback className='text-3xl'>
            {user.fullName[0].toUpperCase()}
            {user.fullName[1].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className='text-xs text-muted-foreground text-center space-y-1'>
          <p>Kích thước hình ảnh tiêu chuẩn: Chiều rộng 300px, Chiều cao 300px</p> <p>Dung lượng file tối đa: 2.0MB</p>
          <p>Định dạng file được hỗ trợ: JPG,JPEG,PNG</p>
        </div>
        <div className='flex space-x-2'>
          <InputFile onChange={(files) => handleChangeAvatarFile(files)}>
            <Button type='button' size='sm' variant='outline'>
              <Camera className='w-4 h-4 mr-0.5' />
              Đổi ảnh
            </Button>
          </InputFile>
          {user.avatar && (
            <Button type='button' size='sm' variant='destructive' onClick={handleDeleteAvatar}>
              {isPending && <Loader2 className='size-4 mr-0.5 animate-spin' />}
              {!isPending && <Trash2 className='size-4 mr-0.5' />}
              Xóa ảnh
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
