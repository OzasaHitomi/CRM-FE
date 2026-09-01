import { test, expect } from '@playwright/test'
import { createCustomer, createDeal, uniqueName } from './helpers/customer'

test.describe('Activity Log (sales)', () => {
  test.use({ storageState: 'playwright/.auth/sales.json' })

  test('活動ログを新規作成すると一覧に追加される', async ({ page }) => {
    const companyName = uniqueName('ActivityCreate')
    await page.goto('/customers')
    await createCustomer(page, { companyName })
    await page.getByRole('link', { name: companyName }).click()

    const dealTitle = uniqueName('Deal')
    await createDeal(page, { title: dealTitle })
    await page.getByText(dealTitle).click()

    await page.getByRole('button', { name: '+ Add Activity' }).click()
    await page.getByLabel('Type').selectOption('call')
    await page.getByLabel('Activity Date').fill('2026-06-01')
    const note = uniqueName('Note')
    await page.getByLabel('Note').fill(note)
    await page.getByRole('button', { name: 'Save' }).click()

    await expect(page.getByText(note)).toBeVisible()
    await expect(page.getByText('2026-06-01')).toBeVisible()
  })

  test('活動ログをクリックすると編集ダイアログが既存値でプリフィルされ、更新できる', async ({
    page,
  }) => {
    const companyName = uniqueName('ActivityEdit')
    await page.goto('/customers')
    await createCustomer(page, { companyName })
    await page.getByRole('link', { name: companyName }).click()

    const dealTitle = uniqueName('Deal')
    await createDeal(page, { title: dealTitle })
    await page.getByText(dealTitle).click()

    await page.getByRole('button', { name: '+ Add Activity' }).click()
    await page.getByLabel('Type').selectOption('call')
    await page.getByLabel('Activity Date').fill('2026-06-01')
    const note = uniqueName('Note')
    await page.getByLabel('Note').fill(note)
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.getByText(note)).toBeVisible()

    await page.getByRole('button', { name: 'Edit activity log' }).click()
    await expect(page.getByLabel('Note')).toHaveValue(note)
    await expect(page.getByLabel('Type')).toHaveValue('call')

    const updatedNote = `${note} Updated`
    await page.getByLabel('Note').fill(updatedNote)
    await page.getByRole('button', { name: 'Save' }).click()

    await expect(page.getByText(updatedNote)).toBeVisible()
  })

  test('終端ステータスの商談でも活動ログの追加ができる', async ({ page }) => {
    const companyName = uniqueName('ActivityOnClosed')
    await page.goto('/customers')
    await createCustomer(page, { companyName })
    await page.getByRole('link', { name: companyName }).click()

    const dealTitle = uniqueName('Deal')
    await createDeal(page, { title: dealTitle })
    await page.getByText(dealTitle).click()

    await page.getByRole('button', { name: 'closed_won', exact: true }).click()
    await page.getByRole('button', { name: 'Confirm' }).click()
    await expect(page.getByTestId('deal-status-badge')).toHaveText('closed_won')

    await expect(page.getByRole('button', { name: '+ Add Activity' })).toBeEnabled()

    await page.getByRole('button', { name: '+ Add Activity' }).click()
    await page.getByLabel('Type').selectOption('email')
    await page.getByLabel('Activity Date').fill('2026-06-15')
    const note = uniqueName('ClosedNote')
    await page.getByLabel('Note').fill(note)
    await page.getByRole('button', { name: 'Save' }).click()

    await expect(page.getByText(note)).toBeVisible()
  })
})
