"use client";

import { useState, useMemo } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { PlusCircle } from "lucide-react";
import { useTags } from "@/hooks/useTags";
import type { Tag } from "@/types";

interface TagInputProps {
  selectedTags: Tag[];
  onTagsChange: (updatedTagIds: string[]) => void;
}

const COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#14b8a6",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#d946ef",
];

export default function TagInput({
  selectedTags,
  onTagsChange,
}: TagInputProps) {
  const { tags, createTag } = useTags();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedTagIds = useMemo(
    () => new Set(selectedTags.map((t) => t.id)),
    [selectedTags]
  );

  const handleSelectTag = (tagId: string) => {
    const newSelectedIds = new Set(selectedTagIds);
    if (newSelectedIds.has(tagId)) {
      newSelectedIds.delete(tagId);
    } else {
      newSelectedIds.add(tagId);
    }
    onTagsChange(Array.from(newSelectedIds));
  };

  const handleCreateTag = async () => {
    if (search.trim() === "") return;
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    try {
      const newTag = await createTag({ name: search, color: randomColor });
      handleSelectTag(newTag.id);
      setSearch("");
    } catch (e) {
      // Error sudah ditangani oleh toast di useTags hook
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-auto py-1 px-2 text-muted-foreground hover:text-foreground"
        >
          <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
          Tambah Tag
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Cari atau buat tag..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>
              <Button
                variant="ghost"
                className="w-full justify-start text-left h-auto py-2 px-2"
                onClick={handleCreateTag}
              >
                Buat tag baru: "{search}"
              </Button>
            </CommandEmpty>
            <CommandGroup>
              {tags.map((tag) => (
                <CommandItem
                  key={tag.id}
                  onSelect={() => handleSelectTag(tag.id)}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <span
                      className="h-2 w-2 rounded-full mr-2"
                      style={{ backgroundColor: tag.color }}
                    />
                    {tag.name}
                  </div>
                  {selectedTagIds.has(tag.id) && (
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
