import { Navigate, Outlet } from 'react-router-dom'

import { LoadingPage } from '@/components/pages/LoadingPage'
import { useGetMeQuery } from '@/share/hooks/queries/useGetMeQuery'
import type { AccountType } from '@/share/types/accountType'

type RequireAuthProps = {
  expectedRoles?: AccountType[]
}

export const RequireAuth = ({ expectedRoles }: RequireAuthProps) => {
  const { data: me, isLoading, isError } = useGetMeQuery()

  if (isLoading) return <LoadingPage />
  if (isError || !me) return <Navigate to='/login' replace />
  if (expectedRoles && !expectedRoles.includes(me.role)) return <Navigate to='/403' replace />
  return <Outlet />
}
