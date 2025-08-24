"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Star,
  Clock,
  Save,
  CheckCircle2,
  Circle,
  Calendar,
  X,
} from "lucide-react";
import Editor from "./Editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNotes } from "@/hooks/useNotes";
import { useTags } from "@/hooks/useTags";
import { UpdateNoteFormData, updateNoteSchema } from "@/lib/schema";
import { useDebounce } from "@/hooks/useDebounce";
import type { Note, NotePriority, NoteStatus, Tag } from "@/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import TagInput from "./TagInput";

const statusConfig: Record<
  NoteStatus,
  { label: string; icon: React.ElementType; color: string; bgColor: string; }
> = {
  NOT_STARTED: { label: "Not started", icon: Circle, color: "text-gray-600 dark:text-gray-400", bgColor: "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700" },
  IN_PROGRESS: { label: "In progress", icon: Clock, color: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/50 dark:hover:bg-blue-800/50" },
  DONE: { label: "Done", icon: CheckCircle2, color: "text-green-600 dark:text-green-400", bgColor: "bg-green-100 hover:bg-green-200 dark:bg-green-900/50 dark:hover:bg-green-800/50" },
};

const priorityConfig: Record<NotePriority, { label: string; color: string; }> = {
  LOW: { label: "Low", color: "text-gray-600" },
  MEDIUM: { label: "Medium", color: "text-yellow-600" },
  HIGH: { label: "High", color: "text-red-600" },
};

interface NoteEditorProps {
  initialNote: Note;
}

export default function NoteEditor({ initialNote }: NoteEditorProps) {
  const { updateNote, isUpdating } = useNotes();
  const { tags: allTags } = useTags();
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessIndicator, setShowSuccessIndicator] = useState(false);
  const isMounted = useRef(false);

  const { register, control, watch, reset, getValues, setValue } =
    useForm<UpdateNoteFormData>({
      resolver: zodResolver(updateNoteSchema),
      defaultValues: {
        title: initialNote.title,
        content: initialNote.content || "",
        isFavorite: initialNote.isFavorite,
        status: initialNote.status,
        priority: initialNote.priority || "MEDIUM",
        tags: initialNote.tags?.map(t => t.id) || [],
      },
    });

  const watchedValues = watch();
  const debouncedValues = useDebounce(watchedValues, 2000);

  // FIX: Hapus useState untuk selectedTags, gunakan useMemo untuk mengambil data dari form
  const selectedTags = useMemo(() => {
    const tagIds = watchedValues.tags || [];
    return allTags.filter(tag => tagIds.includes(tag.id));
  }, [watchedValues.tags, allTags]);

  const getFormValuesFromNote = (note: Note): UpdateNoteFormData => ({
    title: note.title,
    content: note.content || "",
    isFavorite: note.isFavorite,
    status: note.status,
    priority: note.priority || "MEDIUM",
    tags: note.tags?.map(t => t.id) || [],
    dueDate: note.dueDate,
  });

  useEffect(() => {
    const formValues = getFormValuesFromNote(initialNote);
    reset(formValues);
    isMounted.current = false;
    const timer = setTimeout(() => { isMounted.current = true; }, 500);
    return () => clearTimeout(timer);
  }, [initialNote, reset]);

  useEffect(() => {
    if (!isMounted.current || isUpdating) return;
    setIsSaving(true);
    updateNote(initialNote.id, debouncedValues, {
      onSuccess: (updatedNote) => {
        const formValues = getFormValuesFromNote(updatedNote);
        reset(formValues);
        setIsSaving(false);
        setShowSuccessIndicator(true);
        setTimeout(() => setShowSuccessIndicator(false), 2000);
      },
      onError: () => setIsSaving(false),
    });
  }, [debouncedValues]);

  const handleInstantUpdate = (dataToUpdate: Partial<UpdateNoteFormData>) => {
    updateNote(initialNote.id, { ...getValues(), ...dataToUpdate }, {
      onSuccess: (updatedNote) => {
        const formValues = getFormValuesFromNote(updatedNote);
        reset(formValues);
      },
    });
  };

  const handleToggleFavorite = () => handleInstantUpdate({ isFavorite: !getValues("isFavorite") });
  const handleStatusChange = (status: NoteStatus) => handleInstantUpdate({ status });
  const handlePriorityChange = (priority: NotePriority) => handleInstantUpdate({ priority });
  
  // FIX: Sederhanakan handleTagsChange, hanya update form dan panggil save
  const handleTagsChange = (tagIds: string[]) => {
    setValue("tags", tagIds, { shouldDirty: true });
    handleInstantUpdate({ tags: tagIds });
  };
  
  const currentStatus = statusConfig[watchedValues.status || "NOT_STARTED"];
  const StatusIcon = currentStatus.icon;

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-shrink-0 px-8 py-6 border-b bg-card">
        <div className="space-y-4">
          <Input {...register("title")} className="text-3xl font-bold border-none p-0 h-auto focus-visible:ring-0 bg-transparent placeholder:text-muted-foreground" placeholder="Tanpa Judul" />
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className={cn("gap-2 h-8 px-3", currentStatus.bgColor)}>
                    <StatusIcon className={cn("h-3.5 w-3.5", currentStatus.color)} />
                    <span className={currentStatus.color}>{currentStatus.label}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {Object.entries(statusConfig).map(([status, config]) => (
                    <DropdownMenuItem key={status} onClick={() => handleStatusChange(status as NoteStatus)} className="gap-2">
                      <config.icon className={cn("h-4 w-4", config.color)} />
                      {config.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Controller
                control={control}
                name="priority"
                render={({ field }) => (
                  <Select value={field.value ?? "MEDIUM"} onValueChange={handlePriorityChange}>
                    <SelectTrigger className="w-32 h-8"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(priorityConfig).map(([priority, config]) => (
                        <SelectItem key={priority} value={priority}><span className={config.color}>{config.label}</span></SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <Controller
                control={control}
                name="dueDate"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2 h-8 px-3">
                        <Calendar className="h-3.5 w-3.5" />
                        {field.value ? format(new Date(field.value), "MMM dd") : "Tanggal"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent mode="single" selected={field.value ? new Date(field.value) : undefined} onSelect={(date) => handleInstantUpdate({ dueDate: date?.toISOString() })} initialFocus />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>
            <div className="flex items-center gap-2">
              {(isSaving || isUpdating) && <Badge variant="outline" className="gap-1.5 text-xs"><Save className="h-3 w-3 animate-spin" />Menyimpan...</Badge>}
              {showSuccessIndicator && <Badge variant="outline" className="gap-1.5 text-xs border-green-200 text-green-700 bg-green-50 dark:border-green-800 dark:text-green-400 dark:bg-green-950/20"><CheckCircle2 className="h-3 w-3" />Disimpan</Badge>}
              <Button variant="ghost" size="icon" onClick={handleToggleFavorite} className={cn("h-8 w-8 rounded-lg", watchedValues.isFavorite && "text-yellow-500 bg-yellow-500/10")}>
                <Star className={cn("h-4 w-4", watchedValues.isFavorite && "fill-current")} />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <TagInput
              selectedTags={selectedTags}
              onTagsChange={handleTagsChange}
            />
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {selectedTags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="secondary"
                    className="gap-1.5 text-xs px-2 py-1 border"
                    style={{
                      backgroundColor: `${tag.color}20`,
                      borderColor: `${tag.color}40`,
                      color: tag.color || undefined,
                    }}
                  >
                    {tag.name}
                    <button onClick={() => handleTagsChange(selectedTags.filter((t) => t.id !== tag.id).map((t) => t.id))} className="hover:bg-black/10 rounded-full p-0.5 -mr-1">
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <Editor content={field.value} onChange={field.onChange} />
          )}
        />
      </div>
    </div>
  );
}
