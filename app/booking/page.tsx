'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AirVent, ArrowLeft, CheckCircle } from 'lucide-react'

const SERVICE_TYPES = [
  { value: 'CUCI_AC', label: 'Cuci AC' },
  { value: 'ISI_FREON', label: 'Isi Freon' },
  { value: 'INSTALASI', label: 'Instalasi AC' },
  { value: 'PERBAIKAN', label: 'Perbaikan AC' },
]

export default function BookingPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', serviceType: '', scheduledDate: '', description: '' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ orderNumber: string } | null>(null)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.phone || !form.address || !form.serviceType || !form.description) {
      setError('Harap isi semua kolom yang wajib diisi.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) throw new Error('Gagal membuat order')
      const data = await res.json()
      setResult(data)
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  if (result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600 w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Pesanan Berhasil!</h2>
          <p className="text-gray-500 mb-6">Nomor order Anda adalah:</p>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
            <div className="text-3xl font-bold text-blue-700">{result.orderNumber}</div>
            <p className="text-sm text-blue-500 mt-1">Simpan nomor ini untuk melacak status order Anda</p>
          </div>
          <p className="text-gray-500 text-sm mb-8">Tim kami akan menghubungi Anda segera untuk konfirmasi jadwal.</p>
          <div className="flex flex-col gap-3">
            <Link href={`/tracking?order=${result.orderNumber}`} className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 block">
              Lacak Status Order
            </Link>
            <Link href="/" className="border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 block">
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    )
  }

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

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Pesan Service AC</h1>
          <p className="text-gray-500 mb-8">Isi formulir di bawah dan tim kami akan segera menghubungi Anda.</p>

          {error && <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg p-3 mb-6 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap <span className="text-red-500">*</span></label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Contoh: Budi Santoso" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No. Telepon <span className="text-red-500">*</span></label>
                <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="08xx-xxxx-xxxx" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-gray-400 font-normal">(opsional)</span></label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="email@contoh.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap <span className="text-red-500">*</span></label>
              <textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} rows={2} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Jl. Nama Jalan No. XX, Kelurahan, Manado" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Layanan <span className="text-red-500">*</span></label>
                <select value={form.serviceType} onChange={e => setForm({ ...form, serviceType: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="">-- Pilih Layanan --</option>
                  {SERVICE_TYPES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal yang Diinginkan</label>
                <input type="date" value={form.scheduledDate} onChange={e => setForm({ ...form, scheduledDate: e.target.value })} min={new Date().toISOString().split('T')[0]} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan / Keluhan <span className="text-red-500">*</span></label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Jelaskan kondisi AC Anda atau detail layanan yang dibutuhkan..." />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-base hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? 'Memproses...' : 'Kirim Pesanan'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
