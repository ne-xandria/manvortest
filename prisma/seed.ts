import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import bcrypt from 'bcryptjs'
import path from 'path'

const adapter = new PrismaBetterSqlite3({ url: path.join(process.cwd(), 'dev.db') })
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@manvorservice.com' },
    update: {},
    create: { email: 'admin@manvorservice.com', password: hashedPassword, name: 'Administrator' },
  })

  await prisma.technician.upsert({
    where: { id: 'tech-001' },
    update: {},
    create: { id: 'tech-001', name: 'Budi Santoso', phone: '081234567890', specialization: 'Instalasi & Perbaikan' },
  })
  await prisma.technician.upsert({
    where: { id: 'tech-002' },
    update: {},
    create: { id: 'tech-002', name: 'Ricky Tumewu', phone: '082345678901', specialization: 'Cuci & Freon' },
  })

  const c1 = await prisma.customer.create({ data: { name: 'Ibu Maria', phone: '08123456789', address: 'Jl. Sam Ratulangi No. 10, Manado', email: 'maria@example.com' } })
  const c2 = await prisma.customer.create({ data: { name: 'Pak John Wenas', phone: '08987654321', address: 'Jl. Piere Tendean No. 5, Manado' } })
  const c3 = await prisma.customer.create({ data: { name: 'Bu Siska Karouw', phone: '08556677889', address: 'Jl. Wolter Monginsidi No. 22, Manado' } })

  await prisma.order.create({ data: { orderNumber: 'ORD-20240001', customerId: c1.id, technicianId: 'tech-001', serviceType: 'CUCI_AC', status: 'COMPLETED', scheduledDate: new Date('2024-01-15'), completedDate: new Date('2024-01-15'), description: 'Cuci AC 2 unit di ruang tamu dan kamar', price: 200000 } })
  await prisma.order.create({ data: { orderNumber: 'ORD-20240002', customerId: c2.id, technicianId: 'tech-002', serviceType: 'ISI_FREON', status: 'IN_PROGRESS', scheduledDate: new Date(), description: 'Isi freon AC 1.5 PK', price: 300000 } })
  await prisma.order.create({ data: { orderNumber: 'ORD-20240003', customerId: c1.id, serviceType: 'INSTALASI', status: 'PENDING', scheduledDate: new Date(Date.now() + 86400000), description: 'Pasang AC baru 1 PK di kamar tidur' } })
  await prisma.order.create({ data: { orderNumber: 'ORD-20240004', customerId: c3.id, technicianId: 'tech-001', serviceType: 'PERBAIKAN', status: 'CONFIRMED', scheduledDate: new Date(Date.now() + 3600000), description: 'AC tidak dingin, perlu perbaikan kompresor', price: 500000 } })

  console.log('Seed completed! Login: admin@manvorservice.com / admin123')
}

main().catch(console.error).finally(() => prisma.$disconnect())
