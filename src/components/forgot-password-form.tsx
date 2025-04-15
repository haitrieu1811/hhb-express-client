import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { isEmpty } from 'lodash'
import { Loader2 } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { toast } from 'sonner'

import usersApis from '~/apis/users.apis'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import PATH from '~/constants/path'
import { cn, isEntityError } from '~/lib/utils'
import { forgotPasswordSchema, ForgotPasswordSchema } from '~/rules/users.rules'
import { ErrorResponse } from '~/types/utils.types'

export default function ForgotPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  })

  const forgotPasswordMutation = useMutation({
    mutationKey: ['forgot-password'],
    mutationFn: usersApis.forgotPassword,
    onSuccess: (data) => {
      toast.success(data.data.message)
      form.reset()
    },
    onError: (errors) => {
      if (isEntityError<ErrorResponse<ForgotPasswordSchema>>(errors)) {
        const formErrors = errors.response?.data.errors
        if (!isEmpty(formErrors)) {
          Object.keys(formErrors).forEach((key) => {
            form.setError(key as keyof ForgotPasswordSchema, {
              message: formErrors[key as keyof ForgotPasswordSchema],
              type: 'Server'
            })
          })
        }
      }
    }
  })

  const handleSubmit = form.handleSubmit((data) => {
    forgotPasswordMutation.mutate(data.email)
  })

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl'>Quên mật khẩu</CardTitle>
          <CardDescription>Đừng lo lắng, chúng tôi sẽ giúp bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit}>
              <div className='grid gap-6'>
                <div className='grid gap-6'>
                  {/* Email */}
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem className='gap-3'>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder='m@example.com' {...field} />
                        </FormControl>
                        <FormDescription>
                          Vui lòng nhập đúng email đã tạo trên hệ thống, mail đặt lại mật khẩu có thời hạn sử dụng trong
                          10 phút.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type='submit' disabled={forgotPasswordMutation.isPending} className='w-full'>
                    {forgotPasswordMutation.isPending && <Loader2 className='w-3 h-3 animate-spin' />}
                    Gửi mail cho tôi
                  </Button>
                </div>
                <div className='text-center text-sm'>
                  Bạn đã nhớ mật khẩu?{' '}
                  <Link to={PATH.LOGIN} className='underline underline-offset-4'>
                    Đăng nhập ngay
                  </Link>
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
