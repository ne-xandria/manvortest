'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'

type Technician = { id: string; name: string; phone: string; specialization: string; isActive: boolean; createdAt: string; _count: { orders: number } }

const emptyForm = { name: '', phone: '', specialization: '' }

export default function TechniciansPage() {
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  async function load() {
    const res = await fetch('/api/technicians')
    setTechnicians(await res.json())
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  async function save() {
    if (!form.name || !form.phone || !form.specialization) return
    if (editing) {
      await fetch(`/api/technicians/${editing}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    } else {
      await fetch('/api/technicians', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    }
    setShowForm(false); setEditing(null); setForm(emptyForm); load()
  }

  async function toggleActive(tech: Technician) {
    await fetch(`/api/technicians/${tech.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !tech.isActive }) })
    load()
  }

  async function deleteTech(id: string) {
    if (!confirm('Hapus teknisi ini?')) return
    await fetch(`/api/technicians/${id}`, { method: 'DELETE' })
    load()
  }

  function openEdit(t: Technician) {
    setEditing(t.id); setForm({ name: t.name, phone: t.phone, specialization: t.specialization }); setShowForm(true)
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Teknisi</h1>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm(emptyForm) }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
          <Plus className="w-4 h-4" />Tambah Teknisi
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="text-gray-400">Memuat...</div>
        ) : technicians.map(t => (
          <div key={t.id} className={`bg-white rounded-2xl shadow-sm p-5 border-2 ${t.isActive ? 'border-transparent' : 'border-gray-100 opacity-70'}`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-bold text-gray-800">{t.name}</div>
                <div className="text-sm text-gray-500">{t.specialization}</div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${t.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {t.isActive ? 'Aktif' : 'Nonaktif'}
              </span>
            </div>
            <div className="text-sm text-gray-500 mb-4">{t.phone}</div>
            <div className="bg-blue-50 text-blue-700 text-sm font-semibold text-center py-2 rounded-xl mb-4">
              {t._count.orders} Order Dikerjakan
            </div>
            <div className="flex gap-2">
              <button onClick={() => toggleActive(t)} className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 py-2 rounded-xl text-xs font-medium hover:bg-gray-50 transition">
                {t.isActive ? <ToggleRight className="w-4 h-4 text-green-500" /> : <ToggleLeft className="w-4 h-4" />}
                {t.isActive ? 'Nonaktifkan' : 'Aktifkan'}
              </button>
              <button onClick={() => openEdit(t)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => deleteTech(t.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h2 className="font-bold text-gray-800 mb-5">{editing ? 'Edit Teknisi' : 'Tambah Teknisi'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nama teknisi" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No. Telepon</label>
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="08xx-xxxx-xxxx" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Spesialisasi</label>
                <input value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Cuci & Freon / Instalasi / Perbaikan" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowForm(false); setEditing(null) }} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl font-medium hover:bg-gray-50">Batal</button>
              <button onClick={save} className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-medium hover:bg-blue-700">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
