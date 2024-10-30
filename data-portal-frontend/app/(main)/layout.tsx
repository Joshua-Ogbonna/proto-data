import ProtectedLayout from '@/components/guards/ProtectedLayout'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedLayout allowedRoles={['admin', 'user']}>{children}</ProtectedLayout>
}