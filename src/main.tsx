import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider as ChakraUIProvider } from './components/ui/provider.tsx'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './core/queryClient.ts'
import { App } from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraUIProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </ChakraUIProvider>
  </StrictMode>,
)
