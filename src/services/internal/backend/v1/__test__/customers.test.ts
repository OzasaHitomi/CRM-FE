import { beforeEach, describe, expect, it, vi } from 'vitest'

import { internalBackendV1Client } from '../client'
import {
  assignCustomerUser,
  createCustomer,
  createDeal,
  getCustomer,
  getCustomers,
  unassignCustomerUser,
  updateCustomer,
} from '../customers'
import type { CreateCustomerRequest, UpdateCustomerRequest } from '../types/request/customer'
import type { CreateDealRequest } from '../types/request/deal'
import type {
  AssignCustomerUserResponse,
  CreateCustomerResponse,
  DealResponseItem,
  GetCustomersResponseItem,
  UpdateCustomerResponse,
} from '../types/response/customer'

vi.mock('../client', () => ({
  internalBackendV1Client: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

const mockClient = vi.mocked(internalBackendV1Client)

const mockAssignedUser = { userId: 'user-1', name: 'Emily Chen' }

const mockDealRaw = {
  dealId: 'deal-1',
  title: 'Enterprise rollout — 2026',
  status: 'negotiation' as const,
  amount: 84000,
  plan: 'enterprise' as const,
  licenseCount: 120,
  contractPeriod: 24,
  createdAt: '2026-01-01T00:00:00.000Z',
  activityLogs: [
    {
      activityLogId: 'log-1',
      type: 'call' as const,
      activityDate: '2026-01-10',
      note: 'Discovery call',
    },
  ],
}

const mockDealParsed: DealResponseItem = {
  ...mockDealRaw,
  createdAt: new Date(mockDealRaw.createdAt),
}

describe('customers service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getCustomers', () => {
    const mockResponse: GetCustomersResponseItem[] = [
      {
        customerId: 'customer-1',
        companyName: 'Northwind Logistics',
        industry: 'manufacturing',
        assignedUser: mockAssignedUser,
      },
    ]

    it('正しいエンドポイントを呼ぶこと', async () => {
      mockClient.get.mockResolvedValueOnce({ data: mockResponse })

      await getCustomers()

      expect(mockClient.get).toHaveBeenCalledWith('/customers')
    })

    it('パース済みのレスポンスを返すこと', async () => {
      mockClient.get.mockResolvedValueOnce({ data: mockResponse })

      const result = await getCustomers()

      expect(result).toEqual(mockResponse)
    })
  })

  describe('getCustomer', () => {
    // API から返る生のレスポンス（deals[].createdAt はまだ文字列。パース後の Date 型とは別物）
    const mockResponse = {
      customerId: 'customer-1',
      companyName: 'Northwind Logistics',
      industry: 'manufacturing',
      companySize: 850,
      contactName: 'Grace Halvorsen',
      phone: '+1 (415) 555-0182',
      email: 'grace.h@northwind.com',
      assignedUser: mockAssignedUser,
      deals: [mockDealRaw],
    }

    it('正しいエンドポイントを呼ぶこと', async () => {
      mockClient.get.mockResolvedValueOnce({ data: mockResponse })

      await getCustomer('customer-1')

      expect(mockClient.get).toHaveBeenCalledWith('/customers/customer-1')
    })

    it('パース済みのレスポンスを返すこと（createdAtがDateに変換されること）', async () => {
      mockClient.get.mockResolvedValueOnce({ data: mockResponse })

      const result = await getCustomer('customer-1')

      expect(result).toEqual({ ...mockResponse, deals: [mockDealParsed] })
    })

    it('deals[].createdAtにタイムゾオフセット無しの日時が返っても、パースに失敗しないこと', async () => {
      const naiveCreatedAt = '2026-07-22T17:31:09'
      mockClient.get.mockResolvedValueOnce({
        data: { ...mockResponse, deals: [{ ...mockDealRaw, createdAt: naiveCreatedAt }] },
      })

      const result = await getCustomer('customer-1')

      expect(result.deals[0]?.createdAt).toEqual(new Date(naiveCreatedAt))
    })
  })

  describe('createCustomer', () => {
    const body: CreateCustomerRequest = {
      companyName: 'Cedar & Vine Retail',
      industry: 'retail',
      companySize: 120,
      contactName: 'Jamie Lee',
      phone: '+1 (415) 555-0100',
      email: 'jamie.lee@cedarvine.com',
    }
    const mockResponse: CreateCustomerResponse = {
      customerId: 'customer-2',
      ...body,
      assignedUser: null,
    }

    it('正しいエンドポイントとボディで呼ぶこと', async () => {
      mockClient.post.mockResolvedValueOnce({ data: mockResponse })

      await createCustomer(body)

      expect(mockClient.post).toHaveBeenCalledWith('/customers', body)
    })

    it('パース済みのレスポンスを返すこと', async () => {
      mockClient.post.mockResolvedValueOnce({ data: mockResponse })

      const result = await createCustomer(body)

      expect(result).toEqual(mockResponse)
    })
  })

  describe('updateCustomer', () => {
    const body: UpdateCustomerRequest = {
      companyName: 'Cedar & Vine Retail',
      industry: 'retail',
      companySize: 130,
      contactName: 'Jamie Lee',
      phone: '+1 (415) 555-0100',
      email: 'jamie.lee@cedarvine.com',
    }
    const mockResponse: UpdateCustomerResponse = {
      customerId: 'customer-2',
      ...body,
      assignedUser: null,
    }

    it('正しいエンドポイントとボディで呼ぶこと', async () => {
      mockClient.put.mockResolvedValueOnce({ data: mockResponse })

      await updateCustomer('customer-2', body)

      expect(mockClient.put).toHaveBeenCalledWith('/customers/customer-2', body)
    })

    it('パース済みのレスポンスを返すこと', async () => {
      mockClient.put.mockResolvedValueOnce({ data: mockResponse })

      const result = await updateCustomer('customer-2', body)

      expect(result).toEqual(mockResponse)
    })
  })

  describe('createDeal', () => {
    const body: CreateDealRequest = {
      title: 'Warehouse analytics add-on',
      amount: 18000,
      plan: 'professional',
      licenseCount: 40,
      contractPeriod: 12,
    }

    it('正しいエンドポイントとボディで呼ぶこと', async () => {
      mockClient.post.mockResolvedValueOnce({ data: mockDealRaw })

      await createDeal('customer-1', body)

      expect(mockClient.post).toHaveBeenCalledWith('/customers/customer-1/deals', body)
    })

    it('パース済みのレスポンスを返すこと（createdAtがDateに変換されること）', async () => {
      mockClient.post.mockResolvedValueOnce({ data: mockDealRaw })

      const result = await createDeal('customer-1', body)

      expect(result).toEqual(mockDealParsed)
    })
  })

  describe('assignCustomerUser', () => {
    const mockResponse: AssignCustomerUserResponse = {
      customerId: 'customer-1',
      assignedUser: mockAssignedUser,
    }

    it('正しいエンドポイントを呼ぶこと', async () => {
      mockClient.put.mockResolvedValueOnce({ data: mockResponse })

      await assignCustomerUser('customer-1')

      expect(mockClient.put).toHaveBeenCalledWith('/customers/customer-1/assigned-user')
    })

    it('パース済みのレスポンスを返すこと', async () => {
      mockClient.put.mockResolvedValueOnce({ data: mockResponse })

      const result = await assignCustomerUser('customer-1')

      expect(result).toEqual(mockResponse)
    })
  })

  describe('unassignCustomerUser', () => {
    it('正しいエンドポイントを呼ぶこと', async () => {
      mockClient.delete.mockResolvedValueOnce({ data: undefined })

      await unassignCustomerUser('customer-1')

      expect(mockClient.delete).toHaveBeenCalledWith('/customers/customer-1/assigned-user')
    })
  })
})
