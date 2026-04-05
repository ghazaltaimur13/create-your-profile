import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/** Server-only: reads `package.json` so `/api/health` matches deployed build even if env was not inlined. */
export function getAppVersionFromPackage(): string {
  try {
    const raw = readFileSync(join(process.cwd(), 'package.json'), 'utf8')
    const pkg = JSON.parse(raw) as { version?: string }
    return typeof pkg.version === 'string' ? pkg.version : '0.0.0'
  } catch {
    return process.env.NEXT_PUBLIC_APP_VERSION ?? '0.0.0'
  }
}
