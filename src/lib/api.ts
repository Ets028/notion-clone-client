import axios from "axios";
import type {
  User,
  LoginCredentials,
  RegisterCredentials,
  Note,
  CreateNoteData,
  UpdateNoteData,
  ReorderNotesData,
  Tag,
} from "@/types";
import { NoteFilters } from "@/store/notesStore";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth API
export const authApi = {
  register: async (credentials: RegisterCredentials) => {
    const response = await api.post("/auth/register", credentials);
    return response.data;
  },

  login: async (credentials: LoginCredentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  me: async (): Promise<User> => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

// Notes API
export const notesApi = {
 getAll: async (filters?: NoteFilters): Promise<Note[]> => {
    // Bangun query string dari objek filter
    const params = new URLSearchParams();
    if (filters?.status) {
      params.append('status', filters.status);
    }
    if (filters?.priority) {
      params.append('priority', filters.priority);
    }
    if (filters?.tags && filters.tags.length > 0) {
      params.append('tags', filters.tags.join(','));
    }
    
    const response = await api.get(`/notes?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<Note> => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  create: async (data: CreateNoteData): Promise<Note> => {
    const response = await api.post("/notes", data);
    return response.data;
  },

  update: async (id: string, data: UpdateNoteData): Promise<Note> => {
    const response = await api.put(`/notes/${id}`, data);
    return response.data;
  },

  // UBAH: Fungsi 'delete' sekarang menjadi 'archive'
  archive: async (id: string): Promise<void> => {
    await api.delete(`/notes/${id}`);
  },

  restore: async (id: string) => {
    const response = await api.post(`/notes/${id}/restore`); // <-- Ini seharusnya POST
    return response.data;
  },

  // BARU: Fungsi untuk menghapus catatan secara permanen
  deletePermanently: async (id: string): Promise<void> => {
    await api.delete(`/notes/${id}/permanent`);
  },
  
  // BARU: Fungsi untuk mengambil semua catatan yang diarsipkan
  getArchived: async (): Promise<Note[]> => {
    const response = await api.get('/notes/archived');
    return response.data;
  },

  reorder: async (data: ReorderNotesData) => {
    const response = await api.patch("/notes/reorder", data);
    return response.data;
  },
};

export const tagsApi = {
  getAll: async (): Promise<Tag[]> => {
    const response = await api.get("/tags");
    return response.data;
  },

  create: async (data: { name: string; color: string }): Promise<Tag> => {
    const response = await api.post("/tags", data);
    return response.data;
  },

  update: async (id: string, data: Partial<{ name: string; color: string }>): Promise<Tag> => {
    const response = await api.put(`/tags/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tags/${id}`);
  },
};

export default api;
