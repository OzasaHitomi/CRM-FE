import { Navigate, Routes, Route } from 'react-router-dom'
import { AdminUsersContainer } from '@/features/Admin/Users/Root/AdminUsersContainer'

export const AdminRoute = () => {
  return (
    <Routes>
      <Route path='/users' element={<AdminUsersContainer />} />
      <Route path='*' element={<Navigate to='/404' replace />} />
    </Routes>
  )
}
