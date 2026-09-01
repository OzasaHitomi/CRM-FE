import { test, expect } from '@playwright/test'
import { createCustomer, uniqueName } from './helpers/customer'

test('salesが未担当の顧客詳細ページに直接アクセスするとエラーページが表示される', async ({
  browser,
}) => {
  const managerContext = await browser.newContext({ storageState: 'playwright/.auth/manager.json' })
  const managerPage = await managerContext.newPage()
  const companyName = uniqueName('Forbidden')
  await managerPage.goto('/customers')
  await createCustomer(managerPage, { companyName })
  await managerPage.getByRole('link', { name: companyName }).click()
  const customerUrl = managerPage.url()
  await managerContext.close()

  const salesContext = await browser.newContext({ storageState: 'playwright/.auth/sales.json' })
  const salesPage = await salesContext.newPage()
  await salesPage.goto(customerUrl)

  // 顧客個別の403はルート遷移ではなく、同一URL上でErrorPageが表示される仕様
  await expect(salesPage.getByText('顧客情報の取得に失敗しました。')).toBeVisible()
  await expect(salesPage).toHaveURL(customerUrl)
  await salesContext.close()
})

test.describe('顧客編集', () => {
  test.use({ storageState: 'playwright/.auth/sales.json' })

  test('顧客情報を編集すると詳細に反映される', async ({ page }) => {
    const companyName = uniqueName('EditTarget')
    await page.goto('/customers')
    await createCustomer(page, { companyName })
    await page.getByRole('link', { name: companyName }).click()

    await page.getByRole('button', { name: 'Edit' }).click()
    const updatedName = `${companyName} Updated`
    await page.getByLabel('Company Name').fill(updatedName)
    await page.getByRole('button', { name: 'Save' }).click()

    await expect(page.getByRole('heading', { name: updatedName })).toBeVisible()
  })
})

test('adminは顧客詳細でEdit/Assign/Unassignボタンが表示されない', async ({ browser }) => {
  const salesContext = await browser.newContext({ storageState: 'playwright/.auth/sales.json' })
  const salesPage = await salesContext.newPage()
  const companyName = uniqueName('AdminReadonly')
  await salesPage.goto('/customers')
  await createCustomer(salesPage, { companyName })
  await salesPage.getByRole('link', { name: companyName }).click()
  const customerUrl = salesPage.url()
  await salesContext.close()

  const adminContext = await browser.newContext({ storageState: 'playwright/.auth/admin.json' })
  const adminPage = await adminContext.newPage()
  await adminPage.goto(customerUrl)

  await expect(adminPage.getByRole('heading', { name: companyName })).toBeVisible()
  await expect(adminPage.getByRole('button', { name: 'Edit' })).toHaveCount(0)
  await expect(adminPage.getByRole('button', { name: 'Assign to me' })).toHaveCount(0)
  await expect(adminPage.getByRole('button', { name: 'Unassign' })).toHaveCount(0)
  await adminContext.close()
})
