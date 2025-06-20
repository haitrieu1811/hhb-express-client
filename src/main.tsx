import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRoot } from 'react-dom/client'

import { Toaster } from '~/components/ui/sonner'
import { TooltipProvider } from '~/components/ui/tooltip.tsx'
import AppProvider from '~/providers/app.provider.tsx'
import { ThemeProvider } from '~/providers/theme.provider.tsx'
import App from './App.tsx'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false
    }
  }
})

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AppProvider>
        <TooltipProvider>
          <App />
          <Toaster richColors position='top-center' />
        </TooltipProvider>
      </AppProvider>
    </ThemeProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
  // </StrictMode>
)
