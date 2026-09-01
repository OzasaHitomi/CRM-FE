import { test, expect } from '@playwright/test'

test.describe('salesのAdminルートへのアクセス制御', () => {
  test.use({ storageState: 'playwright/.auth/sales.json' })

  test('/admin/usersにアクセスすると403へリダイレクトされる', async ({ page }) => {
    await page.goto('/admin/users')

    await expect(page).toHaveURL('/403')
    await expect(page.getByRole('heading', { name: '403' })).toBeVisible()
  })
})

test.describe('managerのAdminルートへのアクセス制御', () => {
  test.use({ storageState: 'playwright/.auth/manager.json' })

  test('/admin/usersにアクセスすると403へリダイレクトされる', async ({ page }) => {
    await page.goto('/admin/users')

    await expect(page).toHaveURL('/403')
  })
})

test.describe('adminのAdminルートへのアクセス', () => {
  test.use({ storageState: 'playwright/.auth/admin.json' })

  test('/admin/usersにアクセスできる', async ({ page }) => {
    await page.goto('/admin/users')

    await expect(page).toHaveURL('/admin/users')
    await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible()
  })
})

test.describe('存在しないURLへのアクセス', () => {
  test.use({ storageState: 'playwright/.auth/sales.json' })

  test('どのルートにも一致しないURLは404ページへリダイレクトされる', async ({ page }) => {
    await page.goto('/this-page-does-not-exist')

    await expect(page).toHaveURL('/404')
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible()
  })

  test('権限内トップレベル配下の存在しないネストパスは404ページへリダイレクトされる', async ({
    page,
  }) => {
    await page.goto('/customers/foo/bar')

    await expect(page).toHaveURL('/404')
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible()
  })
})

test.describe('ログアウト', () => {
  test.use({ storageState: 'playwright/.auth/sales.json' })

  test('ログアウトすると/loginに戻り、再度保護ページへアクセスできなくなる', async ({ page }) => {
    await page.goto('/customers')
    await page.getByRole('button', { name: 'Log out' }).click()

    await expect(page).toHaveURL('/login')

    await page.goto('/customers')
    await expect(page).toHaveURL('/login')
  })
})
