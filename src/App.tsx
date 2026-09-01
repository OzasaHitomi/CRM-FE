import { AppRouter } from '@/routes/AppRouter'
import { Toaster } from './components/ui/toaster'

export const App = () => {
  return (
    <>
      <AppRouter />
      <Toaster />
    </>
  )
}
