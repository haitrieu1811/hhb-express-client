import React from 'react'
import ShopHeader from '~/components/shop-header'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <ShopHeader />
      {children}
    </div>
  )
}
