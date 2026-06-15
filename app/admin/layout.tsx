'use client'

import { SessionProvider, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { AirVent, LayoutDashboard, ClipboardList, Users, Wrench, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/orders', icon: ClipboardList, label: 'Order' },
  { href: '/admin/customers', icon: Users, label: 'Pelanggan' },
  { href: '/admin/technicians', icon: Wrench, label: 'Teknisi' },
]

function AdminNav() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg"><AirVent className="text-white w-4 h-4" /></div>
          <span className="font-bold text-blue-700 text-sm">Admin Panel</span>
        </div>
        <button onClick={() => setOpen(!open)} className="p-2 text-gray-500">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden bg-white border-b px-4 py-2 space-y-1">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${pathname.startsWith(href) ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              <Icon className="w-4 h-4" />{label}
            </Link>
          ))}
          <button onClick={() => signOut({ callbackUrl: '/admin/login' })} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 w-full">
            <LogOut className="w-4 h-4" />Keluar
          </button>
        </div>
      )}
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-60 lg:fixed lg:inset-y-0 bg-white border-r">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-xl"><AirVent className="text-white w-5 h-5" /></div>
            <div>
              <div className="font-bold text-blue-700 leading-none">Manvor</div>
              <div className="text-xs text-gray-500">Service AC – Admin</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${pathname.startsWith(href) ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              <Icon className="w-4 h-4" />{label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          {session?.user && (
            <div className="px-4 py-2 mb-2">
              <div className="text-xs text-gray-500">Login sebagai</div>
              <div className="text-sm font-medium text-gray-800 truncate">{session.user.name}</div>
            </div>
          )}
          <button onClick={() => signOut({ callbackUrl: '/admin/login' })} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 w-full transition">
            <LogOut className="w-4 h-4" />Keluar
          </button>
        </div>
      </aside>
    </>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <main className="lg:pl-60">
          {children}
        </main>
      </div>
    </SessionProvider>
  )
}
