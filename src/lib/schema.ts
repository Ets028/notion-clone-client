import { z } from 'zod';

// Skema untuk Autentikasi
export const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

export const registerSchema = z.object({
  username: z.string().min(3, 'Username minimal 3 karakter'),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;


// Skema untuk Catatan (Note)
export const createNoteSchema = z.object({
  title: z.string().min(1, 'Judul tidak boleh kosong'),
  content: z.any().optional(),
  parentId: z.string().nullable().optional(),
});

export const updateNoteSchema = z.object({
  title: z.string().min(1, 'Judul tidak boleh kosong').optional(),
  content: z.any().optional(),
  isFavorite: z.boolean().optional(),
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'DONE']).optional(),
  // Tambahkan properti baru agar form valid
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).nullable().optional(),
  dueDate: z.string().datetime().nullable().optional(),
  tags: z.array(z.string()).optional(),
  parentId: z.string().nullable().optional(),
});

export const reorderNotesSchema = z.object({
  notes: z.array(
    z.object({
      id: z.string(),
      position: z.number(),
    })
  ),
});

export type CreateNoteFormData = z.infer<typeof createNoteSchema>;
export type UpdateNoteFormData = z.infer<typeof updateNoteSchema>;
