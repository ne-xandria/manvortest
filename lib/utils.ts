export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}

export const SERVICE_LABELS: Record<string, string> = {
  CUCI_AC: 'Cuci AC',
  ISI_FREON: 'Isi Freon',
  INSTALASI: 'Instalasi AC',
  PERBAIKAN: 'Perbaikan AC',
}

export const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Menunggu',
  CONFIRMED: 'Terkonfirmasi',
  IN_PROGRESS: 'Dalam Proses',
  COMPLETED: 'Selesai',
  CANCELLED: 'Dibatalkan',
}

export const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-purple-100 text-purple-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
}

export function formatDate(date: string | Date | null) {
  if (!date) return '-'
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(date))
}
