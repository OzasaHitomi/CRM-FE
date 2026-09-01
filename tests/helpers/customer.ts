import type { Page } from '@playwright/test'

export const uniqueName = (label: string) =>
  `${label} E2E ${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

export const uniqueEmail = (label: string) =>
  `e2e-${label}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`

type CreateCustomerOptions = {
  companyName: string
  companySize?: number
  contactName?: string
  phone?: string
  email?: string
}

/**
 * /customers ページで「+ Add Customer」から顧客を新規作成する。
 * 呼び出し前提: page が /customers を開いていること。
 */
export const createCustomer = async (page: Page, options: CreateCustomerOptions) => {
  await page.getByRole('button', { name: '+ Add Customer' }).click()
  await page.getByLabel('Company Name').fill(options.companyName)
  await page.getByLabel('Company Size').fill(String(options.companySize ?? 100))
  await page.getByLabel('Contact Name').fill(options.contactName ?? 'E2E Contact')
  await page.getByLabel('Phone').fill(options.phone ?? '0312345678')
  await page.getByLabel('Email').fill(options.email ?? uniqueEmail('contact'))
  await page.getByRole('button', { name: 'Save' }).click()
}

type CreateDealOptions = {
  title: string
  amount?: number
  plan?: 'starter' | 'professional' | 'enterprise'
  licenseCount?: number
  contractPeriod?: number
}

/**
 * customer詳細ページで「+ Add Deal」から商談を新規作成する。
 * 呼び出し前提: page が customer詳細ページ(/customers/:id)を開いていること。
 */
export const createDeal = async (page: Page, options: CreateDealOptions) => {
  await page.getByRole('button', { name: '+ Add Deal' }).click()
  await page.getByLabel('Title').fill(options.title)
  await page.getByLabel('Amount').fill(String(options.amount ?? 10000))
  await page.getByLabel('Plan').selectOption(options.plan ?? 'starter')
  await page.getByLabel('License Count').fill(String(options.licenseCount ?? 10))
  await page.getByLabel('Contract Period').fill(String(options.contractPeriod ?? 12))
  await page.getByRole('button', { name: 'Save' }).click()
}
