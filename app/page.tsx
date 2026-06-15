import Link from 'next/link'
import { AirVent, Droplets, Zap, Wrench, Phone, MapPin, Clock, Shield, Star, CheckCircle } from 'lucide-react'

const services = [
  { icon: AirVent, title: 'Cuci AC', desc: 'Pembersihan menyeluruh unit AC indoor & outdoor untuk performa optimal.', price: 'Mulai Rp 80.000' },
  { icon: Droplets, title: 'Isi Freon', desc: 'Pengisian freon AC yang tepat agar AC kembali dingin maksimal.', price: 'Mulai Rp 200.000' },
  { icon: Zap, title: 'Instalasi AC', desc: 'Pemasangan AC baru dengan kabel & pipa yang rapi dan aman.', price: 'Mulai Rp 350.000' },
  { icon: Wrench, title: 'Perbaikan AC', desc: 'Diagnosis dan perbaikan kerusakan AC oleh teknisi berpengalaman.', price: 'Mulai Rp 150.000' },
]

const whyUs = [
  { icon: Shield, title: 'Bergaransi', desc: 'Setiap pengerjaan kami berikan garansi 30 hari.' },
  { icon: Clock, title: 'Cepat & Tepat Waktu', desc: 'Teknisi kami datang sesuai jadwal yang telah ditentukan.' },
  { icon: Star, title: 'Teknisi Berpengalaman', desc: 'Tim kami telah menangani ribuan unit AC di Manado.' },
  { icon: CheckCircle, title: 'Harga Transparan', desc: 'Tidak ada biaya tersembunyi. Harga jelas sebelum pengerjaan.' },
]

const areas = ['Manado Kota', 'Tuminting', 'Singkil', 'Wanea', 'Malalayang', 'Sario', 'Wenang', 'Tikala', 'Paal 2', 'Bunaken']

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <AirVent className="text-white w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-blue-700 text-lg leading-none">Manvor</div>
              <div className="text-xs text-gray-500 leading-none">Service AC</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a href="#layanan" className="hover:text-blue-600">Layanan</a>
            <a href="#kenapa-kami" className="hover:text-blue-600">Kenapa Kami</a>
            <a href="#area" className="hover:text-blue-600">Area</a>
            <a href="#kontak" className="hover:text-blue-600">Kontak</a>
          </div>
          <div className="flex gap-2">
            <Link href="/tracking" className="text-sm px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
              Cek Order
            </Link>
            <Link href="/booking" className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Pesan Sekarang
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 text-white py-24">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-block bg-blue-500/30 text-blue-100 text-sm px-4 py-1 rounded-full mb-6">
            #1 Jasa Service AC di Manado
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            AC Bermasalah?<br />
            <span className="text-yellow-300">Kami Siap Membantu!</span>
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Layanan service AC profesional di Manado dan sekitarnya. Cuci AC, isi freon, instalasi, dan perbaikan oleh teknisi berpengalaman.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking" className="bg-yellow-400 text-gray-900 font-bold px-8 py-4 rounded-xl text-lg hover:bg-yellow-300 transition">
              Pesan Service Sekarang
            </Link>
            <Link href="/tracking" className="bg-white/20 border border-white text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/30 transition">
              Lacak Order Saya
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="layanan" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Layanan Kami</h2>
            <p className="text-gray-500">Solusi lengkap untuk semua kebutuhan AC Anda</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map(({ icon: Icon, title, desc, price }) => (
              <div key={title} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition border border-gray-100">
                <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="text-blue-600 w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm mb-4">{desc}</p>
                <div className="text-blue-600 font-semibold text-sm">{price}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/booking" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
              Pesan Layanan Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section id="kenapa-kami" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Kenapa Pilih Kami?</h2>
            <p className="text-gray-500">Kepercayaan pelanggan adalah prioritas utama kami</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-6">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="text-green-600 w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Area */}
      <section id="area" className="py-20 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Area Layanan</h2>
            <p className="text-gray-500">Kami melayani seluruh wilayah Kota Manado dan sekitarnya</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {areas.map(area => (
              <span key={area} className="bg-white text-blue-700 border border-blue-200 px-5 py-2 rounded-full font-medium text-sm shadow-sm">
                <MapPin className="inline w-3 h-3 mr-1" />{area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="kontak" className="py-20 bg-gray-800 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Hubungi Kami</h2>
            <p className="text-gray-400">Siap melayani Anda setiap hari</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <Phone className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <div className="font-semibold mb-1">Telepon / WhatsApp</div>
              <div className="text-gray-400">0812-3456-7890</div>
            </div>
            <div>
              <Clock className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <div className="font-semibold mb-1">Jam Operasional</div>
              <div className="text-gray-400">Senin – Sabtu: 08.00 – 18.00</div>
            </div>
            <div>
              <MapPin className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <div className="font-semibold mb-1">Lokasi</div>
              <div className="text-gray-400">Manado, Sulawesi Utara</div>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link href="/booking" className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-500 transition">
              Pesan Service Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-500 py-8 text-center text-sm">
        <p>© 2024 Manvor Service AC – Jasa Service AC Manado. All rights reserved.</p>
      </footer>
    </div>
  )
}
