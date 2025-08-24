'use client';

import { BookOpen, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useNotes } from '@/hooks/useNotes';

export default function DashboardPage() {
  const { createNote, isCreating } = useNotes();
  const router = useRouter();

  const handleCreateAndNavigate = () => {
    createNote({ title: 'Tanpa Judul' }, {
      onSuccess: (newNote) => {
        // Arahkan ke halaman editor untuk catatan yang baru dibuat
        router.push(`/dashboard/notes/${newNote.id}`);
      },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-muted/30">
      <div className="relative bg-background p-8 rounded-2xl border shadow-sm">
        <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/70" />
        <h2 className="text-xl font-semibold text-foreground">Selamat Datang di Workspace Anda</h2>
        <p className="text-muted-foreground max-w-md mt-2 mb-6">
          Pilih catatan dari sidebar atau buat yang baru untuk memulai.
        </p>
        <Button onClick={handleCreateAndNavigate} disabled={isCreating}>
          <Plus className="h-4 w-4 mr-2" />
          {isCreating ? 'Membuat...' : 'Buat Catatan Baru'}
        </Button>
      </div>
    </div>
  );
}
