import fs from 'node:fs'
import path from 'node:path'
import { test as setup, expect, type Page } from '@playwright/test'

const AUTH_DIR = path.join(import.meta.dirname, '..', 'playwright', '.auth')

const loginAndSaveState = async (page: Page, email: string, password: string, fileName: string) => {
  await page.goto('/login')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Log in' }).click()
  await expect(page).toHaveURL('/customers')

  fs.mkdirSync(AUTH_DIR, { recursive: true })
  await page.context().storageState({ path: path.join(AUTH_DIR, fileName) })
}

setup('authenticate as admin', async ({ page }) => {
  await loginAndSaveState(page, 'admin@example.com', 'password', 'admin.json')
})

setup('authenticate as sales', async ({ page }) => {
  await loginAndSaveState(page, 'sales@example.com', 'password', 'sales.json')
})

setup('authenticate as manager', async ({ page }) => {
  await loginAndSaveState(page, 'manager@example.com', 'password', 'manager.json')
})
