"use client";

import { useNotesStore } from "@/store/notesStore";
import { useNotes } from "@/hooks/useNotes";
import NoteEditor from "@/components/notes/NoteEditor";
import { BookOpen, FileText, Plus } from "lucide-react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { Note, NoteStatus } from "@/types";
import { cn } from "@/lib/utils";
import CreateNoteDialog from "./CreateNoteDialog";
import { Button } from "../ui/button";

// Kartu untuk item di papan Kanban
function KanbanCard({ note }: { note: Note }) {
  const { setCurrentNote } = useNotesStore();
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: note.id,
      data: { note },
    });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(isDragging && "opacity-50")}
    >
      <Card
        onClick={() => setCurrentNote(note)}
        className="cursor-pointer hover:bg-accent shadow-sm"
      >
        <CardHeader>
          <CardTitle className="text-sm font-medium">{note.title}</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}

// Kolom untuk papan Kanban
function KanbanColumn({
  status,
  notes,
  title,
}: {
  status: NoteStatus;
  notes: Note[];
  title: string;
}) {
  const { setNodeRef } = useDroppable({ id: status });
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-semibold text-muted-foreground px-1">{title}</h3>
      <div
        ref={setNodeRef}
        className="bg-muted/50 rounded-lg p-3 min-h-[200px] flex flex-col gap-3"
      >
        <SortableContext
          items={notes.map((n) => n.id)}
          strategy={verticalListSortingStrategy}
        >
          {notes.map((note) => (
            <KanbanCard key={note.id} note={note} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { currentNote } = useNotesStore();
  const { updateNote } = useNotes();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

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

  // Tampilan default saat tidak ada catatan yang dipilih
  if (!currentNote) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-muted/30">
        <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/70" />
        <h2 className="text-xl font-semibold text-foreground">
          Selamat Datang
        </h2>
        <p className="text-muted-foreground max-w-md mt-2">
          Pilih atau buat catatan baru untuk memulai.
        </p>
      </div>
    );
  }

  const subNotesByStatus = {
    NOT_STARTED:
      currentNote.children?.filter((n) => n.status === "NOT_STARTED") || [],
    IN_PROGRESS:
      currentNote.children?.filter((n) => n.status === "IN_PROGRESS") || [],
    DONE: currentNote.children?.filter((n) => n.status === "DONE") || [],
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto">
        {/* Editor sekarang menjadi bagian utama dari tampilan */}
        <div className="max-w-4xl mx-auto">
          <NoteEditor key={currentNote.id} initialNote={currentNote} />
        </div>

        {/* Papan Kanban untuk sub-halaman */}
        <div className="max-w-6xl mx-auto px-8 py-12 border-t mt-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Sub-Halaman</h2>
            <CreateNoteDialog parentId={currentNote.id}>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" /> Halaman Baru
              </Button>
            </CreateNoteDialog>
          </div>
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <KanbanColumn
                status="NOT_STARTED"
                title="To Do"
                notes={subNotesByStatus.NOT_STARTED}
              />
              <KanbanColumn
                status="IN_PROGRESS"
                title="In Progress"
                notes={subNotesByStatus.IN_PROGRESS}
              />
              <KanbanColumn
                status="DONE"
                title="Done"
                notes={subNotesByStatus.DONE}
              />
            </div>
          </DndContext>
        </div>
      </div>
    </div>
  );
}
