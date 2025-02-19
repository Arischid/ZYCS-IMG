/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_IMG_API_URL: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@radix-icons/vue'
declare module 'qrcode.vue' 