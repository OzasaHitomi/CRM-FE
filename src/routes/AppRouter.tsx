import { Navigate, Route, Routes } from 'react-router-dom'

import { LoginContainer } from '@/features/Login/Root/LoginContainer'
import { ForbiddenContainer } from '@/features/Error/403/Root/ForbiddenContainer'
import { NotFoundContainer } from '@/features/Error/404/Root/NotFoundContainer'
import { AppLayout } from '@/components/templates/AppLayout'
import { CustomersRoute } from '@/routes/customers/CustomersRoute'
import { AdminRoute } from '@/routes/admin/AdminRoute'
import { RequireAuth } from '@/routes/RequireAuth'

export const AppRouter = () => {
  return (
    <Routes>
      <Route path='/login' element={<LoginContainer />} />
      <Route path='/403' element={<ForbiddenContainer />} />
      <Route path='/404' element={<NotFoundContainer />} />

      <Route path='/' element={<Navigate to='/customers' replace />} />

      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route path='/customers/*' element={<CustomersRoute />} />
        </Route>
      </Route>

      <Route element={<RequireAuth expectedRoles={['admin']} />}>
        <Route element={<AppLayout />}>
          <Route path='/admin/*' element={<AdminRoute />} />
        </Route>
      </Route>

      <Route path='*' element={<Navigate to='/404' replace />} />
    </Routes>
  )
}
