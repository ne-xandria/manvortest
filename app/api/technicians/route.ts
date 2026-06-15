import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const technicians = await prisma.technician.findMany({
    include: { _count: { select: { orders: true } } },
    orderBy: { name: 'asc' },
  })
  return NextResponse.json(technicians)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const technician = await prisma.technician.create({ data: body })
  return NextResponse.json(technician, { status: 201 })
}
