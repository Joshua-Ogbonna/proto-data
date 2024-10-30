import PublicLayout from '@/components/guards/PublicLayout'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PublicLayout>{children}</PublicLayout>
}