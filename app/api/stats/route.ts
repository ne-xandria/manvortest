import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const [totalOrders, todayOrders, monthOrders, completedOrders, pendingOrders, recentOrders] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { createdAt: { gte: startOfDay } } }),
    prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.order.count({ where: { status: 'COMPLETED' } }),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { customer: true, technician: true } }),
  ])

  const monthlyData = []
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
    const count = await prisma.order.count({ where: { createdAt: { gte: date, lt: endDate } } })
    monthlyData.push({ month: date.toLocaleDateString('id-ID', { month: 'short' }), orders: count })
  }

  return NextResponse.json({ totalOrders, todayOrders, monthOrders, completedOrders, pendingOrders, recentOrders, monthlyData })
}
