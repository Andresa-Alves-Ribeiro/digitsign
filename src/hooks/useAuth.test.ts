import { renderHook, act } from '@testing-library/react'
import { useAuth } from './useAuth'

describe('useAuth', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useAuth())

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
    expect(result.current.isLoading).toBe(false)
  })

  it('should login successfully', async () => {
    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password123',
      })
    })

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user).toEqual({
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
    })
  })

  it('should handle login error', async () => {
    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.login({
        email: 'wrong@example.com',
        password: 'wrongpassword',
      })
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
    expect(result.current.error).toBe('Credenciais inválidas')
  })

  it('should logout successfully', async () => {
    const { result } = renderHook(() => useAuth())

    // First login
    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password123',
      })
    })

    // Then logout
    await act(async () => {
      await result.current.logout()
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
  })
}) 