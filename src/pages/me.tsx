import { PlusCircle, Tags, UserCheck, UserRoundPlus, UsersRound } from 'lucide-react'
import React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { AppContext } from '~/providers/app.provider'

export default function MePage() {
  const { profile } = React.useContext(AppContext)
  return (
    <div className='py-4 space-y-10'>
      <div className='grid grid-cols-12 gap-20 p-4 border rounded-md'>
        <div className='col-span-6 bg-muted rounded-md p-4 space-y-6'>
          <div className='flex items-center space-x-4'>
            <Avatar className='size-16'>
              <AvatarImage src={profile?.avatar} alt={profile?.fullName} />
              <AvatarFallback>
                {profile?.fullName[0].toUpperCase()}
                {profile?.fullName[1].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className='flex-1'>
              <div className='text-lg font-medium'>{profile?.fullName}</div>
              <div className='text-muted-foreground text-sm'>{profile?.email}</div>
            </div>
          </div>
          <div className='flex justify-end'>
            <Button size='sm' variant='outline'>
              <PlusCircle />
              Theo dõi cửa hàng
            </Button>
          </div>
        </div>
        <div className='col-span-6'>
          <div className='grid grid-cols-12 gap-6'>
            {[
              {
                icon: Tags,
                label: 'Sản phẩm:',
                value: 10
              },
              {
                icon: UsersRound,
                label: 'Người theo dõi:',
                value: 2000
              },
              {
                icon: UserRoundPlus,
                label: 'Đang theo dõi:',
                value: 6
              },
              {
                icon: UserCheck,
                label: 'Tham gia:',
                value: '10 ngày trước.'
              }
            ].map((item, index) => (
              <div key={index} className='col-span-6'>
                <div className='flex items-center space-x-2 text-sm'>
                  <item.icon className='size-4' />
                  <div>{item.label}</div>
                  <div className='font-medium text-destructive'>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Tabs defaultValue='allProducts'>
        <TabsList>
          <TabsTrigger value='allProducts'>Tất cả sản phẩm</TabsTrigger>
          <TabsTrigger value='reviews'>Đánh giá cửa hàng</TabsTrigger>
        </TabsList>
        <TabsContent value='account'>Make changes to your account here.</TabsContent>
        <TabsContent value='reviews'>Change your password here.</TabsContent>
      </Tabs>
    </div>
  )
}
