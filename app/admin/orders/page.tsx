'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus, Search, Trash2, Edit2 } from 'lucide-react'
import { STATUS_LABELS, STATUS_COLORS, SERVICE_LABELS, formatDate, formatCurrency } from '@/lib/utils'

type Technician = { id: string; name: string }
type Order = {
  id: string; orderNumber: string; status: string; serviceType: string
  scheduledDate: string | null; description: string; notes: string | null; price: number | null
  createdAt: string; customer: { name: string; phone: string; address: string }
  technician: Technician | null
}

const STATUSES = ['ALL', 'PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<Order | null>(null)
  const [editForm, setEditForm] = useState({ status: '', technicianId: '', notes: '', price: '' })
  const [loading, setLoading] = useState(true)

  const loadOrders = useCallback(async () => {
    const res = await fetch(`/api/orders?status=${filterStatus}`)
    setOrders(await res.json())
    setLoading(false)
  }, [filterStatus])

  useEffect(() => { loadOrders() }, [loadOrders])
  useEffect(() => { fetch('/api/technicians').then(r => r.json()).then(setTechnicians) }, [])

  const filtered = orders.filter(o =>
    o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
    o.customer.name.toLowerCase().includes(search.toLowerCase())
  )

  async function saveEdit() {
    if (!editing) return
    const data: Record<string, unknown> = { status: editForm.status, notes: editForm.notes }
    if (editForm.technicianId) data.technicianId = editForm.technicianId
    if (editForm.price) data.price = parseFloat(editForm.price)
    await fetch(`/api/orders/${editing.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    setEditing(null)
    loadOrders()
  }

  async function deleteOrder(id: string) {
    if (!confirm('Hapus order ini?')) return
    await fetch(`/api/orders/${id}`, { method: 'DELETE' })
    loadOrders()
  }

  function openEdit(order: Order) {
    setEditing(order)
    setEditForm({ status: order.status, technicianId: order.technician?.id || '', notes: order.notes || '', price: order.price?.toString() || '' })
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Order</h1>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nomor order atau pelanggan..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {STATUSES.map(s => (
              <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-2 rounded-lg text-sm font-medium transition ${filterStatus === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {s === 'ALL' ? 'Semua' : STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs">
              <tr>
                <th className="px-5 py-3 text-left font-medium">No. Order</th>
                <th className="px-5 py-3 text-left font-medium">Pelanggan</th>
                <th className="px-5 py-3 text-left font-medium">Layanan</th>
                <th className="px-5 py-3 text-left font-medium">Status</th>
                <th className="px-5 py-3 text-left font-medium">Teknisi</th>
                <th className="px-5 py-3 text-left font-medium">Jadwal</th>
                <th className="px-5 py-3 text-left font-medium">Harga</th>
                <th className="px-5 py-3 text-left font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={8} className="px-5 py-10 text-center text-gray-400">Memuat...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-5 py-10 text-center text-gray-400">Tidak ada order ditemukan</td></tr>
              ) : filtered.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-4 font-mono text-blue-700 font-medium text-xs">{order.orderNumber}</td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-800">{order.customer.name}</div>
                    <div className="text-xs text-gray-400">{order.customer.phone}</div>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{SERVICE_LABELS[order.serviceType] || order.serviceType}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status] || 'bg-gray-100'}`}>
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-600 text-xs">{order.technician?.name || <span className="text-gray-300">Belum ditugaskan</span>}</td>
                  <td className="px-5 py-4 text-gray-500 text-xs">{formatDate(order.scheduledDate)}</td>
                  <td className="px-5 py-4 text-gray-700 text-xs">{order.price ? formatCurrency(order.price) : '-'}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(order)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteOrder(order.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="font-bold text-gray-800 mb-1">Update Order</h2>
            <p className="text-sm text-gray-500 mb-5 font-mono">{editing.orderNumber}</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  {['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map(s => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teknisi</label>
                <select value={editForm.technicianId} onChange={e => setEditForm({ ...editForm, technicianId: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="">-- Pilih Teknisi --</option>
                  {technicians.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                <input type="number" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="150000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
                <textarea value={editForm.notes} onChange={e => setEditForm({ ...editForm, notes: e.target.value })} rows={2} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditing(null)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl font-medium hover:bg-gray-50">Batal</button>
              <button onClick={saveEdit} className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-medium hover:bg-blue-700">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
