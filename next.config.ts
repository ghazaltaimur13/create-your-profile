import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { NextConfig } from 'next'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const packageJsonPath = path.join(dirname, 'package.json')
const { version: appVersion } = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as { version: string }

const nextConfig: NextConfig = {
  outputFileTracingRoot: dirname,
  transpilePackages: ['@mui/material-nextjs', '@mui/material', '@mui/icons-material', '@mui/system'],
  env: {
    NEXT_PUBLIC_APP_VERSION: appVersion,
  },
}

export default nextConfig
