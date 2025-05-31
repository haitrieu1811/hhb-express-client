import React from 'react'

import ShopFooter from '~/components/shop-footer'
import ShopHeader from '~/components/shop-header'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      <ShopHeader />
      <main className='min-h-screen py-4'>
        <div className='w-7xl mx-auto'>{children}</div>
      </main>
      <ShopFooter />
    </React.Fragment>
  )
}
