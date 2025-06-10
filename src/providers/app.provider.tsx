import React from 'react'

import useCart from '~/hooks/use-cart'
import { getAccessTokenFromStorage, getProfileFromStorage } from '~/lib/auth'
import { CartItem } from '~/types/cartItems.types'
import { User } from '~/types/users.types'

type ExtendedCartItem = CartItem & {
  checked: boolean
}

type AppContext = {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  profile: User | null
  setProfile: React.Dispatch<React.SetStateAction<User | null>>
  myCart: CartItem[]
  totalCartItems: number
  totalCartAmount: number
  extendedMyCart: ExtendedCartItem[]
  setExtendedMyCart: React.Dispatch<React.SetStateAction<ExtendedCartItem[]>>
}

const initialAppContext: AppContext = {
  isAuthenticated: !!getAccessTokenFromStorage(),
  setIsAuthenticated: () => null,
  profile: getProfileFromStorage(),
  setProfile: () => null,
  myCart: [],
  totalCartItems: 0,
  totalCartAmount: 0,
  extendedMyCart: [],
  setExtendedMyCart: () => null
}

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = React.createContext(initialAppContext)

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const { myCart, totalItems: totalCartItems, totalAmount: totalCartAmount } = useCart({})

  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(initialAppContext.isAuthenticated)
  const [profile, setProfile] = React.useState<User | null>(initialAppContext.profile)
  const [extendedMyCart, setExtendedMyCart] = React.useState<ExtendedCartItem[]>([])

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile,
        myCart,
        totalCartItems,
        totalCartAmount,
        extendedMyCart,
        setExtendedMyCart
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
