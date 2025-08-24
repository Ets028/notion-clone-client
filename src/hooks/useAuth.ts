import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import type { LoginCredentials, RegisterCredentials, User } from '@/types';

export const useAuth = () => {
  const { setUser, logout: logoutStore } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  // Get current user
  const { data: user, isLoading, isError } = useQuery<User | null, any>({
    queryKey: ['auth', 'me'],
    
    // PERBAIKAN UTAMA: Tangani 401 di dalam queryFn, bukan dengan 'retry'.
    queryFn: async () => {
      try {
        // Coba dapatkan data user
        const userData = await authApi.me();
        return userData;
      } catch (error: any) {
        // Jika error adalah 401, ini bukan error aplikasi, tapi status.
        // Kembalikan null agar query dianggap 'success' dengan data null.
        if (error.response?.status === 401) {
          return null;
        }
        // Untuk error lainnya (misal: server mati), lempar error agar
        // React Query bisa menanganinya.
        throw error;
      }
    },
    
    // Logika retry sekarang tidak lagi diperlukan untuk menangani 401.
    // Kita bisa biarkan default atau hapus.
    retry: 1, 

    // Mencegah refetch otomatis saat fokus ke window.
    refetchOnWindowFocus: false,
  });

  // Sinkronkan state user dengan Zustand store
  useEffect(() => {
    if (!isLoading) {
      // Karena 401 sekarang mengembalikan 'user' sebagai null, 
      // kita bisa menyederhanakan logika ini.
      setUser(user ?? null);
    }
  }, [user, isLoading, setUser]);

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (credentials: RegisterCredentials) => authApi.register(credentials),
    onSuccess: () => {
      toast.success('Registrasi berhasil! Silakan login.');
      router.push('/login');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Registrasi gagal');
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data: { user: User }) => {
      queryClient.setQueryData(['auth', 'me'], data.user);
      setUser(data.user);
      toast.success('Login berhasil!');
      router.push('/dashboard');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Login gagal');
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logoutStore();
      queryClient.setQueryData(['auth', 'me'], null); // Set user ke null di cache
      queryClient.clear(); // Opsional, jika ingin membersihkan semua cache
      toast.success('Logout berhasil');
      router.push('/login');
    },
    onError: () => {
      logoutStore();
      queryClient.setQueryData(['auth', 'me'], null);
      queryClient.clear();
      toast.error('Gagal menghubungi server, logout paksa dilakukan.');
      router.push('/login');
    },
  });

  return {
    user,
    isLoading,
    register: (credentials: RegisterCredentials) => registerMutation.mutate(credentials),
    login: (credentials: LoginCredentials) => loginMutation.mutate(credentials),
    logout: () => logoutMutation.mutate(),
    isRegistering: registerMutation.isPending,
    isLoggingIn: loginMutation.isPending,
  };
};
