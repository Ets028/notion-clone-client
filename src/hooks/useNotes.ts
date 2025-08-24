import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { notesApi } from "@/lib/api";
import type {
  CreateNoteData,
  Note,
  ReorderNotesData,
  UpdateNoteData,
} from "@/types";
import { useNotesStore } from "@/store/notesStore";

// Tipe untuk callback yang bisa dikirim dari komponen
type MutationCallbacks<T = any> = {
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
};

export const useNotes = () => {
  const queryClient = useQueryClient();
  // Ambil filter dari store
  const filters = useNotesStore((state) => state.filters);

  // UBAH: Query utama sekarang bergantung pada 'filters'
  const { data: notes = [], isLoading, isError } = useQuery<Note[], Error>({
    // Kunci query sekarang menyertakan filter, jadi akan otomatis re-fetch saat filter berubah
    queryKey: ["notes", filters], 
    queryFn: () => notesApi.getAll(filters), // Kirim filter ke API
  });

  // Query untuk mengambil catatan yang diarsipkan
  const { data: archivedNotes = [] } = useQuery<Note[], Error>({
    queryKey: ["notes", "archived"],
    queryFn: notesApi.getArchived,
  });

  // Hook untuk mengambil satu catatan (digunakan di halaman detail)
  const useNote = (id: string | undefined) => {
    return useQuery<Note, Error>({
      queryKey: ["notes", id],
      queryFn: () => notesApi.getById(id!),
      enabled: !!id,
    });
  };

  // --- MUTATIONS ---

  const createNoteMutation = useMutation({
    mutationFn: (data: CreateNoteData) => notesApi.create(data),
  });

  const updateNoteMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNoteData }) =>
      notesApi.update(id, data),
  });

  const archiveNoteMutation = useMutation({
    mutationFn: (id: string) => notesApi.archive(id),
  });
  const restoreNoteMutation = useMutation({
    mutationFn: (id: string) => notesApi.restore(id),
  });
  const deletePermanentlyMutation = useMutation({
    mutationFn: (id: string) => notesApi.deletePermanently(id),
  });
  const reorderNotesMutation = useMutation({
    mutationFn: (data: ReorderNotesData) => notesApi.reorder(data),
  });

  // Objek yang diekspor oleh hook
  return {
    notes,
    archivedNotes,
    isLoading,
    isError,
    useNote,

    // --- FUNGSI-FUNGSI DENGAN LOGIKA TERPUSAT ---

    createNote: (data: CreateNoteData, options?: MutationCallbacks<Note>) => {
      createNoteMutation.mutate(data, {
        onSuccess: (newNote) => {
          toast.success("Catatan berhasil dibuat.");
          queryClient.invalidateQueries({ queryKey: ["notes"] });
          options?.onSuccess?.(newNote);
        },
        onError: (error: any) => {
          toast.error(
            error.response?.data?.message || "Gagal membuat catatan."
          );
          options?.onError?.(error);
        },
      });
    },

    updateNote: (
      id: string,
      data: UpdateNoteData,
      options?: MutationCallbacks<Note>
    ) => {
      updateNoteMutation.mutate(
        { id, data },
        {
          onSuccess: (updatedNote) => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
            queryClient.invalidateQueries({
              queryKey: ["notes", updatedNote.id],
            });
            options?.onSuccess?.(updatedNote);
          },
          onError: options?.onError,
        }
      );
    },

    archiveNote: (id: string, options?: MutationCallbacks<void>) => {
      archiveNoteMutation.mutate(id, {
        onSuccess: () => {
          toast.success("Catatan dipindahkan ke sampah.");
          queryClient.invalidateQueries({ queryKey: ["notes"] });
          queryClient.invalidateQueries({ queryKey: ["notes", "archived"] });
          options?.onSuccess?.();
        },
        onError: options?.onError,
      });
    },

    restoreNote: (id: string, options?: MutationCallbacks<Note>) => {
      restoreNoteMutation.mutate(id, {
        onSuccess: (restoredNote) => {
          toast.success("Catatan berhasil dikembalikan.");
          queryClient.invalidateQueries({ queryKey: ["notes"] });
          queryClient.invalidateQueries({ queryKey: ["notes", "archived"] });
          options?.onSuccess?.(restoredNote);
        },
        onError: options?.onError,
      });
    },

    deletePermanently: (id: string, options?: MutationCallbacks<void>) => {
      deletePermanentlyMutation.mutate(id, {
        onSuccess: () => {
          toast.success("Catatan dihapus permanen.");
          queryClient.invalidateQueries({ queryKey: ["notes", "archived"] });
          options?.onSuccess?.();
        },
        onError: options?.onError,
      });
    },

    reorderNotes: (data: ReorderNotesData, options?: MutationCallbacks) => {
      reorderNotesMutation.mutate(data, {
        onSuccess: (responseData) => {
          queryClient.invalidateQueries({ queryKey: ["notes"] });
          options?.onSuccess?.(responseData);
        },
        onError: options?.onError,
      });
    },

    isCreating: createNoteMutation.isPending,
    isUpdating: updateNoteMutation.isPending,
    isArchiving: archiveNoteMutation.isPending,
    isRestoring: restoreNoteMutation.isPending,
    isDeletingPermanently: deletePermanentlyMutation.isPending,
    isReordering: reorderNotesMutation.isPending,
  };
};
