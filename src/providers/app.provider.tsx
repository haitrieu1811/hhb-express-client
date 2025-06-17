import keyBy from 'lodash/keyBy'
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
  checkedCartItems: ExtendedCartItem[]
  totalCheckedCartItems: number
  totalCheckedAmount: number
  isLoadingCart: boolean
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
  setExtendedMyCart: () => null,
  checkedCartItems: [],
  totalCheckedCartItems: 0,
  totalCheckedAmount: 0,
  isLoadingCart: false
}

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = React.createContext(initialAppContext)

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const { myCart, totalItems: totalCartItems, totalAmount: totalCartAmount, getMyCartQuery } = useCart({})

  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(initialAppContext.isAuthenticated)
  const [profile, setProfile] = React.useState<User | null>(initialAppContext.profile)
  const [extendedMyCart, setExtendedMyCart] = React.useState<ExtendedCartItem[]>([])

  const checkedCartItems = React.useMemo(() => extendedMyCart.filter((cartItem) => cartItem.checked), [extendedMyCart])

  const totalCheckedCartItems = checkedCartItems.reduce((acc, cartItem) => (acc += cartItem.quantity), 0)

  const totalCheckedAmount = checkedCartItems.reduce(
    (acc, cartItem) => (acc += cartItem.quantity * cartItem.unitPriceAfterDiscount),
    0
  )

  React.useEffect(() => {
    setExtendedMyCart((prevState) => {
      const extendedMyCartObject = keyBy(prevState, '_id')
      return myCart.map((cartItem) => ({
        ...cartItem,
        checked: !!extendedMyCartObject[cartItem._id]?.checked
      }))
    })
  }, [myCart, setExtendedMyCart])

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
        setExtendedMyCart,
        checkedCartItems,
        totalCheckedCartItems,
        totalCheckedAmount,
        isLoadingCart: getMyCartQuery.isLoading
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
