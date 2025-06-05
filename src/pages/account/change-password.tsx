import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import isEmpty from 'lodash/isEmpty'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import usersApis from '~/apis/users.apis'
import InputPassword from '~/components/input-password'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { isEntityError } from '~/lib/utils'
import { ChangePasswordSchema, changePasswordSchema } from '~/rules/users.rules'
import { ErrorResponse } from '~/types/utils.types'

export default function AccountChangePasswordPage() {
  const form = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: '',
      password: '',
      confirmPassword: ''
    }
  })

  const changePasswordMutation = useMutation({
    mutationKey: ['change-password'],
    mutationFn: usersApis.changePassword,
    onSuccess: (data) => {
      toast.success(data.data.message)
      form.reset()
    },
    onError: (error) => {
      if (isEntityError<ErrorResponse<ChangePasswordSchema>>(error)) {
        const formErrors = error.response?.data.errors
        if (!isEmpty(formErrors)) {
          Object.keys(formErrors).forEach((key) => {
            form.setError(key as keyof ChangePasswordSchema, {
              message: formErrors[key as keyof ChangePasswordSchema],
              type: 'Server'
            })
          })
        }
      }
    }
  })

  const handleSubmit = form.handleSubmit((data) => {
    changePasswordMutation.mutate(data)
  })

  return (
    <Card className='rounded-md'>
      <CardHeader>
        <CardTitle className='text-lg'>Đổi mật khẩu</CardTitle>
        <CardDescription>Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className='space-y-8' onSubmit={handleSubmit}>
            {/* Mật khẩu cũ */}
            <FormField
              control={form.control}
              name='oldPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu cũ</FormLabel>
                  <FormControl>
                    <InputPassword {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Mật khẩu mới */}
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu mới</FormLabel>
                  <FormControl>
                    <InputPassword {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Nhật lại mật khẩu mới */}
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nhập lại mật khẩu mới</FormLabel>
                  <FormControl>
                    <InputPassword {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Submit */}
            <div className='flex justify-end'>
              <Button type='submit'>
                {changePasswordMutation.isPending && <Loader2 className='size-4 animate-spin' />}
                Đổi mật khẩu
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
