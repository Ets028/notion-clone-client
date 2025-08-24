"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo,
  Redo,
  Type,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Modern Floating Toolbar Component
const Toolbar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const textStyles = [
    { label: "Text", action: () => editor.chain().focus().setParagraph().run(), active: editor.isActive("paragraph") },
    { label: "Heading 1", action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive("heading", { level: 1 }) },
    { label: "Heading 2", action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }) },
    { label: "Heading 3", action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive("heading", { level: 3 }) },
  ];

  return (
    <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 px-6 py-3">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Text Style Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 h-8 px-3 hover:bg-gray-100 dark:hover:bg-gray-800">
              <Type className="h-4 w-4" />
              <span className="hidden sm:inline">
                {textStyles.find(style => style.active)?.label || "Text"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {textStyles.map((style) => (
              <DropdownMenuItem
                key={style.label}
                onClick={style.action}
                className={cn(style.active && "bg-blue-50 dark:bg-blue-950/20")}
              >
                {style.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-6" />

        {/* Formatting Tools */}
        <div className="flex items-center gap-1">
          <Toggle
            size="sm"
            pressed={editor.isActive("bold")}
            onPressedChange={() => editor.chain().focus().toggleBold().run()}
            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 data-[state=on]:bg-blue-100 dark:data-[state=on]:bg-blue-900/30 data-[state=on]:text-blue-600 dark:data-[state=on]:text-blue-400"
          >
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("italic")}
            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 data-[state=on]:bg-blue-100 dark:data-[state=on]:bg-blue-900/30 data-[state=on]:text-blue-600 dark:data-[state=on]:text-blue-400"
          >
            <Italic className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("strike")}
            onPressedChange={() => editor.chain().focus().toggleStrike().run()}
            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 data-[state=on]:bg-blue-100 dark:data-[state=on]:bg-blue-900/30 data-[state=on]:text-blue-600 dark:data-[state=on]:text-blue-400"
          >
            <Strikethrough className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("code")}
            onPressedChange={() => editor.chain().focus().toggleCode().run()}
            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 data-[state=on]:bg-blue-100 dark:data-[state=on]:bg-blue-900/30 data-[state=on]:text-blue-600 dark:data-[state=on]:text-blue-400"
          >
            <Code className="h-4 w-4" />
          </Toggle>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Lists and Blocks */}
        <div className="flex items-center gap-1">
          <Toggle
            size="sm"
            pressed={editor.isActive("bulletList")}
            onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 data-[state=on]:bg-blue-100 dark:data-[state=on]:bg-blue-900/30 data-[state=on]:text-blue-600 dark:data-[state=on]:text-blue-400"
          >
            <List className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("orderedList")}
            onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 data-[state=on]:bg-blue-100 dark:data-[state=on]:bg-blue-900/30 data-[state=on]:text-blue-600 dark:data-[state=on]:text-blue-400"
          >
            <ListOrdered className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("blockquote")}
            onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 data-[state=on]:bg-blue-100 dark:data-[state=on]:bg-blue-900/30 data-[state=on]:text-blue-600 dark:data-[state=on]:text-blue-400"
          >
            <Quote className="h-4 w-4" />
          </Toggle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Main Editor Component
interface EditorProps {
  content: any;
  onChange: (contentAsJson: any) => void;
  placeholder?: string;
}

export default function Editor({ 
  content, 
  onChange, 
  placeholder = "Start writing..." 
}: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc list-inside",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal list-inside",
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: "border-l-4 border-gray-300 dark:border-gray-600 pl-6 italic text-gray-700 dark:text-gray-300",
          },
        },
        code: {
          HTMLAttributes: {
            class: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-sm",
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-4 rounded-lg my-4 overflow-x-auto",
          },
        },
      }),
    ],
    content: content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn(
          "prose dark:prose-invert max-w-full focus:outline-none",
          "prose-lg prose-gray dark:prose-gray",
          "prose-headings:font-semibold prose-headings:text-gray-900 dark:prose-headings:text-gray-100",
          "prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-7",
          "prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline",
          "prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-strong:font-semibold",
          "prose-code:text-gray-800 dark:prose-code:text-gray-200",
          "prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800",
          "prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600",
          "prose-hr:border-gray-200 dark:prose-hr:border-gray-700",
          "min-h-[400px] px-8 py-6"
        ),
        spellcheck: "false",
      },
      handleDOMEvents: {
        keydown: (view, event) => {
          // Handle keyboard shortcuts
          if (event.key === 'Tab') {
            event.preventDefault();
            return false;
          }
        },
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
  });

  // Add placeholder when editor is empty
  const isEmpty = editor?.isEmpty ?? true;

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      <Toolbar editor={editor} />
      
      <div className="flex-1 overflow-y-auto relative">
        {/* Placeholder */}
        {isEmpty && (
          <div className="absolute top-6 left-8 text-gray-400 dark:text-gray-500 text-lg pointer-events-none">
            {placeholder}
          </div>
        )}
        
        {/* Editor Content */}
        <EditorContent 
          editor={editor} 
          className="h-full [&_.ProseMirror]:min-h-full [&_.ProseMirror]:outline-none"
        />
      </div>
      
      {/* Footer with word count */}
      {editor && (
        <div className="border-t border-gray-200 dark:border-gray-800 px-8 py-2 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
            <div className="flex gap-4">
              <span>{editor.storage.characterCount?.characters() || 0} characters</span>
              <span>{editor.storage.characterCount?.words() || 0} words</span>
            </div>
            <span>Press "/" for commands</span>
          </div>
        </div>
      )}
    </div>
  );
}