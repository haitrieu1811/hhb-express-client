import {
  Bell,
  ChevronLeft,
  Circle,
  DollarSign,
  Home,
  Info,
  LogIn,
  Menu,
  Newspaper,
  Phone,
  Search,
  ShoppingCart,
  SquareRoundCorner,
  Tags,
  Truck,
  UserRoundPlus,
  X,
  XCircle
} from 'lucide-react'
import React from 'react'
import { Link } from 'react-router'

import { ModeToggle } from '~/components/mode-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '~/components/ui/sheet'
import { Skeleton } from '~/components/ui/skeleton'
import PATH from '~/constants/path'
import useProductCategories from '~/hooks/use-product-categories'
import { AppContext } from '~/providers/app.provider'

export default function ShopHeader() {
  const { isAuthenticated, profile } = React.useContext(AppContext)

  const [searchQuery, setSearchQuery] = React.useState<string>('')

  const { productCategories } = useProductCategories()

  return (
    <header>
      <div className='h-16 flex justify-center items-center border-b'>
        <div className='w-7xl mx-auto flex justify-between items-center space-x-4'>
          <div className='flex items-center space-x-10'>
            {/* Logo */}
            <Link to={PATH.HOME} className='flex items-center space-x-3'>
              <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                <Truck className='size-6' />
              </div>
              <span className='font-bold text-2xl tracking-tight'>MHN</span>
            </Link>
            {/* Danh mục sản phẩm */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant='secondary'>
                  <Menu className='size-4' />
                  Danh mục
                </Button>
              </SheetTrigger>
              <SheetContent className='max-h-screen overflow-y-auto gap-0'>
                <SheetHeader>
                  <SheetTitle>Danh mục sản phẩm</SheetTitle>
                </SheetHeader>
                <div>
                  {productCategories.map((category) => (
                    <Link
                      to={PATH.HOME}
                      key={category._id}
                      className='flex items-center space-x-4 hover:bg-muted duration-100 px-4 py-2 border-t'
                    >
                      <img
                        src={category.thumbnail}
                        alt={category.name}
                        className='size-10 aspect-square object-cover shrink-0 rounded-lg'
                      />
                      <div className='text-sm'>{category.name}</div>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
          {/* Tìm kiếm */}
          <div className='relative'>
            <div className='relative w-md'>
              <div className='absolute left-0 top-1/2 -translate-y-1/2 w-10 flex justify-center'>
                <Search className='size-4' />
              </div>
              <input
                type='text'
                value={searchQuery}
                placeholder='Tìm kiếm sản phẩm ở đây...'
                className='p-2 pl-10 bg-muted w-full rounded-sm text-sm border forcus:border-muted-foreground'
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                className='absolute right-0 top-1/2 -translate-y-1/2 w-10 h-full flex justify-center items-center hover:cursor-pointer'
                onClick={() => setSearchQuery('')}
              >
                <XCircle className='size-5' />
                {/* <Loader2 className='size-4 animate-spin' />} */}
              </button>
            </div>
            {/* Kết quả tìm kiếm */}
            {searchQuery.length > 0 && (
              <div className='absolute top-[120%] left-0 right-0 bg-popover rounded-md border shadow-md outline-hidden'>
                <div className='p-4'>
                  <h3 className='font-medium tracking-tight text-sm'>Kết quả tìm kiếm cho "{searchQuery}"</h3>
                </div>
                <div className='max-h-[400px] overflow-y-auto'>
                  {Array(20)
                    .fill(0)
                    .map((_, index) => (
                      <Link
                        to={PATH.HOME}
                        key={index}
                        className='flex justify-between space-x-4 p-2 border-t hover:bg-muted duration-100'
                      >
                        <Skeleton className='size-12 rounded-lg' />
                        <div className='flex-1'>
                          <h3 className='line-clamp-1 text-sm'>
                            Đèn học PIXAR Bóng LED Chống Cận Bảo Vệ Mắt Đổi 3 Màu Kẹp Bàn Chắc Chắn Tao1501 Bảo Hành 2
                            Năm BA001
                          </h3>
                          <div className='flex items-center space-x-2 text-xs'>
                            <div className='font-semibold'>12.000.000đ</div>
                            <div className='text-muted-foreground line-through'>8.000.000đ</div>
                            <div className='text-red-500 font-semibold'>-8%</div>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
                <div className='flex justify-center p-2'>
                  <Button asChild variant='link' size='sm'>
                    <Link to={PATH.HOME}>Xem tất cả kết quả tìm kiếm</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
          {/* Giỏ hàng, thông báo,... */}
          <div className='flex items-center space-x-4'>
            {isAuthenticated && (
              <React.Fragment>
                {/* Giỏ hàng */}
                <div className='relative'>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant='outline'>
                        <ShoppingCart className='size-4' />
                        Giỏ hàng
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align='end' className='w-sm p-0 pb-4'>
                      <div className='flex justify-between items-center p-4'>
                        <h3 className='font-medium tracking-tight'>Giỏ hàng</h3>
                        <div className='flex items-center space-x-4 text-sm'>
                          <div className='flex items-center space-x-1'>
                            <ShoppingCart className='size-4' />
                            <span>9</span>
                          </div>
                          <div className='flex items-center space-x-1'>
                            <DollarSign className='size-4' />
                            <span>12.000.000đ</span>
                          </div>
                        </div>
                      </div>
                      <div className='max-h-[400px] overflow-y-auto'>
                        {Array(20)
                          .fill(0)
                          .map((_, index) => (
                            <div key={index} className='flex justify-between space-x-4 p-4 border-t'>
                              <Skeleton className='size-16 rounded-lg' />
                              <div className='flex-1 space-y-1'>
                                <Link to={PATH.HOME} className='text-sm line-clamp-2 hover:underline'>
                                  Đèn học PIXAR Bóng LED Chống Cận Bảo Vệ Mắt Đổi 3 Màu Kẹp Bàn Chắc Chắn Tao1501 Bảo
                                  Hành 2 Năm BA001
                                </Link>
                                <div className='flex items-center space-x-2 text-xs'>
                                  <div className='font-semibold'>12.000.000đ</div>
                                  <div className='text-muted-foreground line-through'>8.000.000đ</div>
                                  <div className='flex items-center space-x-1 text-xs'>
                                    <X className='size-3' />4
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                      <div className='flex justify-end pt-2 px-2 space-x-2'>
                        <Button asChild variant='outline' size='sm'>
                          <Link to={PATH.HOME}>Xem giỏ hàng</Link>
                        </Button>
                        <Button asChild size='sm'>
                          <Link to={PATH.HOME}>Thanh toán</Link>
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <div className='absolute top-0 right-0 size-4 rounded-full flex justify-center items-center text-[10px] pointer-events-none font-semibold bg-red-500 text-white'>
                    9
                  </div>
                </div>
                {/* Thông báo */}
                <Popover>
                  <PopoverTrigger asChild>
                    <div className='relative'>
                      <Button variant='outline'>
                        <Bell className='size-4' />
                        Thông báo
                      </Button>
                      <div className='absolute top-0 right-0 size-4 rounded-full flex justify-center items-center text-[10px] pointer-events-none font-semibold bg-red-500 text-white'>
                        9
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent align='end' className='w-sm p-0 pb-4'>
                    <div className='flex justify-between items-center space-x-20 p-4'>
                      <h3 className='font-medium tracking-tight'>Thông báo</h3>
                      <Button size='sm' variant='link'>
                        Đánh dấu tất cả đã đọc
                      </Button>
                    </div>
                    <div className='max-h-[400px] overflow-y-auto'>
                      {Array(20)
                        .fill(0)
                        .map((_, index) => (
                          <Link
                            key={index}
                            to={PATH.HOME}
                            className='flex justify-between items-center space-x-6 p-4 hover:bg-muted duration-100 border-t'
                          >
                            <div className='size-12 bg-muted rounded-lg flex justify-center items-center shrink-0'>
                              <SquareRoundCorner />
                            </div>
                            <div className='space-y-1'>
                              <div className='text-sm font-medium line-clamp-2'>
                                Bài học Tìm hiểu toán tử instanceof mới được thêm vào.
                              </div>
                              <div className='text-muted-foreground text-xs'>1 giờ trước.</div>
                            </div>
                            <Circle className='size-3 stroke-red-500 fill-red-500' />
                          </Link>
                        ))}
                    </div>
                  </PopoverContent>
                </Popover>
                {/* Tài khoản */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant='outline'>
                      <Avatar className='size-5'>
                        <AvatarImage src={profile?.avatar} alt={profile?.fullName} />
                        <AvatarFallback>
                          {profile?.fullName[0].toUpperCase()}
                          {profile?.fullName[1].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className='flex flex-1'>
                        <h3 className='font-medium text-sm'>{profile?.fullName}</h3>
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align='end' className='p-0 w-2xs'>
                    <div className='flex items-center space-x-4 p-4'>
                      <Avatar className='size-10 shrink-0'>
                        <AvatarImage src={profile?.avatar} alt={profile?.fullName} />
                        <AvatarFallback>
                          {profile?.fullName[0].toUpperCase()}
                          {profile?.fullName[1].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className='flex-1 text-sm'>
                        <h3 className='font-medium'>{profile?.fullName}</h3>
                        <div className='text-muted-foreground'>{profile?.email}</div>
                      </div>
                    </div>
                    <div>
                      <Button asChild variant='ghost' className='w-full justify-start rounded-none border-t h-10'>
                        <Link to={PATH.HOME}>Tài khoản</Link>
                      </Button>
                      <Button asChild variant='ghost' className='w-full justify-start rounded-none border-t h-10'>
                        <Link to={PATH.HOME}>Quản lý đơn hàng</Link>
                      </Button>
                      <Button asChild variant='ghost' className='w-full justify-start rounded-none border-t h-10'>
                        <Link to={PATH.HOME}>Quản lý địa chỉ</Link>
                      </Button>
                      <Button asChild variant='ghost' className='w-full justify-start rounded-none border-t h-10'>
                        <Link to={PATH.HOME}>Đăng xuất</Link>
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </React.Fragment>
            )}
            {!isAuthenticated && (
              <div className='flex space-x-1'>
                <Button asChild size='sm' variant='outline'>
                  <Link to={PATH.REGISTER}>
                    <UserRoundPlus className='size-4' />
                    Đăng ký
                  </Link>
                </Button>
                <Button asChild size='sm'>
                  <Link to={PATH.LOGIN}>
                    <LogIn />
                    Đăng nhập
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='bg-background border-b h-12 flex items-center'>
        <div className='w-7xl mx-auto'>
          <div className='flex justify-between'>
            <div>
              <Button size='sm' variant='outline'>
                <ChevronLeft />
                Quay lại
              </Button>
            </div>
            <nav className='flex justify-center items-center space-x-4'>
              <Button asChild size='sm' variant='ghost'>
                <Link to={PATH.HOME}>
                  <Home className='size-4' />
                  Trang chủ
                </Link>
              </Button>
              <Button asChild size='sm' variant='ghost'>
                <Link to={PATH.HOME}>
                  <Tags className='size-4' />
                  Tất cả sản phẩm
                </Link>
              </Button>
              <Button asChild size='sm' variant='ghost'>
                <Link to={PATH.HOME}>
                  <Info className='size-4' />
                  Giới thiệu
                </Link>
              </Button>
              <Button asChild size='sm' variant='ghost'>
                <Link to={PATH.HOME}>
                  <Phone className='size-4' />
                  Liên hệ
                </Link>
              </Button>
              <Button asChild size='sm' variant='ghost'>
                <Link to={PATH.HOME}>
                  <Newspaper className='size-4' />
                  Tin tức
                </Link>
              </Button>
            </nav>
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
