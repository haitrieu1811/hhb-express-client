import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { isEmpty } from 'lodash'
import { Loader2 } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { toast } from 'sonner'

import usersApis from '~/apis/users.apis'
import InputPassword from '~/components/input-password'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { UserRole } from '~/constants/enum'
import PATH from '~/constants/path'
import { cn, isEntityError } from '~/lib/utils'
import { AppContext } from '~/providers/app.provider'
import { registerSchema, RegisterSchema } from '~/rules/users.rules'
import { ErrorResponse } from '~/types/utils.types'

export default function RegisterForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const { setIsAuthenticated, setProfile } = React.useContext(AppContext)

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  const registerMutation = useMutation({
    mutationKey: ['register'],
    mutationFn: usersApis.register,
    onSuccess: (data) => {
      toast.success(data.data.message)
      form.reset()
      setIsAuthenticated(true)
      setProfile(data.data.data.user)
    },
    onError: (errors) => {
      if (isEntityError<ErrorResponse<RegisterSchema>>(errors)) {
        const formErrors = errors.response?.data.errors
        if (!isEmpty(formErrors)) {
          Object.keys(formErrors).forEach((key) => {
            form.setError(key as keyof RegisterSchema, {
              message: formErrors[key as keyof RegisterSchema],
              type: 'Server'
            })
          })
        }
      }
    }
  })

  const handleSubmit = form.handleSubmit((data) => {
    registerMutation.mutate({
      ...data,
      role: UserRole.Staff
    })
  })

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl'>Đăng ký tài khoản</CardTitle>
          <CardDescription>Hãy bắt đầu bằng cách tạo tài khoản với email của bạn</CardDescription>
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
                          Sau khi đăng ký tài khoản thành công, chúng tôi sẽ gửi một tin nhắn đến email bạn vừa nhập để
                          xác minh tài khoản.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                  <Button type='submit' disabled={registerMutation.isPending} className='w-full'>
                    {registerMutation.isPending && <Loader2 className='w-3 h-3 animate-spin' />}
                    Đăng ký
                  </Button>
                </div>
                <div className='text-center text-sm'>
                  Bạn đã có tài khoản?{' '}
                  <Link to={PATH.LOGIN} className='underline underline-offset-4'>
                    Đăng nhập
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
