import { test, expect } from '@playwright/test'

test.describe('Admin > Users', () => {
  test.use({ storageState: 'playwright/.auth/admin.json' })

  test('ユーザー一覧にsales/managerが表示され、adminは表示されない', async ({ page }) => {
    await page.goto('/admin/users')

    await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible()
    await expect(page.getByText('sales@example.com')).toBeVisible()
    await expect(page.getByText('manager@example.com')).toBeVisible()
    await expect(page.getByText('admin@example.com')).not.toBeVisible()
  })

  test('新規ユーザーを作成すると一覧に追加される', async ({ page }) => {
    const email = `e2e-create-${Date.now()}@example.com`

    await page.goto('/admin/users')
    await page.getByRole('button', { name: '+ Add User' }).click()
    await page.getByLabel('Name').fill('E2E Create User')
    await page.getByLabel('Email').fill(email)
    await page.getByLabel('Password').fill('password')
    await page.getByLabel('Role').selectOption('sales')
    await page.getByRole('button', { name: 'Save' }).click()

    await expect(page.getByText(email)).toBeVisible()
  })

  test('ユーザーのステータスを切り替えられる', async ({ page }) => {
    const email = `e2e-toggle-${Date.now()}@example.com`

    await page.goto('/admin/users')
    await page.getByRole('button', { name: '+ Add User' }).click()
    await page.getByLabel('Name').fill('E2E Toggle User')
    await page.getByLabel('Email').fill(email)
    await page.getByLabel('Password').fill('password')
    await page.getByLabel('Role').selectOption('sales')
    await page.getByRole('button', { name: 'Save' }).click()

    const row = page.getByRole('row', { name: email })
    await expect(row.getByRole('button', { name: 'Active' })).toBeVisible()

    await row.getByRole('button', { name: 'Active' }).click()
    await expect(row.getByRole('button', { name: 'Inactive' })).toBeVisible()
  })
})
