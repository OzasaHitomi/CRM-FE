import { beforeEach, describe, expect, it, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'

import { createUser } from '@/services/internal/backend/v1/admin/users'
import type { CreateUserRequest } from '@/services/internal/backend/v1/types/request/admin/user'
import type { CreateUserResponse } from '@/services/internal/backend/v1/types/response/admin/user'

import { useCreateUserMutation } from '../useCreateUserMutation'

vi.mock('@/services/internal/backend/v1/admin/users', () => ({
  createUser: vi.fn(),
}))

const mockCreateUser = vi.mocked(createUser)

const body: CreateUserRequest = {
  name: 'Priya Nair',
  email: 'priya.nair@novel.co',
  password: 'password',
  role: 'sales',
}

const mockResponse: CreateUserResponse = {
  userId: 'user-2',
  name: body.name,
  email: body.email,
  role: body.role,
}

describe('useCreateUserMutation', () => {
  let queryClient: QueryClient

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  beforeEach(() => {
    vi.clearAllMocks()
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  })

  it('mutateAsyncに渡した引数がそのままcreateUserに渡ること', async () => {
    mockCreateUser.mockResolvedValueOnce(mockResponse)
    const { result } = renderHook(() => useCreateUserMutation(), { wrapper })

    await result.current.mutateAsync(body)

    expect(mockCreateUser).toHaveBeenCalledWith(body, expect.anything())
  })

  it('createUserが成功した場合、isSuccessになること', async () => {
    mockCreateUser.mockResolvedValueOnce(mockResponse)
    const { result } = renderHook(() => useCreateUserMutation(), { wrapper })

    await result.current.mutateAsync(body)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('成功時、adminUsers一覧クエリがinvalidateされること', async () => {
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    mockCreateUser.mockResolvedValueOnce(mockResponse)
    const { result } = renderHook(() => useCreateUserMutation(), { wrapper })

    await result.current.mutateAsync(body)

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['adminUsers'] })
  })

  it('createUserが失敗した場合、isErrorになること', async () => {
    mockCreateUser.mockRejectedValueOnce(new Error('failed'))
    const { result } = renderHook(() => useCreateUserMutation(), { wrapper })

    await expect(result.current.mutateAsync(body)).rejects.toThrow('failed')

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
