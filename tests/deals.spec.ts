import { test, expect } from '@playwright/test'
import { createCustomer, createDeal, uniqueName } from './helpers/customer'

test.describe('Deal管理 (sales)', () => {
  test.use({ storageState: 'playwright/.auth/sales.json' })

  test('商談を新規作成すると詳細ページのDeal一覧に追加される', async ({ page }) => {
    const companyName = uniqueName('DealCreate')
    await page.goto('/customers')
    await createCustomer(page, { companyName })
    await page.getByRole('link', { name: companyName }).click()

    const dealTitle = uniqueName('Deal')
    await createDeal(page, { title: dealTitle })

    await expect(page.getByText(dealTitle)).toBeVisible()
    await expect(page.getByTestId('deal-status-badge')).toHaveText('lead')
  })

  test('非終端ステータス間の変更は確認ダイアログなしで即座に反映される', async ({ page }) => {
    const companyName = uniqueName('DealNonTerminal')
    await page.goto('/customers')
    await createCustomer(page, { companyName })
    await page.getByRole('link', { name: companyName }).click()

    const dealTitle = uniqueName('Deal')
    await createDeal(page, { title: dealTitle })
    await page.getByText(dealTitle).click()

    await page.getByRole('button', { name: 'proposal', exact: true }).click()

    await expect(page.getByText('Confirm Status Change')).not.toBeVisible()
    await expect(page.getByTestId('deal-status-badge')).toHaveText('proposal')
  })

  test('終端ステータスへの変更は確認ダイアログで確定すると反映される', async ({ page }) => {
    const companyName = uniqueName('DealTerminal')
    await page.goto('/customers')
    await createCustomer(page, { companyName })
    await page.getByRole('link', { name: companyName }).click()

    const dealTitle = uniqueName('Deal')
    await createDeal(page, { title: dealTitle })
    await page.getByText(dealTitle).click()

    await page.getByRole('button', { name: 'closed_won', exact: true }).click()
    await expect(page.getByText('Confirm Status Change')).toBeVisible()

    await page.getByRole('button', { name: 'Confirm' }).click()
    await expect(page.getByTestId('deal-status-badge')).toHaveText('closed_won')
  })

  test('終端ステータス到達後はPipelineピルが全て非活性になる', async ({ page }) => {
    const companyName = uniqueName('DealLocked')
    await page.goto('/customers')
    await createCustomer(page, { companyName })
    await page.getByRole('link', { name: companyName }).click()

    const dealTitle = uniqueName('Deal')
    await createDeal(page, { title: dealTitle })
    await page.getByText(dealTitle).click()

    await page.getByRole('button', { name: 'closed_lost', exact: true }).click()
    await page.getByRole('button', { name: 'Confirm' }).click()
    await expect(page.getByTestId('deal-status-badge')).toHaveText('closed_lost')

    await expect(page.getByRole('button', { name: 'lead', exact: true })).toBeDisabled()
    await expect(page.getByRole('button', { name: 'proposal', exact: true })).toBeDisabled()
  })
})

test('adminはDeal追加・Pipeline操作ボタンが使えない', async ({ browser }) => {
  const salesContext = await browser.newContext({ storageState: 'playwright/.auth/sales.json' })
  const salesPage = await salesContext.newPage()
  const companyName = uniqueName('AdminDealReadonly')
  await salesPage.goto('/customers')
  await createCustomer(salesPage, { companyName })
  await salesPage.getByRole('link', { name: companyName }).click()
  const customerUrl = salesPage.url()
  const dealTitle = uniqueName('Deal')
  await createDeal(salesPage, { title: dealTitle })
  await expect(salesPage.getByText(dealTitle)).toBeVisible()
  await salesContext.close()

  const adminContext = await browser.newContext({ storageState: 'playwright/.auth/admin.json' })
  const adminPage = await adminContext.newPage()
  await adminPage.goto(customerUrl)

  await expect(adminPage.getByRole('button', { name: '+ Add Deal' })).toHaveCount(0)

  await adminPage.getByText(dealTitle).click()
  await expect(adminPage.getByRole('button', { name: 'lead', exact: true })).toBeDisabled()
  await expect(adminPage.getByRole('button', { name: '+ Add Activity' })).toHaveCount(0)

  await adminContext.close()
})
