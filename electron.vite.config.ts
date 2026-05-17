import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import path from 'path'

// 复制 package.json 到构建输出目录
const copyPackageJson = {
  name: 'copy-package-json',
  writeBundle() {
    const src = resolve('package.json')
    const dest = resolve('out', 'package.json')
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest)
      console.log('Copied package.json to out/')
    }
  }
}

export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        external: [],
        plugins: [copyPackageJson]
      }
    }
  },
  preload: {
    build: {
      rollupOptions: {
        external: []
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [vue()]
  }
})
