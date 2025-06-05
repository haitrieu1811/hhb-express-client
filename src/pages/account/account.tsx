import { Link, Outlet, useLocation } from 'react-router'

import { Button } from '~/components/ui/button'
import { USER_MENU } from '~/constants/data'
import { cn } from '~/lib/utils'

export default function AccountPage() {
  const location = useLocation()
  return (
    <div className='flex justify-between space-x-6 py-6'>
      <aside className='space-y-2 w-1/6'>
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
      </aside>
      <div className='flex-1'>
        <Outlet />
      </div>
    </div>
  )
}
