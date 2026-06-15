import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function generateOrderNumber() {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 90000) + 10000
  return `ORD-${year}${random}`
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const orders = await prisma.order.findMany({
    where: status && status !== 'ALL' ? { status } : undefined,
    include: { customer: true, technician: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(orders)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, phone, email, address, serviceType, scheduledDate, description } = body

  let customer = await prisma.customer.findFirst({ where: { phone } })
  if (!customer) {
    customer = await prisma.customer.create({ data: { name, phone, email, address } })
  }

  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      customerId: customer.id,
      serviceType,
      scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
      description,
      status: 'PENDING',
    },
    include: { customer: true },
  })

  return NextResponse.json(order, { status: 201 })
}
