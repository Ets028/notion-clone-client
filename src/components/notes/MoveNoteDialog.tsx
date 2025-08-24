'use client';

import { useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { FileText, CornerUpLeft } from 'lucide-react';
import { useNotes } from '@/hooks/useNotes';
import type { Note } from '@/types';
import { cn } from '@/lib/utils';

interface MoveNoteDialogProps {
  noteToMove: Note;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Fungsi rekursif untuk menampilkan item dan anak-anaknya
function SelectableNoteItem({
  note,
  level,
  onSelect,
}: {
  note: Note;
  level: number;
  onSelect: (parentId: string | null) => void;
}) {
  return (
    <div>
      <Button
        variant="ghost"
        className="w-full justify-start h-auto py-1.5"
        style={{ paddingLeft: `${level * 16 + 12}px` }}
        onClick={() => onSelect(note.id)}
      >
        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
        <span className="truncate">{note.title}</span>
      </Button>
      {note.children && note.children.length > 0 && (
        <div>
          {note.children.map((child) => (
            <SelectableNoteItem
              key={child.id}
              note={child}
              level={level + 1}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function MoveNoteDialog({
  noteToMove,
  open,
  onOpenChange,
}: MoveNoteDialogProps) {
  const { notes, updateNote } = useNotes();

  // Logika untuk memfilter induk yang valid
  const potentialParents = useMemo(() => {
    // Buat Set berisi ID catatan yang akan dipindahkan dan semua turunannya
    const descendantIds = new Set<string>();
    const queue: Note[] = [noteToMove];
    descendantIds.add(noteToMove.id);

    while (queue.length > 0) {
      const current = queue.shift();
      current?.children?.forEach(child => {
        descendantIds.add(child.id);
        queue.push(child);
      });
    }
    
    // Filter semua catatan: hapus catatan itu sendiri dan semua turunannya
    const validNotes = notes.filter(note => !descendantIds.has(note.id));

    // Bangun kembali struktur pohon dari catatan yang valid
    const noteMap = new Map(validNotes.map(n => [n.id, { ...n, children: [] as Note[] }]));
    const rootNotes: Note[] = [];

    for (const note of noteMap.values()) {
      if (note.parentId && noteMap.has(note.parentId)) {
        noteMap.get(note.parentId)?.children.push(note);
      } else {
        rootNotes.push(note);
      }
    }
    return rootNotes;
  }, [notes, noteToMove]);

  const handleSelectParent = (parentId: string | null) => {
    if (noteToMove.parentId === parentId) {
      onOpenChange(false);
      return;
    }
    updateNote(noteToMove.id, { parentId }, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pindahkan "{noteToMove.title}" ke...</DialogTitle>
          <DialogDescription>
            Pilih catatan induk baru atau pindahkan ke level atas.
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => handleSelectParent(null)}
          >
            <CornerUpLeft className="h-4 w-4 mr-2 text-muted-foreground" />
            Pindahkan ke Level Atas
          </Button>
        </div>
        <ScrollArea className="max-h-64 border-t border-b">
          <div className="p-2">
            {potentialParents.map((note) => (
              <SelectableNoteItem
                key={note.id}
                note={note}
                level={0}
                onSelect={handleSelectParent}
              />
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
