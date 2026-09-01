import { test, expect } from '@playwright/test'
import { createCustomer, createDeal, uniqueName } from './helpers/customer'

test('sales: 顧客作成から商談成約・活動ログ記録までの一気通貫フロー、managerがその内容を確認しUnassignできる', async ({
  browser,
}) => {
  const salesContext = await browser.newContext({ storageState: 'playwright/.auth/sales.json' })
  const salesPage = await salesContext.newPage()

  const companyName = uniqueName('E2EFlow')
  await salesPage.goto('/customers')
  await createCustomer(salesPage, { companyName })

  const row = salesPage.getByRole('row', { name: companyName })
  await expect(row.getByText('営業 太郎')).toBeVisible()

  await salesPage.getByRole('link', { name: companyName }).click()

  const dealTitle = uniqueName('Deal')
  await createDeal(salesPage, { title: dealTitle, amount: 500000 })
  await salesPage.getByText(dealTitle).click()

  await salesPage.getByRole('button', { name: 'negotiation', exact: true }).click()
  await expect(salesPage.getByTestId('deal-status-badge')).toHaveText('negotiation')

  await salesPage.getByRole('button', { name: 'closed_won', exact: true }).click()
  await salesPage.getByRole('button', { name: 'Confirm' }).click()
  await expect(salesPage.getByTestId('deal-status-badge')).toHaveText('closed_won')

  await salesPage.getByRole('button', { name: '+ Add Activity' }).click()
  await salesPage.getByLabel('Type').selectOption('visit')
  await salesPage.getByLabel('Activity Date').fill('2026-06-20')
  const note = uniqueName('ClosingNote')
  await salesPage.getByLabel('Note').fill(note)
  await salesPage.getByRole('button', { name: 'Save' }).click()
  await expect(salesPage.getByText(note)).toBeVisible()

  const customerUrl = salesPage.url()
  await salesContext.close()

  const managerContext = await browser.newContext({ storageState: 'playwright/.auth/manager.json' })
  const managerPage = await managerContext.newPage()
  await managerPage.goto(customerUrl)

  await expect(managerPage.getByRole('heading', { name: companyName })).toBeVisible()
  await expect(managerPage.getByText(dealTitle)).toBeVisible()
  await expect(managerPage.getByTestId('deal-status-badge')).toHaveText('closed_won')

  await managerPage.getByText(dealTitle).click()
  await expect(managerPage.getByText(note)).toBeVisible()

  await managerPage.getByRole('button', { name: 'Unassign' }).click()
  await expect(managerPage.getByRole('button', { name: 'Assign to me' })).toBeVisible()

  await managerContext.close()
})
