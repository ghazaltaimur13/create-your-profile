import { NextResponse } from 'next/server'

import { getAppVersionFromPackage } from '@/lib/app-version'

export const runtime = 'nodejs'

export async function GET() {
  const version = getAppVersionFromPackage()
  return NextResponse.json({
    ok: true,
    version,
    name: 'my-portfolio',
  })
}
