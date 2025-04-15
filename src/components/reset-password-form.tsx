import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { isEmpty } from 'lodash'
import { Loader2 } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router'
import { toast } from 'sonner'

import usersApis from '~/apis/users.apis'
import InputPassword from '~/components/input-password'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { cn, isEntityError } from '~/lib/utils'
import { AppContext } from '~/providers/app.provider'
import { resetPasswordSchema, ResetPasswordSchema } from '~/rules/users.rules'
import { ErrorResponse } from '~/types/utils.types'

export default function ResetPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [searchParams] = useSearchParams()

  const forgotPasswordToken = searchParams.get('token')

  const { setIsAuthenticated, setProfile } = React.useContext(AppContext)

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  })

  const resetPasswordMutation = useMutation({
    mutationKey: ['reset-password'],
    mutationFn: usersApis.resetPassword,
    onSuccess: (data) => {
      toast.success(data.data.message)
      form.reset()
      setIsAuthenticated(true)
      setProfile(data.data.data.user)
    },
    onError: (errors) => {
      if (isEntityError<ErrorResponse<ResetPasswordSchema>>(errors)) {
        const formErrors = errors.response?.data.errors
        if (!isEmpty(formErrors)) {
          Object.keys(formErrors).forEach((key) => {
            form.setError(key as keyof ResetPasswordSchema, {
              message: formErrors[key as keyof ResetPasswordSchema],
              type: 'Server'
            })
          })
        }
      } else {
        toast.error(errors.message)
      }
    }
  })

  const handleSubmit = form.handleSubmit((data) => {
    if (!forgotPasswordToken) return
    resetPasswordMutation.mutate({
      ...data,
      forgotPasswordToken
    })
  })

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl'>Đặt lại mật khẩu</CardTitle>
          <CardDescription>Ghi chú mật khẩu mới lại cẩn thận nhé bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit}>
              <div className='grid gap-6'>
                <div className='grid gap-6'>
                  {/* Mật khẩu */}
                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem className='gap-3'>
                        <FormLabel>Mật khẩu</FormLabel>
                        <FormControl>
                          <InputPassword {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Nhập lại mật khẩu */}
                  <FormField
                    control={form.control}
                    name='confirmPassword'
                    render={({ field }) => (
                      <FormItem className='gap-3'>
                        <FormLabel>Nhập lại mật khẩu</FormLabel>
                        <FormControl>
                          <InputPassword {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type='submit' disabled={resetPasswordMutation.isPending} className='w-full'>
                    {resetPasswordMutation.isPending && <Loader2 className='w-3 h-3 animate-spin' />}
                    Đặt lại mật khẩu
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className='text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary'>
        Bằng cách nhấp vào tiếp tục, bạn đồng ý với <a href='#'>Điều khoản dịch vụ</a> và{' '}
        <a href=''>Chính sách bảo mật</a> của chúng tôi.
      </div>
    </div>
  )
}
