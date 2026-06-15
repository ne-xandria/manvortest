import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = await prisma.order.findFirst({
    where: { OR: [{ id }, { orderNumber: id }] },
    include: { customer: true, technician: true },
  })
  if (!order) return NextResponse.json({ error: 'Order tidak ditemukan' }, { status: 404 })
  return NextResponse.json(order)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const order = await prisma.order.update({
    where: { id },
    data: body,
    include: { customer: true, technician: true },
  })
  return NextResponse.json(order)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.order.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
