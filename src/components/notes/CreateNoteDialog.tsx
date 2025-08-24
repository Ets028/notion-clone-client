'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNotes } from '@/hooks/useNotes';
import { CreateNoteFormData, createNoteSchema } from '@/lib/schema';
import { CreateNoteData } from '@/types';

// Terima 'children' untuk pemicu kustom dan 'parentId'
interface CreateNoteDialogProps {
  children?: React.ReactNode;
  parentId?: string | null;
}

export default function CreateNoteDialog({ children, parentId = null }: CreateNoteDialogProps) {
  const [open, setOpen] = useState(false);
  const { createNote, isCreating } = useNotes();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateNoteFormData>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  const onSubmit = (data: CreateNoteFormData) => {
    // FIX: Buat objek data dan hanya tambahkan parentId jika ada (bukan null)
    const noteData: CreateNoteData = { ...data };
    if (parentId) {
      noteData.parentId = parentId;
    }
    
    createNote(noteData, {
      onSuccess: () => {
        reset();
        setOpen(false);
      },
    });
  };


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* Render 'children' jika ada, jika tidak, render tombol default */}
        {children || (
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Catatan Baru
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Buat Catatan Baru</DialogTitle>
            <DialogDescription>
              Buat catatan baru untuk mulai menulis ide-ide Anda.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Judul</Label>
              <Input
                id="title"
                placeholder="Masukkan judul catatan"
                {...register('title')}
                className={errors.title ? 'border-destructive' : ''}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Konten (Opsional)</Label>
              <Textarea
                id="content"
                placeholder="Tulis konten awal..."
                rows={4}
                {...register('content')}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isCreating}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isCreating ? 'Membuat...' : 'Buat Catatan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
