import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import App from '../../App'

// Mock the AuthProvider
jest.mock('../../contexts/AuthContext', () => ({
  AuthProvider: ({ children }) => <div data-testid="auth-provider">{children}</div>,
}))

const renderWithProviders = (component) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </QueryClientProvider>
  )
}

describe('App Component', () => {
  it('renders without crashing', () => {
    renderWithProviders(<App />)
    expect(screen.getByTestId('auth-provider')).toBeInTheDocument()
  })

  it('renders the main container', () => {
    renderWithProviders(<App />)
    const mainContainer = screen.getByRole('main')
    expect(mainContainer).toBeInTheDocument()
  })

  it('has the correct CSS classes', () => {
    renderWithProviders(<App />)
    const mainContainer = screen.getByRole('main')
    expect(mainContainer).toHaveClass('container', 'mx-auto', 'px-4', 'py-8')
  })
}) 