import React from 'react'
import { Link, Outlet, useLocation } from 'react-router'

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { USER_MENU } from '~/constants/data'
import { cn } from '~/lib/utils'
import { AppContext } from '~/providers/app.provider'

export default function AccountPage() {
  const location = useLocation()

  const { profile } = React.useContext(AppContext)

  return (
    <div className='flex justify-between space-x-6 py-6'>
      <aside className='space-y-4 w-1/5'>
        <div className='flex items-center space-x-4'>
          <Avatar>
            <AvatarImage src={profile?.avatar} alt={profile?.fullName} />
            <AvatarFallback>
              {profile?.fullName[0].toUpperCase()}
              {profile?.fullName[1].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className='flex-1'>
            <h3 className='text-sm font-medium'>{profile?.fullName}</h3>
            <div className='text-muted-foreground text-xs'>{profile?.email}</div>
          </div>
        </div>
        <div className='space-y-2'>
          {USER_MENU.map((item) => {
            const isActive = item.to === location.pathname
            return (
              <Button
                asChild
                key={item.label}
                variant='ghost'
                disabled={isActive}
                className={cn('w-full justify-start', {
                  'bg-muted': isActive
                })}
              >
                <Link to={item.to}>
                  <item.icon className='size-4' />
                  {item.label}
                </Link>
              </Button>
            )
          })}
        </div>
      </aside>
      <div className='flex-1'>
        <Outlet />
      </div>
    </div>
  )
}
