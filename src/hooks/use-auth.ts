import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

/**
 * Hook to check if user is authenticated
 * Returns loading state and whether user is authenticated
 */
export function useAuth() {
  const { data: session, status } = useSession();
  
  return {
    session,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    user: session?.user,
    userRole: session?.user?.role as string | undefined,
  };
}

/**
 * Hook for role-based access control
 * Returns true if user has one of the specified roles
 */
export function useRole(...roles: string[]) {
  const { userRole, isAuthenticated } = useAuth();
  
  return isAuthenticated && userRole && roles.includes(userRole);
}

/**
 * Hook to require admin role
 * Redirects to login if not authenticated or not admin
 */
export function useRequireAdmin() {
  const router = useRouter();
  const { isAuthenticated, userRole, isLoading } = useAuth();

  if (!isLoading && (!isAuthenticated || userRole !== 'admin')) {
    router.push('/admin/login');
    return false;
  }

  return isAuthenticated && userRole === 'admin';
}

/**
 * Hook to require agency role
 * Redirects to login if not authenticated or not agency
 */
export function useRequireAgency() {
  const router = useRouter();
  const { isAuthenticated, userRole, isLoading } = useAuth();

  if (!isLoading && (!isAuthenticated || userRole !== 'agency')) {
    router.push('/agency/login');
    return false;
  }

  return isAuthenticated && userRole === 'agency';
}

/**
 * Hook for logout functionality
 */
export function useLogout() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  return { logout: handleLogout };
}
