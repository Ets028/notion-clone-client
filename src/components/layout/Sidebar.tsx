"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";
import {
  FileText,
  Plus,
  Star,
  Clock,
  ChevronRight,
  GripVertical,
  Home,
  LogOut,
  Moon,
  Sun,
  X as CloseIcon
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useNotes } from "@/hooks/useNotes";
import { useNotesStore } from "@/store/notesStore";
import { cn } from "@/lib/utils";
import type { Note } from "@/types";
import { notesApi } from "@/lib/api";
import { TrashBox } from "./TrashBox";
import { useTheme } from "next-themes";
import Link from "next/link";
import { FilterPopover } from "./FilterPopover";
import { useUIStore } from "@/store/uiStore";

function NoteItem({
  note: initialNote,
  level = 0,
}: {
  note: Note;
  level?: number;
}) {
  const { currentNote } = useNotesStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    isDragging,
  } = useDraggable({
    id: initialNote.id,
    data: { note: initialNote, isNoteItem: true },
  });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: initialNote.id,
    data: { note: initialNote },
  });

  const { data: note } = useQuery<Note>({
    queryKey: ["notes", initialNote.id],
    queryFn: () => notesApi.getById(initialNote.id),
    enabled: isExpanded,
    initialData: initialNote,
  });

  useEffect(() => {
    if (isExpanded) setHasAttemptedFetch(true);
  }, [isExpanded]);

  const isSelected = currentNote?.id === note.id;
  const hasChildren = note.children && note.children.length > 0;
  const canExpand = !hasAttemptedFetch || hasChildren;

  return (
    <div
      ref={setDraggableRef}
      className={cn("relative", isDragging && "opacity-40")}
    >
      {/* FIX: Bungkus dengan Link untuk navigasi */}
      <Link href={`/dashboard/notes/${note.id}`} passHref>
        <div
          ref={setDroppableRef}
          className={cn(
            "group flex items-center gap-1 pr-2 py-1.5 mx-1 text-sm rounded-md cursor-pointer transition-all duration-150",
            "hover:bg-sidebar-accent",
            isSelected && "bg-sidebar-accent text-sidebar-accent-foreground",
            isOver && "bg-primary/20 ring-2 ring-primary/50"
          )}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          {canExpand && (
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 p-0 hover:bg-sidebar-accent/80"
              onClick={(e) => {
                e.preventDefault(); // Mencegah navigasi saat hanya expand/collapse
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              <ChevronRight 
                className={cn(
                  "h-3 w-3 transition-transform duration-200",
                  isExpanded && "rotate-90"
                )} 
              />
            </Button>
          )}

          <div className="flex-1 flex items-center min-w-0 gap-2">
            <FileText className="h-4 w-4 text-sidebar-foreground/60 flex-shrink-0" />
            <span className="truncate font-medium">
              {note.title}
            </span>
            <div className="flex items-center gap-1 ml-auto">
              {note.isFavorite && (
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
              )}
              {note.status === 'IN_PROGRESS' && (
                <Clock className="h-3 w-3 text-blue-500" />
              )}
              {hasChildren && (
                <Badge variant="secondary" className="h-4 px-1 text-xs">
                  {note.children?.length}
                </Badge>
              )}
            </div>
          </div>

          <div
            {...attributes}
            {...listeners}
            className="drag-handle opacity-0 group-hover:opacity-100 p-1 -m-1 cursor-grab active:cursor-grabbing transition-opacity hover:bg-sidebar-accent/80 rounded"
          >
            <GripVertical className="h-3 w-3 text-sidebar-foreground/50" />
          </div>
        </div>
      </Link>
      
      {isExpanded && hasChildren && (
        <div className="ml-2">
          {note.children?.map((childNote) => (
            <NoteItem key={childNote.id} note={childNote} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

// Komponen Sidebar Utama
export default function Sidebar() {
  const { user, logout } = useAuth();
  const { notes, isLoading, createNote, updateNote } = useNotes();
  const { setCurrentNote } = useNotesStore();
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const { theme, setTheme } = useTheme();
  const { isMobile, setSidebarOpen } = useUIStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const { setNodeRef: setRootDroppableRef, isOver: isOverRoot } = useDroppable({
    id: "--root-drop-zone--",
  });

  const handleDragStart = (event: any) => {
    if (event.active.data.current?.isNoteItem) {
      setActiveNote(event.active.data.current.note);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveNote(null);
    const { active, over } = event;
    if (!over) return;

    const draggedNote = active.data.current?.note as Note;

    if (over.id === "--root-drop-zone--") {
      if (draggedNote.parentId !== null) {
        updateNote(draggedNote.id, { parentId: null });
      }
      return;
    }

    if (active.id !== over.id) {
      const targetNote = over.data.current?.note as Note;
      if (
        draggedNote &&
        targetNote &&
        !isDescendant(draggedNote, targetNote.id)
      ) {
        updateNote(draggedNote.id, { parentId: targetNote.id });
      }
    }
  };

  const isDescendant = (note: Note, targetId: string): boolean => {
    if (note.id === targetId) return true;
    if (!note.children) return false;
    return note.children.some((child) => isDescendant(child, targetId));
  };

  const topLevelNotes = notes.filter((note) => !note.parentId);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <aside className="w-full h-full bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border">
        {/* Workspace Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            className="w-full justify-start items-center gap-3 p-3 h-auto hover:bg-sidebar-accent transition-colors rounded-lg"
            onClick={() => setCurrentNote(null)}
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                {user?.username?.slice(0, 2).toUpperCase() || "US"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
              <div className="font-semibold">
                {user?.username}'s Notion
              </div>
              <div className="text-xs text-sidebar-foreground/70">
                Personal workspace
              </div>
            </div>
          </Button>
          {isMobile && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSidebarOpen(false)}>
                <CloseIcon className="h-4 w-4" />
              </Button>
            )}
            </div>
        </div>

        {/* Navigation Menu */}
        <div className="p-3 space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-3 h-9 px-3"
            onClick={() => setCurrentNote(null)}
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Button>
          
          {/* Ganti tombol Favorites dengan FilterPopover */}
          <FilterPopover />

          <TrashBox />
        </div>

        <div className="border-t border-sidebar-border my-2"></div>

        {/* Private Notes Section */}
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-1 pb-4">
            <div
              ref={setRootDroppableRef}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg transition-colors",
                isOverRoot && activeNote?.parentId && "bg-primary/20 ring-2 ring-primary/50"
              )}
            >
              <h3 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
                Private
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-sidebar-accent transition-colors rounded"
                onClick={() => createNote({ title: "Untitled" })}
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>

            {isLoading && (
              <div className="px-4 py-8 text-center">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              </div>
            )}

            {!isLoading && topLevelNotes.length === 0 && (
              <div className="text-center py-8 px-4">
                <FileText className="h-8 w-8 mx-auto text-sidebar-foreground/40 mb-3" />
                <div className="text-sm text-sidebar-foreground/70 mb-3">
                  No pages inside
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-sm hover:bg-sidebar-accent"
                  onClick={() => createNote({ title: "Getting Started" })}
                >
                  <Plus className="h-4 w-4" />
                  Add a page
                </Button>
              </div>
            )}

            {!isLoading && topLevelNotes.map((note) => (
              <NoteItem key={note.id} note={note} />
            ))}
          </div>
        </ScrollArea>
        <div className="mt-auto p-3 border-t border-sidebar-border">
          <div className="space-y-1">
            <Button variant="ghost" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="w-full justify-start gap-3 h-9 px-3 hover:bg-sidebar-accent">
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              <span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
            </Button>
            <Button variant="ghost" onClick={logout} className="w-full justify-start gap-3 h-9 px-3 text-destructive hover:text-destructive hover:bg-destructive/10">
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </Button>
          </div>
        </div>
      </aside>
      
      <DragOverlay>
        {activeNote ? (
          <div className="bg-card shadow-xl border rounded-lg p-3 flex items-center gap-3 text-sm max-w-[240px]">
            <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="truncate font-medium">
              {activeNote.title}
            </span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
