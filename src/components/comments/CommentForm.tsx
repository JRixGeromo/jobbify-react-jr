import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { TipTapEditor } from '../editor/TipTapEditor';

interface CommentFormProps {
  onSubmit: (content: string, images: string[]) => void;
  placeholder?: string;
  buttonText?: string;
}

export function CommentForm({
  onSubmit,
  buttonText = 'Comment',
}: CommentFormProps) {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      // Extract image URLs from the content
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      const images = Array.from(doc.querySelectorAll('img')).map(
        (img) => img.src
      );

      onSubmit(content, images);
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TipTapEditor content={content} onChange={setContent} />

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          <Send className="h-4 w-4 mr-2" />
          {buttonText}
        </button>
      </div>
    </form>
  );
}
