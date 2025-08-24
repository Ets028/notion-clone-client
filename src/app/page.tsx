'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { FileText, Star, Zap, Users } from 'lucide-react';

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Memuat...</div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/10">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Workspace Digital
              <span className="text-primary block">untuk Semua Kebutuhan</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Kelola catatan, proyek, dan ide-ide Anda dalam satu tempat yang terorganisir dan mudah digunakan.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-8"
              onClick={() => router.push('/register')}
            >
              Mulai Gratis
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8"
              onClick={() => router.push('/login')}
            >
              Masuk
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Fitur Unggulan
          </h2>
          <p className="text-muted-foreground text-lg">
            Semua yang Anda butuhkan untuk produktivitas maksimal
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Rich Text Editor</h3>
            <p className="text-muted-foreground">
              Editor teks yang powerful untuk menulis dan memformat konten dengan mudah.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
              <Star className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold">Favorit & Status</h3>
            <p className="text-muted-foreground">
              Tandai catatan penting dan lacak progress dengan sistem status yang fleksibel.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Auto Save</h3>
            <p className="text-muted-foreground">
              Pekerjaan Anda tersimpan otomatis tanpa khawatir kehilangan data.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Users className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold">User Friendly</h3>
            <p className="text-muted-foreground">
              Interface yang intuitif dan mudah digunakan untuk semua kalangan.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 Notion Clone. Dibuat dengan ❤️ untuk produktivitas Anda.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}