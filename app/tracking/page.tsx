'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { AirVent, ArrowLeft, Search, Clock, User, Wrench, CalendarDays } from 'lucide-react'
import { STATUS_LABELS, STATUS_COLORS, SERVICE_LABELS, formatDate } from '@/lib/utils'

type Order = {
  id: string; orderNumber: string; status: string; serviceType: string
  scheduledDate: string | null; completedDate: string | null; description: string
  notes: string | null; price: number | null; createdAt: string
  customer: { name: string; phone: string; address: string }
  technician: { name: string; phone: string } | null
}

function TrackingContent() {
  const searchParams = useSearchParams()
  const [input, setInput] = useState(searchParams.get('order') || '')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const orderParam = searchParams.get('order')
    if (orderParam) { setInput(orderParam); searchOrder(orderParam) }
  }, [])

  async function searchOrder(num?: string) {
    const query = num || input
    if (!query.trim()) return
    setLoading(true); setError(''); setOrder(null)
    try {
      const res = await fetch(`/api/orders/${query.trim()}`)
      if (!res.ok) { setError('Order tidak ditemukan. Periksa kembali nomor order Anda.'); return }
      setOrder(await res.json())
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally { setLoading(false) }
  }

  const steps = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED']
  const currentStep = order ? steps.indexOf(order.status) : -1

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Lacak Order</h1>
        <p className="text-gray-500 mb-6">Masukkan nomor order untuk melihat status pengerjaan AC Anda.</p>
        <div className="flex gap-3">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && searchOrder()} type="text" placeholder="Contoh: ORD-2024XXXXX" className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button onClick={() => searchOrder()} disabled={loading} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-60 flex items-center gap-2">
            <Search className="w-4 h-4" />{loading ? 'Mencari...' : 'Cari'}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      </div>

      {order && (
        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-gray-500 mb-1">Nomor Order</div>
              <div className="text-xl font-bold text-blue-700">{order.orderNumber}</div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
              {STATUS_LABELS[order.status] || order.status}
            </span>
          </div>

          {/* Progress Steps */}
          {order.status !== 'CANCELLED' && (
            <div className="relative">
              <div className="flex justify-between items-center">
                {steps.map((step, i) => (
                  <div key={step} className="flex flex-col items-center flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${i <= currentStep ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                      {i + 1}
                    </div>
                    <div className={`text-xs mt-1 text-center ${i <= currentStep ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
                      {STATUS_LABELS[step]}
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 -z-10">
                <div className="h-full bg-blue-600 transition-all" style={{ width: `${Math.max(0, (currentStep / (steps.length - 1)) * 100)}%` }} />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 pt-2">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <Wrench className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs text-gray-500 mb-0.5">Jenis Layanan</div>
                <div className="font-semibold text-gray-800">{SERVICE_LABELS[order.serviceType] || order.serviceType}</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <User className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs text-gray-500 mb-0.5">Pelanggan</div>
                <div className="font-semibold text-gray-800">{order.customer.name}</div>
                <div className="text-sm text-gray-500">{order.customer.address}</div>
              </div>
            </div>
            {order.technician && (
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                <User className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs text-blue-500 mb-0.5">Teknisi yang Ditugaskan</div>
                  <div className="font-semibold text-gray-800">{order.technician.name}</div>
                </div>
              </div>
            )}
            {order.scheduledDate && (
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <CalendarDays className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">Jadwal Kunjungan</div>
                  <div className="font-semibold text-gray-800">{formatDate(order.scheduledDate)}</div>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <Clock className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs text-gray-500 mb-0.5">Keterangan</div>
                <div className="text-sm text-gray-700">{order.description}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function TrackingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <AirVent className="text-white w-4 h-4" />
            </div>
            <span className="font-bold text-blue-700">Manvor Service AC</span>
          </div>
        </div>
      </div>
      <Suspense fallback={<div className="text-center py-20 text-gray-500">Memuat...</div>}>
        <TrackingContent />
      </Suspense>
    </div>
  )
}
