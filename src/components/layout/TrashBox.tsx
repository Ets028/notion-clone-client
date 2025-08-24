'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Trash2, FileText, RotateCw, Trash } from 'lucide-react';
import { useNotes } from '@/hooks/useNotes';
import { ScrollArea } from '../ui/scroll-area';

export function TrashBox() {
  const { archivedNotes, restoreNote, deletePermanently } = useNotes();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start gap-2.5 h-8 px-2 hover:bg-sidebar-accent transition-colors text-sidebar-foreground"
        >
          <Trash2 className="h-3.5 w-3.5 text-sidebar-foreground/70" />
          <span className="text-sm">Sampah</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start" sideOffset={8}>
        <div className="p-4 border-b border-border/50">
          <h4 className="font-medium text-sm leading-none">Sampah</h4>
          <p className="text-xs text-muted-foreground mt-1">
            Catatan yang dihapus akan muncul di sini.
          </p>
        </div>
        <ScrollArea className="max-h-[300px]">
          {archivedNotes.length === 0 ? (
            <div className="p-6 text-center">
              <Trash2 className="h-8 w-8 mx-auto text-sidebar-foreground/30 mb-3" />
              <p className="text-sm text-sidebar-foreground/60">
                Tidak ada item di sampah.
              </p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {archivedNotes.map((note) => (
                <div 
                  key={note.id} 
                  className="group flex items-center justify-between hover:bg-sidebar-accent/70 rounded-md transition-colors"
                >
                  <div className="flex items-center gap-2.5 p-2.5 flex-1 min-w-0">
                    <FileText className="h-3.5 w-3.5 text-sidebar-foreground/70 flex-shrink-0" />
                    <span className="text-sm truncate text-sidebar-foreground">{note.title}</span>
                  </div>
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity pr-2 gap-0.5">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 hover:bg-sidebar-accent" 
                      onClick={() => restoreNote(note.id)}
                      title="Pulihkan"
                    >
                      <RotateCw className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 hover:text-destructive hover:bg-destructive/10" 
                      onClick={() => deletePermanently(note.id)}
                      title="Hapus permanen"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}