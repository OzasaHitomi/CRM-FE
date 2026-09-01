import { test, expect } from '@playwright/test'
import { createCustomer, uniqueName } from './helpers/customer'

test.describe('顧客作成 (manager)', () => {
  test.use({ storageState: 'playwright/.auth/manager.json' })

  test('managerが顧客を新規作成すると未担当で一覧に表示される', async ({ page }) => {
    const companyName = uniqueName('ManagerCreate')
    await page.goto('/customers')
    await createCustomer(page, { companyName })

    const row = page.getByRole('row', { name: companyName })
    await expect(row).toBeVisible()
    await expect(row.getByText('Unassigned')).toBeVisible()
    await expect(row.getByRole('button', { name: 'Assign to me' })).toBeVisible()
  })
})

test.describe('顧客作成 (sales)', () => {
  test.use({ storageState: 'playwright/.auth/sales.json' })

  test('salesが顧客を新規作成すると自動的に自分の担当になる', async ({ page }) => {
    const companyName = uniqueName('SalesCreate')
    await page.goto('/customers')
    await createCustomer(page, { companyName })

    const row = page.getByRole('row', { name: companyName })
    await expect(row).toBeVisible()
    await expect(row.getByText('営業 太郎')).toBeVisible()
    await expect(row.getByRole('button', { name: 'Unassign' })).toBeVisible()
  })
})

test('未担当の顧客にsalesがAssign to me→Unassignできる', async ({ browser }) => {
  const managerContext = await browser.newContext({ storageState: 'playwright/.auth/manager.json' })
  const managerPage = await managerContext.newPage()
  const companyName = uniqueName('AssignFlow')
  await managerPage.goto('/customers')
  await createCustomer(managerPage, { companyName })
  await expect(managerPage.getByText(companyName)).toBeVisible()
  await managerContext.close()

  const salesContext = await browser.newContext({ storageState: 'playwright/.auth/sales.json' })
  const salesPage = await salesContext.newPage()
  await salesPage.goto('/customers')

  const row = salesPage.getByRole('row', { name: companyName })
  await expect(row.getByRole('button', { name: 'Assign to me' })).toBeVisible()
  await row.getByRole('button', { name: 'Assign to me' }).click()

  await expect(row.getByRole('button', { name: 'Unassign' })).toBeVisible()
  await expect(row.getByText('営業 太郎')).toBeVisible()
  await expect(salesPage.getByText('担当者を割り当てました')).toBeVisible()

  await row.getByRole('button', { name: 'Unassign' }).click()
  await expect(row.getByRole('button', { name: 'Assign to me' })).toBeVisible()
  await expect(row.getByText('Unassigned')).toBeVisible()
  await expect(salesPage.getByText('担当を解除しました')).toBeVisible()

  await salesContext.close()
})

test('salesの一覧には自分が担当していない顧客は表示されない', async ({ browser }) => {
  const managerContext = await browser.newContext({ storageState: 'playwright/.auth/manager.json' })
  const managerPage = await managerContext.newPage()
  const managerCompanyName = uniqueName('ManagerOwned')
  await managerPage.goto('/customers')
  await createCustomer(managerPage, { companyName: managerCompanyName })
  const managerRow = managerPage.getByRole('row', { name: managerCompanyName })
  await managerRow.getByRole('button', { name: 'Assign to me' }).click()
  await expect(managerRow.getByRole('button', { name: 'Unassign' })).toBeVisible()
  await managerContext.close()

  const salesContext = await browser.newContext({ storageState: 'playwright/.auth/sales.json' })
  const salesPage = await salesContext.newPage()
  const salesCompanyName = uniqueName('SalesOwned')
  await salesPage.goto('/customers')
  await createCustomer(salesPage, { companyName: salesCompanyName })

  await expect(salesPage.getByText(salesCompanyName)).toBeVisible()
  await expect(salesPage.getByText(managerCompanyName)).not.toBeVisible()
  await salesContext.close()
})
