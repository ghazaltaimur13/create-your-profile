import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { NextConfig } from 'next'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  outputFileTracingRoot: dirname,
  transpilePackages: ['@mui/material-nextjs', '@mui/material', '@mui/icons-material', '@mui/system'],
}

export default nextConfig
