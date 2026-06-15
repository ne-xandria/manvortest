'use client'

import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, User } from 'lucide-react'
import { STATUS_LABELS, STATUS_COLORS, SERVICE_LABELS, formatDate } from '@/lib/utils'

type Order = { id: string; orderNumber: string; status: string; serviceType: string; createdAt: string; technician: { name: string } | null }
type Customer = { id: string; name: string; phone: string; email: string | null; address: string; createdAt: string; orders: Order[] }

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/customers').then(r => r.json()).then(data => { setCustomers(data); setLoading(false) })
  }, [])

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    (c.email?.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manajemen Pelanggan</h1>

      <div className="bg-white rounded-2xl shadow-sm mb-6 p-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama, telepon, atau email..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs">
              <tr>
                <th className="px-5 py-3 text-left font-medium">Pelanggan</th>
                <th className="px-5 py-3 text-left font-medium">Telepon</th>
                <th className="px-5 py-3 text-left font-medium">Alamat</th>
                <th className="px-5 py-3 text-left font-medium">Total Order</th>
                <th className="px-5 py-3 text-left font-medium">Terdaftar</th>
                <th className="px-5 py-3 text-left font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-gray-400">Memuat...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-gray-400">Tidak ada pelanggan</td></tr>
              ) : filtered.map(c => (
                <>
                  <tr key={c.id} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => setExpanded(expanded === c.id ? null : c.id)}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{c.name}</div>
                          {c.email && <div className="text-xs text-gray-400">{c.email}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{c.phone}</td>
                    <td className="px-5 py-4 text-gray-500 text-xs max-w-[200px] truncate">{c.address}</td>
                    <td className="px-5 py-4">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">{c.orders.length} order</span>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs">{formatDate(c.createdAt)}</td>
                    <td className="px-5 py-4 text-gray-400">
                      {expanded === c.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </td>
                  </tr>
                  {expanded === c.id && (
                    <tr key={`${c.id}-detail`}>
                      <td colSpan={6} className="px-5 py-4 bg-blue-50">
                        <div className="font-medium text-gray-700 mb-3 text-xs uppercase tracking-wider">Riwayat Order</div>
                        {c.orders.length === 0 ? (
                          <p className="text-sm text-gray-400">Belum ada order</p>
                        ) : (
                          <div className="space-y-2">
                            {c.orders.map(o => (
                              <div key={o.id} className="bg-white rounded-xl p-3 flex items-center justify-between">
                                <div>
                                  <span className="font-mono text-blue-700 text-xs font-bold">{o.orderNumber}</span>
                                  <span className="ml-3 text-gray-600 text-sm">{SERVICE_LABELS[o.serviceType] || o.serviceType}</span>
                                  {o.technician && <span className="ml-2 text-gray-400 text-xs">– {o.technician.name}</span>}
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-gray-400 text-xs">{formatDate(o.createdAt)}</span>
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[o.status] || 'bg-gray-100'}`}>
                                    {STATUS_LABELS[o.status] || o.status}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
