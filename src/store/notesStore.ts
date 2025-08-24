import { create } from 'zustand';
import { Note, NotePriority, NoteStatus } from '@/types';

export interface NoteFilters {
  status?: NoteStatus | null;
  priority?: NotePriority | null;
  tags?: string[]; // Array of tag IDs
}

interface NotesStore {
  notes: Note[];
  currentNote: Note | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string; // Ditambahkan untuk menampung query pencarian
  filters: NoteFilters;

  // Actions
  setNotes: (notes: Note[]) => void;
  addNote: (note: Note) => void;
  updateNote: (id: string, updatedNote: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  setCurrentNote: (note: Note | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reorderNotes: (reorderedNotes: Array<{ id: string; position: number }>) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (newFilters: NoteFilters) => void; // Aksi baru
  clearFilters: () => void;

  // Getters
  filteredNotes: () => Note[];
}

export const useNotesStore = create<NotesStore>((set, get) => ({
  notes: [],
  currentNote: null,
  isLoading: false,
  error: null,
  searchQuery: '', // Nilai awal untuk search query
  filters: {
    status: null,
    priority: null,
    tags: [],
  },

  setNotes: (notes) => set({ notes }),

  addNote: (note) =>
    set((state) => ({
      notes: [...state.notes, note],
    })),

  updateNote: (id, updatedNote) =>
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id ? { ...note, ...updatedNote } : note
      ),
      currentNote:
        state.currentNote?.id === id
          ? { ...state.currentNote, ...updatedNote }
          : state.currentNote,
    })),

  deleteNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id),
      currentNote: state.currentNote?.id === id ? null : state.currentNote,
    })),

  setCurrentNote: (note) => set({ currentNote: note }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),
  
  setSearchQuery: (query) => set({ searchQuery: query }), // Implementasi fungsi setSearchQuery

  reorderNotes: (reorderedNotes) =>
    set((state) => {
      const noteMap = new Map(state.notes.map(note => [note.id, note]));
      reorderedNotes.forEach(({ id, position }) => {
        const note = noteMap.get(id);
        if (note) {
          note.position = position;
        }
      });
      const updatedNotes = Array.from(noteMap.values());
      return {
        notes: updatedNotes.sort((a, b) => a.position - b.position),
      };
    }),
    
  // Implementasi getter untuk memfilter catatan berdasarkan searchQuery
  filteredNotes: () => {
    const { notes, searchQuery } = get();
    if (!searchQuery) {
      return notes;
    }
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (note.content && note.content.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  },

  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters },
  })),
  
  clearFilters: () => set({
    filters: { status: null, priority: null, tags: [] },
  }),
}));
