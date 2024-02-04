/*
 * @Date: 2024-01-18 08:37:41
 * @LastEditors: WWW
 * @LastEditTime: 2024-01-18 14:30:38
 * @FilePath: \vite-react-ts-starter-main\src\layout\index.tsx
 */
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { Nav } from './components/Nav'
import { Main } from './components/Main'

type Props = {}

export const Layout: React.FC<Props> = () => {
  const location = useLocation()

  if (location.pathname === '/') {
    return <Navigate replace to={'/home'} />
  }

  return (
    <>
      {/* <Nav /> */}

      <Main children={<Outlet />} />
    </>
  )
}
