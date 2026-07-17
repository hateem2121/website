import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    // 'node', not the template's 'jsdom': the int tests are pure API tests (no DOM), and
    // vitest's jsdom environment swaps the global Uint8Array to jsdom's realm without also
    // swapping TextEncoder, which trips esbuild's module-init invariant the moment the
    // Payload config pulls in wrangler. A future DOM test can opt back in per-file with
    // `// @vitest-environment jsdom`.
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/int/**/*.int.spec.ts'],
  },
})
