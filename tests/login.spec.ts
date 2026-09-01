import { test, expect } from '@playwright/test'

const CREDENTIALS = [
  { role: 'admin', email: 'admin@example.com' },
  { role: 'sales', email: 'sales@example.com' },
  { role: 'manager', email: 'manager@example.com' },
]

test.describe('ログイン成功', () => {
  for (const { role, email } of CREDENTIALS) {
    test(`${role}でログインすると/customersへ遷移する`, async ({ page }) => {
      await page.goto('/login')
      await page.getByLabel('Email').fill(email)
      await page.getByLabel('Password').fill('password')
      await page.getByRole('button', { name: 'Log in' }).click()

      await expect(page).toHaveURL('/customers')
      await expect(page.getByRole('heading', { name: 'Customers' })).toBeVisible()
    })
  }
})

test.describe('ログイン失敗', () => {
  test('パスワードが誤っている場合、エラーメッセージが表示されログインページに留まる', async ({
    page,
  }) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill('admin@example.com')
    await page.getByLabel('Password').fill('wrong-password')
    await page.getByRole('button', { name: 'Log in' }).click()

    await expect(page.getByText('メールアドレスまたはパスワードが正しくありません')).toBeVisible()
    await expect(page).toHaveURL('/login')
  })
})

test.describe('未ログイン時のアクセス制御', () => {
  test('保護ページへ直接アクセスすると/loginへリダイレクトされる', async ({ page }) => {
    await page.goto('/customers')

    await expect(page).toHaveURL('/login')
  })
})
