import { AuthGuard } from "@/components/guards/AuthGuard";

export default function ProtectedLayout({
  children,
  allowedRoles = [],
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  return (
    <AuthGuard requireAuth={true} allowedRoles={allowedRoles}>
      {children}
    </AuthGuard>
  );
}
