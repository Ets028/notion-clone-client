'use client';

import { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Filter, X } from 'lucide-react';
import { useNotesStore } from '@/store/notesStore';
import { useTags } from '@/hooks/useTags';
import type { NoteStatus, NotePriority } from '@/types';
import { ScrollArea } from '../ui/scroll-area';

// Hook sederhana untuk mendeteksi ukuran layar
function useMediaQuery(query: string) {
  const [value, setValue] = useState(false);

  useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches);
    }

    const result = matchMedia(query);
    result.addEventListener("change", onChange);
    setValue(result.matches);

    return () => result.removeEventListener("change", onChange);
  }, [query]);

  return value;
}


const STATUSES: NoteStatus[] = ['NOT_STARTED', 'IN_PROGRESS', 'DONE'];
const PRIORITIES: NotePriority[] = ['LOW', 'MEDIUM', 'HIGH'];

// Konten filter yang bisa digunakan kembali
function FilterContent() {
  const { filters, setFilters, clearFilters } = useNotesStore();
  const { tags } = useTags();

  const activeFilterCount = 
    (filters.status ? 1 : 0) + 
    (filters.priority ? 1 : 0) + 
    (filters.tags?.length || 0);

  const handleTagToggle = (tagId: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter(id => id !== tagId)
      : [...currentTags, tagId];
    setFilters({ tags: newTags });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex items-center justify-between border-b flex-shrink-0">
        <h4 className="font-semibold">Filter Catatan</h4>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs h-auto p-1">
            <X className="h-3 w-3 mr-1" /> Hapus Filter
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4">
          <h5 className="text-xs font-semibold text-muted-foreground mb-2">STATUS</h5>
          <div className="flex flex-col gap-1">
            {STATUSES.map(status => (
              <Button key={status} variant={filters.status === status ? 'secondary' : 'ghost'} size="sm" className="w-full justify-start" onClick={() => setFilters({ status: filters.status === status ? null : status })}>
                {status.replace('_', ' ')}
              </Button>
            ))}
          </div>
        </div>
        <Separator />
        <div className="p-4">
          <h5 className="text-xs font-semibold text-muted-foreground mb-2">PRIORITAS</h5>
          <div className="flex flex-row gap-1">
            {PRIORITIES.map(priority => (
              <Button key={priority} variant={filters.priority === priority ? 'secondary' : 'ghost'} size="sm" className="w-full" onClick={() => setFilters({ priority: filters.priority === priority ? null : priority })}>
                {priority}
              </Button>
            ))}
          </div>
        </div>
        {tags.length > 0 && (
          <>
            <Separator />
            <div className="p-4">
              <h5 className="text-xs font-semibold text-muted-foreground mb-2">TAGS</h5>
              <div className="space-y-2">
                {tags.map(tag => (
                  <div key={tag.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag-filter-${tag.id}`}
                      checked={filters.tags?.includes(tag.id)}
                      onCheckedChange={() => handleTagToggle(tag.id)}
                    />
                    <label htmlFor={`tag-filter-${tag.id}`} className="text-sm font-medium leading-none">
                      {tag.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </ScrollArea>
    </div>
  );
}

export function FilterPopover() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { filters } = useNotesStore();

  const activeFilterCount = 
    (filters.status ? 1 : 0) + 
    (filters.priority ? 1 : 0) + 
    (filters.tags?.length || 0);

  const TriggerButton = (
    <Button variant="ghost" size="sm" className="w-full justify-start gap-3 h-9 px-3">
      <Filter className="h-4 w-4" />
      <span>Filter</span>
      {activeFilterCount > 0 && (
        <Badge variant="secondary" className="ml-auto">{activeFilterCount}</Badge>
      )}
    </Button>
  );

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {TriggerButton}
        </PopoverTrigger>
        {/* FIX: Atur lebar dan tinggi maksimum di sini */}
        <PopoverContent className="w-60 p-0 max-h-[450px] flex flex-col" align="start">
          <FilterContent />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {TriggerButton}
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted my-4" />
        <div className="max-h-[60vh]">
          <FilterContent />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
