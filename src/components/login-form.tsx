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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import PATH from '~/constants/path'
import { cn, isEntityError } from '~/lib/utils'
import { AppContext } from '~/providers/app.provider'
import { loginSchema, LoginSchema } from '~/rules/users.rules'
import { ErrorResponse } from '~/types/utils.types'

export default function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const { setIsAuthenticated, setProfile } = React.useContext(AppContext)

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const loginMutation = useMutation({
    mutationKey: ['login'],
    mutationFn: usersApis.login,
    onSuccess: (data) => {
      toast.success(data.data.message)
      form.reset()
      setIsAuthenticated(true)
      setProfile(data.data.data.user)
    },
    onError: (errors) => {
      if (isEntityError<ErrorResponse<LoginSchema>>(errors)) {
        const formErrors = errors.response?.data.errors
        if (!isEmpty(formErrors)) {
          Object.keys(formErrors).forEach((key) => {
            form.setError(key as keyof LoginSchema, {
              message: formErrors[key as keyof LoginSchema],
              type: 'Server'
            })
          })
        }
      }
    }
  })

  const handleSubmit = form.handleSubmit((data) => {
    loginMutation.mutate(data)
  })

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl'>Đăng nhập</CardTitle>
          <CardDescription>Chào mừng bạn quay trở lại</CardDescription>
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
                  <div className='flex justify-end text-sm'>
                    <Link to={PATH.FORGOT_PASSWORD} className='underline underline-offset-4'>
                      Quên mật khẩu
                    </Link>
                  </div>
                  <Button type='submit' disabled={loginMutation.isPending} className='w-full'>
                    {loginMutation.isPending && <Loader2 className='w-3 h-3 animate-spin' />}
                    Đăng nhập
                  </Button>
                </div>
                <div className='text-center text-sm'>
                  Bạn chưa có tài khoản?{' '}
                  <Link to={PATH.REGISTER} className='underline underline-offset-4'>
                    Đăng ký tài khoản
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
