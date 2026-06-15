import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const customers = await prisma.customer.findMany({
    include: { orders: { orderBy: { createdAt: 'desc' }, include: { technician: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(customers)
}
