import { createContext, useContext } from 'react'
import type { Route } from './router'

const NavContext = createContext<(route: Route) => void>(() => {})
export const NavProvider = NavContext.Provider
export const useNavigate = () => useContext(NavContext)
