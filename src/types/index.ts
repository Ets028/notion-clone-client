export interface User {
  id: string;
  email: string;
  username: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}


// --- Tipe Tag ---

export interface Tag {
  id: string;
  name: string;
  color?: string;
}



export type NoteStatus = "NOT_STARTED" | "IN_PROGRESS" | "DONE";


export type NotePriority = "LOW" | "MEDIUM" | "HIGH";


export interface Note {
  id: string;
  title: string;
  content: any | null; // Tipe 'any' atau 'Json' untuk konten dari Tiptap
  position: number;
  isFavorite: boolean;
  isArchived: boolean;
  
  // Properti Lanjutan
  status: NoteStatus;
  priority: NotePriority | null;
  dueDate: string | null; // ISO date string

  // Relasi
  authorId: string;
  parentId: string | null;
  
  // Data relasional yang mungkin di-load (nested)
  tags?: Tag[];
  children?: Note[];
  author?: User;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}


export interface CreateNoteData {
  title: string;
  content?: any;
  parentId?: string | null;
}

export interface UpdateNoteData {
  title?: string;
  content?: any;
  isFavorite?: boolean;
  status?: NoteStatus;
  priority?: NotePriority | null;
  dueDate?: string | null;
  parentId?: string | null;
  tags?: string[]; // Saat mengirim update, kita hanya mengirim array ID tag
}

export interface ReorderNotesData {
  notes: Array<{
    id: string;
    position: number;
  }>;
}


// --- Tipe API Generik ---

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  user?: User;
}

export interface ApiError {
  message: string;
  status: number;
}