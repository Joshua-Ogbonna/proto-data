"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
// import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: string[];
}

export function AuthGuard({
  children,
  requireAuth = true,
  allowedRoles = [],
}: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !user) {
        // Save the attempted URL for redirecting after login
        localStorage.setItem("returnUrl", pathname);
        router.push("/login");
      }

      if (
        user &&
        allowedRoles.length > 0 &&
        !allowedRoles.includes(user.role)
      ) {
        router.push("/unauthorized");
      }

      if (user && !requireAuth && pathname === "/login") {
        router.push("/dashboard");
      }
    }
  }, [user, isLoading, requireAuth, allowedRoles, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        {/* <LoadingSpinner /> */}
        Loading...
      </div>
    );
  }

  if (requireAuth && !user) {
    return null;
  }

  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
