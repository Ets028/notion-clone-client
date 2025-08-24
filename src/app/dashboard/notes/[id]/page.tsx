'use client';

import { useParams } from 'next/navigation';
import { FileWarning, Loader2, Plus } from 'lucide-react';
import { useNotes } from '@/hooks/useNotes';
import NoteEditor from '@/components/notes/NoteEditor';
import CreateNoteDialog from '@/components/notes/CreateNoteDialog';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors, useDroppable, useDraggable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Note, NoteStatus } from '@/types';
import { cn } from '@/lib/utils';
import { useNotesStore } from '@/store/notesStore';

// --- Komponen untuk Papan Kanban ---

// Kartu untuk item di papan Kanban
function KanbanCard({ note }: { note: Note }) {
  const { setCurrentNote } = useNotesStore();
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: note.id,
    data: { note },
  });

  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={cn(isDragging && "opacity-50")}>
      <Card onClick={() => setCurrentNote(note)} className="cursor-pointer hover:bg-accent shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-medium">{note.title}</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}

// Kolom untuk papan Kanban
function KanbanColumn({ status, notes, title }: { status: NoteStatus; notes: Note[]; title: string }) {
  const { setNodeRef } = useDroppable({ id: status });
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-semibold text-muted-foreground px-1">{title}</h3>
      <div ref={setNodeRef} className="bg-muted/50 rounded-lg p-3 min-h-[200px] flex flex-col gap-3">
        <SortableContext items={notes.map(n => n.id)} strategy={verticalListSortingStrategy}>
          {notes.map(note => <KanbanCard key={note.id} note={note} />)}
        </SortableContext>
      </div>
    </div>
  );
}

// --- Komponen Halaman Utama ---

export default function NoteDetailPage() {
  const params = useParams();
  const noteId = params.id as string;

  const { useNote, updateNote } = useNotes();
  const { data: note, isLoading, isError } = useNote(noteId);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const draggedNote = active.data.current?.note as Note;
      const targetStatus = over.id as NoteStatus;
      if (draggedNote.status !== targetStatus) {
        updateNote(draggedNote.id, { status: targetStatus });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="mt-4 text-sm">Memuat catatan...</p>
      </div>
    );
  }

  if (isError || !note) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center">
        <FileWarning className="h-12 w-12" />
        <h2 className="mt-4 text-xl font-semibold">Catatan Tidak Ditemukan</h2>
        <p className="max-w-xs mt-2 text-sm">
          Catatan yang Anda cari mungkin telah dihapus atau Anda tidak memiliki akses.
        </p>
      </div>
    );
  }

  const subNotesByStatus = {
    NOT_STARTED: note.children?.filter(n => n.status === 'NOT_STARTED') || [],
    IN_PROGRESS: note.children?.filter(n => n.status === 'IN_PROGRESS') || [],
    DONE: note.children?.filter(n => n.status === 'DONE') || [],
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto">
        {/* Editor di bagian atas */}
        <div className="max-w-4xl mx-auto">
          <NoteEditor key={note.id} initialNote={note} />
        </div>
        
        {/* Papan Kanban untuk sub-halaman di bawah */}
        <div className="max-w-6xl mx-auto px-8 py-12 border-t mt-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Sub-Halaman</h2>
            <CreateNoteDialog parentId={note.id}>
              <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> Halaman Baru</Button>
            </CreateNoteDialog>
          </div>
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <KanbanColumn status="NOT_STARTED" title="To Do" notes={subNotesByStatus.NOT_STARTED} />
              <KanbanColumn status="IN_PROGRESS" title="In Progress" notes={subNotesByStatus.IN_PROGRESS} />
              <KanbanColumn status="DONE" title="Done" notes={subNotesByStatus.DONE} />
            </div>
          </DndContext>
        </div>
      </div>
    </div>
  );
}
