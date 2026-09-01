import path from 'node:path'
import { defineConfig as defineViteConfig, mergeConfig } from 'vite'
import { defineConfig as defineVitestConfig } from 'vitest/config'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

const viteConfig = defineViteConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
})

const vitestConfig = defineVitestConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx,js,jsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/**'],
      reporter: ['text', 'lcov'],
      exclude: [
        // 型宣言ファイル（実行コードなし）
        'src/**/*.d.ts',
        // エントリポイント・アプリ初期化（ディレクトリの目的がテスト対象外）
        'src/main.tsx',
        'src/App.tsx',
        'src/core/**',
        'src/routes/**',
        // 型定義のみ・実行コードなし（ディレクトリの目的がテスト対象外）
        'src/services/internal/backend/**/types/**',
        'src/share/types/**',
        // axiosクライアントの設定のみ（各APIテストでモック化されるためカバレッジが常に0になる）
        // 注意：このファイルに分岐ロジック（認証エラー時のリダイレクト等）が
        // 追加されたら、このexcludeエントリ自体を見直すこと
        'src/services/base/httpClientFactory.ts',
        'src/services/internal/backend/v1/client.ts',
        // テストインフラ（ディレクトリの目的がテスト対象外）
        'src/tests/**',
        // Chakra UI 生成のスニペットコンポーネント（ディレクトリの目的がテスト対象外）
        'src/components/ui/**',
      ],
    },
  },
})

export default mergeConfig(viteConfig, vitestConfig)
