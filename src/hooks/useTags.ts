import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { tagsApi } from "@/lib/api";
import type { Tag } from "@/types";

export const useTags = () => {
  const queryClient = useQueryClient();

  // Query untuk mengambil semua tag
  const { data: tags = [], isLoading } = useQuery<Tag[]>({
    queryKey: ["tags"],
    queryFn: tagsApi.getAll,
  });

  // Mutasi untuk membuat tag baru (tanpa efek samping di sini)
  const createTagMutation = useMutation({
    mutationFn: (data: { name: string; color: string }) => tagsApi.create(data),
  });

  // Mutasi untuk menghapus tag (tanpa efek samping di sini)
  const deleteTagMutation = useMutation({
    mutationFn: (id: string) => tagsApi.delete(id),
  });

  // Fungsi yang diekspor yang menangani logika efek samping
  const createTag = async (data: { name: string; color: string }) => {
    try {
      const newTag = await createTagMutation.mutateAsync(data);
      toast.success("Tag baru berhasil dibuat.");
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      return newTag;
    } catch (error) {
      toast.error("Gagal membuat tag.");
      // Lempar kembali error agar komponen bisa menangani jika perlu
      throw error;
    }
  };

  const deleteTag = (id: string) => {
    deleteTagMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Tag berhasil dihapus.");
        queryClient.invalidateQueries({ queryKey: ["tags"] });
      },
      onError: () => {
        toast.error("Gagal menghapus tag.");
      },
    });
  };

  return {
    tags,
    isLoading,
    createTag, // Fungsi async yang baru
    deleteTag, // Fungsi yang sekarang berisi callback
    isCreating: createTagMutation.isPending,
    isDeleting: deleteTagMutation.isPending,
  };
};
