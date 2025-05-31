import React from 'react'

import ShopFooter from '~/components/shop-footer'
import ShopHeader from '~/components/shop-header'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      <ShopHeader />
      <main className='min-h-screen'>{children}</main>
      <ShopFooter />
    </React.Fragment>
  )
}
