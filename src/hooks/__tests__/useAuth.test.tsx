import { renderHook, waitFor } from '@testing-library/react'
import { useAuth } from '../useAuth'
import { signIn, signOut } from 'next-auth/react'
import toast from 'react-hot-toast'
import { TOAST_MESSAGES, TOAST_CONFIG } from '@/constants/toast'

// Mock next-auth
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
}))

// Mock react-hot-toast
jest.mock('react-hot-toast', () => {
  const mockToast = {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
  }
  return {
    __esModule: true,
    default: mockToast,
    toast: mockToast,
  }
})

// Mock fetch
global.fetch = jest.fn()

// Mock implementations
const createDelayedPromise = function<T>(value: T, delay: number): Promise<T> {
  return new Promise(resolve => {
    setTimeout(() => resolve(value), delay)
  })
}

const mockDelayedSignIn = () => createDelayedPromise({ ok: true }, 100)
const mockDelayedFetch = () => createDelayedPromise({
  ok: true,
  json: () => Promise.resolve({ message: 'User registered' })
}, 100)

describe('useAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('login', () => {
    it('handles successful login', async () => {
      ;(signIn as jest.Mock).mockResolvedValueOnce({ ok: true })

      const { result } = renderHook(() => useAuth())
      await result.current.login({ email: 'test@test.com', password: 'password' })

      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: 'test@test.com',
        password: 'password',
        redirect: false,
      })
      expect(toast.success).toHaveBeenCalledWith(TOAST_MESSAGES.auth.loginSuccess, TOAST_CONFIG)
    })

    it('handles login error', async () => {
      ;(signIn as jest.Mock).mockResolvedValueOnce({ error: 'Invalid credentials' })

      const { result } = renderHook(() => useAuth())
      await result.current.login({ email: 'test@test.com', password: 'wrong' })

      expect(toast.error).toHaveBeenCalledWith(TOAST_MESSAGES.auth.loginError, TOAST_CONFIG)
    })
  })

  describe('register', () => {
    it('handles successful registration', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ message: 'User registered' }),
      })
      ;(signIn as jest.Mock).mockResolvedValueOnce({ ok: true })

      const { result } = renderHook(() => useAuth())
      await result.current.register({
        name: 'Test User',
        email: 'test@test.com',
        password: 'password',
        confirmPassword: 'password',
      })

      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: 'test@test.com',
        password: 'password',
        redirect: false,
      })
      expect(toast.success).toHaveBeenCalledWith(TOAST_MESSAGES.auth.registerSuccess, TOAST_CONFIG)
    })

    it('handles registration error', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error(TOAST_MESSAGES.auth.registerError))

      const { result } = renderHook(() => useAuth())
      await result.current.register({
        name: 'Test User',
        email: 'test@test.com',
        password: 'password',
        confirmPassword: 'password',
      })

      expect(toast.error).toHaveBeenCalledWith(TOAST_MESSAGES.auth.registerError, TOAST_CONFIG)
    })
  })

  describe('logout', () => {
    it('handles successful logout', async () => {
      ;(signOut as jest.Mock).mockResolvedValueOnce(undefined)

      const { result } = renderHook(() => useAuth())
      await result.current.logout()

      expect(signOut).toHaveBeenCalled()
      expect(toast.success).toHaveBeenCalledWith(TOAST_MESSAGES.auth.logoutSuccess, TOAST_CONFIG)
    })

    it('handles logout error', async () => {
      ;(signOut as jest.Mock).mockRejectedValueOnce(new Error('Logout failed'))

      const { result } = renderHook(() => useAuth())
      await result.current.logout()

      expect(toast.error).toHaveBeenCalledWith(TOAST_MESSAGES.auth.logoutError, TOAST_CONFIG)
    })
  })

  describe('manages loading state correctly', () => {
    it('updates loading state during login', async () => {
      ;(signIn as jest.Mock).mockImplementation(mockDelayedSignIn)

      const { result } = renderHook(() => useAuth())
      const loginPromise = result.current.login({ email: 'test@test.com', password: 'password' })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(true)
      })

      jest.advanceTimersByTime(100)
      await loginPromise

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
    })

    it('updates loading state during registration', async () => {
      ;(global.fetch as jest.Mock).mockImplementation(mockDelayedFetch)
      ;(signIn as jest.Mock).mockResolvedValueOnce({ ok: true })

      const { result } = renderHook(() => useAuth())
      const registerPromise = result.current.register({
        name: 'Test User',
        email: 'test@test.com',
        password: 'password',
        confirmPassword: 'password',
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(true)
      })

      jest.advanceTimersByTime(100)
      await registerPromise

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
    })
  })
}) 