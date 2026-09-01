import { Navigate, Routes, Route } from 'react-router-dom'
import { CustomersContainer } from '@/features/Customers/Root/CustomersContainer'
import { CustomerIdContainer } from '@/features/Customers/[id]/Root/CustomerIdContainer'

export const CustomersRoute = () => {
  return (
    <Routes>
      <Route path='/' element={<CustomersContainer />} />
      <Route path='/:id' element={<CustomerIdContainer />} />
      <Route path='*' element={<Navigate to='/404' replace />} />
    </Routes>
  )
}
