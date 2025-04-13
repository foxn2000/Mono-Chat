/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CEREBRAS_API_KEY: string
  readonly VITE_CEREBRAS_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
