import {
  ChartColumnStacked,
  Flag,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  ShoppingBag,
  Truck,
  UsersRound
} from 'lucide-react'
import * as React from 'react'
import { Link } from 'react-router'

import { NavMain } from '~/components/nav-main'
import { NavProjects } from '~/components/nav-projects'
import { NavSecondary } from '~/components/nav-secondary'
import { NavUser } from '~/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '~/components/ui/sidebar'
import PATH from '~/constants/path'
import { AppContext } from '~/providers/app.provider'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { profile } = React.useContext(AppContext)

  const data = React.useMemo(
    () => ({
      user: {
        name: profile?.fullName ?? '',
        email: profile?.email ?? '',
        avatar: '/avatars/shadcn.jpg'
      },
      navMain: [
        {
          title: 'Người dùng',
          url: PATH.DASHBOARD_USER,
          icon: UsersRound,
          isActive: true,
          items: [
            {
              title: 'Danh sách',
              url: PATH.DASHBOARD_USER
            },
            {
              title: 'Thêm mới',
              url: '#'
            }
          ]
        },
        {
          title: 'Danh mục sản phẩm',
          url: '#',
          icon: ChartColumnStacked,
          items: [
            {
              title: 'Danh sách',
              url: '#'
            },
            {
              title: 'Thêm mới',
              url: '#'
            }
          ]
        },
        {
          title: 'Nhãn hiệu sản phẩm',
          url: '#',
          icon: Flag,
          items: [
            {
              title: 'Danh sách',
              url: '#'
            },
            {
              title: 'Thêm mới',
              url: '#'
            },
            {
              title: 'Thống kê doanh thu',
              url: '#'
            }
          ]
        },
        {
          title: 'Sản phẩm',
          url: '#',
          icon: ShoppingBag,
          items: [
            {
              title: 'Danh sách',
              url: '#'
            },
            {
              title: 'Thêm mới',
              url: '#'
            },
            {
              title: 'Thống kê doanh thu',
              url: '#'
            }
          ]
        },
        {
          title: 'Cài đặt',
          url: '#',
          icon: Settings2,
          items: [
            {
              title: 'Chung',
              url: '#'
            },
            {
              title: 'Nhóm',
              url: '#'
            },
            {
              title: 'Giao diện',
              url: '#'
            }
          ]
        }
      ],
      navSecondary: [
        {
          title: 'Hỗ trợ',
          url: '#',
          icon: LifeBuoy
        },
        {
          title: 'Phản hồi',
          url: '#',
          icon: Send
        }
      ],
      projects: [
        {
          name: 'Design Engineering',
          url: '#',
          icon: Frame
        },
        {
          name: 'Sales & Marketing',
          url: '#',
          icon: PieChart
        },
        {
          name: 'Travel',
          url: '#',
          icon: Map
        }
      ]
    }),
    [profile]
  )

  return (
    <Sidebar variant='inset' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <Link to={PATH.DASHBOARD}>
                <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                  <Truck className='size-4' />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>MuaHangNhanh</span>
                  <span className='truncate text-xs'>Dashboard</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className='mt-auto' />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
