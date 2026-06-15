'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { ClipboardList, CheckCircle, Clock, CalendarDays } from 'lucide-react'
import { STATUS_LABELS, STATUS_COLORS, SERVICE_LABELS, formatDate } from '@/lib/utils'

type Stats = {
  totalOrders: number; todayOrders: number; monthOrders: number
  completedOrders: number; pendingOrders: number
  monthlyData: { month: string; orders: number }[]
  recentOrders: Array<{ id: string; orderNumber: string; status: string; serviceType: string; createdAt: string; customer: { name: string }; technician: { name: string } | null }>
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(setStats)
  }, [])

  if (!stats) return <div className="p-8 text-gray-500">Memuat data...</div>

  const cards = [
    { label: 'Total Order', value: stats.totalOrders, icon: ClipboardList, color: 'bg-blue-500' },
    { label: 'Order Hari Ini', value: stats.todayOrders, icon: CalendarDays, color: 'bg-purple-500' },
    { label: 'Order Bulan Ini', value: stats.monthOrders, icon: Clock, color: 'bg-yellow-500' },
    { label: 'Order Selesai', value: stats.completedOrders, icon: CheckCircle, color: 'bg-green-500' },
  ]

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm">
            <div className={`${color} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}>
              <Icon className="text-white w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-4">Tren Order (6 Bulan Terakhir)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.monthlyData}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="orders" fill="#2563EB" radius={[4, 4, 0, 0]} name="Order" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-4">Status Order</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-xl">
              <span className="text-sm font-medium text-yellow-700">Menunggu</span>
              <span className="font-bold text-yellow-700">{stats.pendingOrders}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl">
              <span className="text-sm font-medium text-green-700">Selesai</span>
              <span className="font-bold text-green-700">{stats.completedOrders}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
              <span className="text-sm font-medium text-blue-700">Bulan Ini</span>
              <span className="font-bold text-blue-700">{stats.monthOrders}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm mt-6">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="font-semibold text-gray-700">Order Terbaru</h2>
          <Link href="/admin/orders" className="text-sm text-blue-600 hover:underline">Lihat Semua</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs">
              <tr>
                <th className="px-6 py-3 text-left font-medium">No. Order</th>
                <th className="px-6 py-3 text-left font-medium">Pelanggan</th>
                <th className="px-6 py-3 text-left font-medium">Layanan</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
                <th className="px-6 py-3 text-left font-medium">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats.recentOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-mono text-blue-700 font-medium">{order.orderNumber}</td>
                  <td className="px-6 py-4 text-gray-700">{order.customer.name}</td>
                  <td className="px-6 py-4 text-gray-600">{SERVICE_LABELS[order.serviceType] || order.serviceType}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status] || 'bg-gray-100'}`}>
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{formatDate(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
