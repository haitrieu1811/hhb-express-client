import {
  Bell,
  Circle,
  DollarSign,
  Home,
  Info,
  LayoutDashboard,
  Loader2,
  Menu,
  PencilLine,
  Phone,
  Search,
  SearchX,
  ShoppingCart,
  SquareRoundCorner,
  Tags,
  Truck,
  X
} from 'lucide-react'
import React from 'react'
import { createSearchParams, Link, useLocation } from 'react-router'

import { ModeToggle } from '~/components/mode-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip'
import { USER_MENU } from '~/constants/data'
import PATH from '~/constants/path'
import useDebounce from '~/hooks/use-debounce'
import useProductCategories from '~/hooks/use-product-categories'
import usePublicProducts from '~/hooks/use-public-products'
import useQueryParams from '~/hooks/use-query-params'
import { cn, formatCurrency, rateSale } from '~/lib/utils'
import { AppContext } from '~/providers/app.provider'

const NAV_LINKS = [
  {
    path: PATH.HOME,
    label: 'Trang chủ',
    icon: Home
  },
  {
    path: PATH.PRODUCTS,
    label: 'Tất cả sản phẩm',
    icon: Tags
  },
  {
    path: '/info',
    label: 'Giới thiệu',
    icon: Info
  },
  {
    path: '/contact',
    label: 'Liên hệ',
    icon: Phone
  },
  {
    path: PATH.BLOGS,
    label: 'Blogs',
    icon: PencilLine
  }
] as const

export default function ShopHeader() {
  const location = useLocation()
  const queryParams = useQueryParams()

  const { isAuthenticated, profile, myCart, totalCartItems, totalCartAmount } = React.useContext(AppContext)

  const searchCategoryRef = React.useRef<HTMLInputElement>(null)
  const searchRef = React.useRef<HTMLInputElement>(null)

  const [searchQuery, setSearchQuery] = React.useState<string>('')
  const [isSearching, setIsSearching] = React.useState<boolean>(false)
  const [searchCategoryQuery, setSearchCategoryQuery] = React.useState<string>('')
  const [isOpenCategoriesDialog, setIsOpenCategoriesDialog] = React.useState<boolean>(false)

  const searchCategoryQueryDebounce = useDebounce(searchCategoryQuery, 1500)
  const searchQueryDebounce = useDebounce(searchQuery, 1500)

  const { productCategories, getProductCategoriesQuery, totalProductCategories } = useProductCategories({
    name: searchCategoryQueryDebounce,
    enabled: isOpenCategoriesDialog
  })

  const { products, totalProducts, getProductsQuery } = usePublicProducts({
    name: searchQueryDebounce,
    enabled: searchQueryDebounce.trim().length > 0
  })

  const handleCancelSearchCategory = () => {
    setSearchCategoryQuery('')
    searchCategoryRef.current?.focus()
  }

  const handleCancelSearch = () => {
    setSearchQuery('')
    searchRef.current?.focus()
  }

  return (
    <header className='sticky top-0 inset-x-0 z-10 bg-card'>
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
            <Button variant='secondary' onClick={() => setIsOpenCategoriesDialog(true)}>
              <Menu className='size-4' />
              Danh mục
            </Button>
            <Dialog open={isOpenCategoriesDialog} onOpenChange={(value) => setIsOpenCategoriesDialog(value)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Danh mục sản phẩm</DialogTitle>
                  <DialogDescription>Có {totalProductCategories} danh mục sản phẩm</DialogDescription>
                </DialogHeader>
                {/* Tìm kiếm danh mục sản phẩm */}
                <div className='relative'>
                  <div className='absolute top-0 bottom-0 left-0 w-10 flex justify-center items-center'>
                    <Search className='size-4' />
                  </div>
                  <Input
                    ref={searchCategoryRef}
                    value={searchCategoryQuery}
                    placeholder='Tìm kiếm danh mục sản phẩm...'
                    className='px-10'
                    onChange={(e) => setSearchCategoryQuery(e.target.value)}
                  />
                  <div className='absolute top-0 bottom-0 right-0 w-10 flex justify-center items-center'>
                    {getProductCategoriesQuery.isLoading && <Loader2 className='size-4 animate-spin' />}
                    {!getProductCategoriesQuery.isLoading && searchCategoryQuery.length > 0 && (
                      <button
                        className='size-full flex justify-center items-center hover:cursor-pointer'
                        onClick={handleCancelSearchCategory}
                      >
                        <X className='size-4' />
                      </button>
                    )}
                  </div>
                </div>
                {/* Kết quả tìm kiếm */}
                {totalProductCategories > 0 && !getProductCategoriesQuery.isLoading && (
                  <div className='grid grid-cols-12 gap-4'>
                    {productCategories.map((category) => (
                      <div key={category._id} className='col-span-6'>
                        <Link
                          to={{
                            pathname: PATH.PRODUCTS,
                            search: createSearchParams({
                              ...queryParams,
                              categoryIds: category._id
                            }).toString()
                          }}
                          className='flex items-center space-x-4 hover:bg-muted duration-100 px-4 py-2 rounded-md border-t first:border-t-0'
                        >
                          <img
                            src={category.thumbnail}
                            alt={category.name}
                            className='size-10 aspect-square object-cover shrink-0 rounded-md'
                          />
                          <div className='text-sm capitalize font-medium'>{category.name}</div>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
                {/* Không tìm thấy sản phẩm */}
                {totalProductCategories === 0 && !getProductCategoriesQuery.isLoading && (
                  <div className='flex justify-center items-center p-4 space-x-2 text-muted-foreground'>
                    <SearchX className='size-4' />
                    <p className='text-sm'>Không có danh mục sản phẩm trùng khớp.</p>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
          {/* Tìm kiếm */}
          <div className='relative'>
            <div className='relative w-md'>
              <div className='absolute left-0 top-1/2 -translate-y-1/2 w-10 flex justify-center'>
                <Search className='size-4' />
              </div>
              <input
                ref={searchRef}
                type='text'
                value={searchQuery}
                placeholder='Tìm kiếm sản phẩm ở đây...'
                className='p-2 pl-10 bg-muted w-full rounded-sm text-sm border forcus:border-muted-foreground'
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearching(true)}
              />
              {getProductsQuery.isLoading && (
                <div className='absolute right-0 inset-y-0 w-10 flex justify-center items-center'>
                  <Loader2 className='size-4 animate-spin' />
                </div>
              )}
              {searchQuery.length > 0 && !getProductsQuery.isLoading && (
                <div className='absolute right-0 inset-y-0 w-10 flex justify-center items-center'>
                  <button className='hover:cursor-pointer' onClick={handleCancelSearch}>
                    <X className='size-5' />
                  </button>
                </div>
              )}
            </div>
            {/* Kết quả tìm kiếm */}
            {searchQuery.length > 0 && !getProductsQuery.isLoading && isSearching && (
              <div className='absolute top-[120%] left-0 right-0 bg-popover rounded-md border shadow-md outline-hidden py-2'>
                {totalProducts > 0 && !getProductsQuery.isLoading && (
                  <React.Fragment>
                    <div className='px-4 pb-4 pt-2'>
                      <h3 className='font-medium tracking-tight text-sm'>Kết quả tìm kiếm cho "{searchQuery}"</h3>
                    </div>
                    <div className='max-h-[400px] overflow-y-auto'>
                      {products.slice(0, 5).map((product) => (
                        <Link
                          to={PATH.PRODUCT_DETAIL({
                            name: product.name,
                            id: product._id
                          })}
                          key={product._id}
                          className='flex justify-between space-x-4 px-4 py-2 border-t hover:bg-muted duration-100'
                        >
                          <img
                            src={product.thumbnail.url}
                            alt={product.name}
                            className='size-14 rounded-md object-cover shrink-0'
                          />
                          <div className='flex-1 space-y-0.5'>
                            <h3 className='line-clamp-1 text-sm'>{product.name}</h3>
                            <div className='flex items-center space-x-2 text-xs'>
                              {product.priceAfterDiscount < product.price ? (
                                <React.Fragment>
                                  <div className='font-semibold'>
                                    {formatCurrency(product.priceAfterDiscount)}&#8363;
                                  </div>
                                  <div className='text-muted-foreground line-through'>
                                    {formatCurrency(product.price)}&#8363;
                                  </div>
                                  <div className='text-primary font-semibold p-0.5 bg-primary/10 rounded'>
                                    -{rateSale(product.price, product.priceAfterDiscount)}%
                                  </div>
                                </React.Fragment>
                              ) : (
                                <div className='font-semibold'>{formatCurrency(product.price)}&#8363;</div>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    {totalProducts > 5 && (
                      <div className='flex justify-center p-2'>
                        <Button asChild variant='link' size='sm'>
                          <Link to={PATH.HOME}>Xem tất cả kết quả tìm kiếm</Link>
                        </Button>
                      </div>
                    )}
                  </React.Fragment>
                )}
                {totalProducts === 0 && !getProductsQuery.isLoading && (
                  <div className=' flex justify-center items-center p-4 space-x-1 text-muted-foreground'>
                    <SearchX className='size-4' />
                    <p className='text-sm'>Không tìm thấy sản phẩm trùng khớp.</p>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Giỏ hàng, thông báo,... */}
          <div className='flex items-center space-x-4'>
            {isAuthenticated && (
              <React.Fragment>
                {/* Thông báo */}
                <Popover>
                  <PopoverTrigger asChild>
                    <div className='relative'>
                      <Button variant='outline'>
                        <Bell className='size-4' />
                        Thông báo
                      </Button>
                      <div className='absolute -top-1 -right-1'>
                        <Badge className='h-4 min-w-4 rounded-full px-1 tabular-nums'>9</Badge>
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
                            <Circle className='size-3 stroke-destructive fill-destructive' />
                          </Link>
                        ))}
                    </div>
                  </PopoverContent>
                </Popover>
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
                        {totalCartItems > 0 && (
                          <div className='flex items-center space-x-4 text-sm'>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className='flex items-center space-x-1'>
                                  <ShoppingCart className='size-4' />
                                  <span className='font-medium'>{totalCartItems}</span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>Số lượng sản phẩm</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className='flex items-center space-x-1'>
                                  <DollarSign className='size-4' />
                                  <span className='font-medium'>{formatCurrency(totalCartAmount)}&#8363;</span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>Tổng tiền sản phẩm</TooltipContent>
                            </Tooltip>
                          </div>
                        )}
                      </div>
                      {totalCartItems > 0 && (
                        <React.Fragment>
                          <div className='max-h-[400px] overflow-y-auto'>
                            {myCart.map((cartItem) => (
                              <div key={cartItem._id} className='flex justify-between space-x-4 p-4 border-t'>
                                <img
                                  src={cartItem.product.thumbnail}
                                  alt={cartItem.product.name}
                                  className='size-16 rounded-lg shrink-0'
                                />
                                <div className='flex-1 space-y-1'>
                                  <Link
                                    to={PATH.PRODUCT_DETAIL({
                                      name: cartItem.product.name,
                                      id: cartItem.product._id
                                    })}
                                    className='text-sm line-clamp-2 hover:underline'
                                  >
                                    {cartItem.product.name}
                                  </Link>
                                  <div className='flex items-center space-x-2 text-sm'>
                                    {cartItem.unitPriceAfterDiscount < cartItem.unitPrice ? (
                                      <React.Fragment>
                                        <div className='font-medium text-primary'>
                                          {formatCurrency(cartItem.unitPriceAfterDiscount)}&#8363;
                                        </div>
                                        <div className='text-muted-foreground line-through'>
                                          {' '}
                                          {formatCurrency(cartItem.unitPrice)}&#8363;
                                        </div>
                                      </React.Fragment>
                                    ) : (
                                      <div className='font-medium text-primary'>
                                        {formatCurrency(cartItem.unitPrice)}&#8363;
                                      </div>
                                    )}
                                    <div className='flex items-center space-x-1 text-sm'>
                                      <X className='size-3' />
                                      {cartItem.quantity}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className='flex justify-end pt-2 px-2 space-x-2'>
                            <Button asChild variant='outline' size='sm'>
                              <Link to={PATH.CART_LIST}>Xem giỏ hàng</Link>
                            </Button>
                            <Button asChild size='sm'>
                              <Link to={PATH.CART_ORDER_INFO}>Thanh toán</Link>
                            </Button>
                          </div>
                        </React.Fragment>
                      )}
                    </PopoverContent>
                  </Popover>
                  {totalCartItems > 0 && (
                    <div className='absolute -top-1 -right-1'>
                      <Badge className='h-4 min-w-4 rounded-full px-1 tabular-nums'>
                        {totalCartItems > 9 ? '9+' : totalCartItems}
                      </Badge>
                    </div>
                  )}
                </div>
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
                    <div className='pb-2'>
                      {USER_MENU.map((item) => (
                        <Button
                          key={item.label}
                          asChild
                          variant='ghost'
                          className='w-full justify-start rounded-none border-t h-10'
                        >
                          <Link to={item.to}>
                            <item.icon className='size-4' />
                            {item.label}
                          </Link>
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </React.Fragment>
            )}
            {!isAuthenticated && (
              <div className='flex space-x-1'>
                <Button asChild size='sm' variant='outline'>
                  <Link to={PATH.REGISTER}>Đăng ký</Link>
                </Button>
                <Button asChild size='sm'>
                  <Link to={PATH.LOGIN}>Đăng nhập</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='bg-card h-12 flex items-center border-b'>
        <div className='w-7xl mx-auto'>
          <div className='flex justify-between'>
            <div>
              <Button asChild variant='ghost'>
                <Link to={PATH.DASHBOARD}>
                  <LayoutDashboard className='size-4' />
                  Trang quản trị
                </Link>
              </Button>
            </div>
            {/* Nav links */}
            <nav className='flex justify-center items-center space-x-4'>
              {NAV_LINKS.map((item, index) => (
                <Button
                  key={index}
                  asChild
                  size='sm'
                  variant='ghost'
                  className={cn('transition', {
                    'pointer-events-none bg-primary/10 text-primary': item.path === location.pathname
                  })}
                >
                  <Link to={item.path}>
                    <item.icon className='size-4' />
                    {item.label}
                  </Link>
                </Button>
              ))}
            </nav>
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
