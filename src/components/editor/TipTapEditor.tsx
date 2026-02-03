import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
} from 'lucide-react';
import { validateUrl } from '../../utils/security';

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  editable?: boolean;
}

export function TipTapEditor({
  content,
  onChange,
  editable = true,
}: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    console.log('Content prop:', content);
  }, [content]);

  useEffect(() => {
    if (editor) {
      console.log('Editor initialized with content:', editor.getHTML());
    }
  }, [editor]);

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('Enter image URL');
    if (url && validateUrl(url)) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const url = window.prompt('Enter URL');
    if (url && validateUrl(url)) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const buttonClass = (isActive: boolean) =>
    `p-2 rounded ${
      isActive
        ? 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white'
        : 'hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
    }`;

  return (
    <div
      className={`border rounded-lg overflow-hidden ${
        document.documentElement.classList.contains('dark')
          ? 'border-gray-700 bg-gray-800 text-gray-100'
          : 'border-gray-300 bg-white text-gray-900'
      }`}
    >
      <div
        className={`flex flex-wrap gap-1 p-2 border-b ${
          document.documentElement.classList.contains('dark')
            ? 'border-gray-700 bg-gray-800'
            : 'border-gray-200 bg-gray-50'
        }`}
      >
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={buttonClass(editor.isActive('bold'))}
          type="button"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={buttonClass(editor.isActive('italic'))}
          type="button"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={buttonClass(editor.isActive('bulletList'))}
          type="button"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={buttonClass(editor.isActive('orderedList'))}
          type="button"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={buttonClass(editor.isActive('blockquote'))}
          type="button"
        >
          <Quote className="h-4 w-4" />
        </button>
        <button
          onClick={setLink}
          className={buttonClass(editor.isActive('link'))}
          type="button"
        >
          <LinkIcon className="h-4 w-4" />
        </button>
        <button onClick={addImage} className={buttonClass(false)} type="button">
          <ImageIcon className="h-4 w-4" />
        </button>
        <div className="flex-1" />
        <button
          onClick={() => editor.chain().focus().undo().run()}
          className={buttonClass(false)}
          type="button"
        >
          <Undo className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          className={buttonClass(false)}
          type="button"
        >
          <Redo className="h-4 w-4" />
        </button>
      </div>
      <EditorContent
        editor={editor}
        className={`p-4 min-h-[200px] ${
          document.documentElement.classList.contains('dark')
            ? 'bg-gray-800 text-gray-100'
            : 'bg-white text-gray-900'
        }`}
      />
    </div>
  );
}
