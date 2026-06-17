/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the BFF API. When set, adapters call the backend; when empty, they use the local mocks. */
  readonly VITE_API_BASE_URL?: string
  /** When 'true', social sign-in uses the real provider OAuth redirect via the BFF. */
  readonly VITE_USE_OAUTH_REDIRECT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
