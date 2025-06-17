import { Link, Outlet, useLocation } from 'react-router'

import { Button } from '~/components/ui/button'
import { USER_MENU } from '~/constants/data'
import { cn } from '~/lib/utils'

export default function AccountPage() {
  const location = useLocation()
  return (
    <div className='flex justify-between items-start space-x-4'>
      <aside className='space-y-4 w-1/5 bg-card p-2 rounded-md border sticky top-32'>
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
                  'bg-primary/10 text-primary pointer-events-none': isActive
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
