import { AuthGuard } from "@/components/guards/AuthGuard";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard requireAuth={false}>{children}</AuthGuard>;
}
