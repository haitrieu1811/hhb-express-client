import React from 'react'
import { getAccessTokenFromStorage, getProfileFromStorage } from '~/lib/auth'
import { BasicUser } from '~/types/users.types'

type AppContext = {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  profile: BasicUser | null
  setProfile: React.Dispatch<React.SetStateAction<BasicUser | null>>
}

const initialAppContext: AppContext = {
  isAuthenticated: !!getAccessTokenFromStorage(),
  setIsAuthenticated: () => null,
  profile: getProfileFromStorage(),
  setProfile: () => null
}

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = React.createContext(initialAppContext)

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(initialAppContext.isAuthenticated)
  const [profile, setProfile] = React.useState<BasicUser | null>(initialAppContext.profile)

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
