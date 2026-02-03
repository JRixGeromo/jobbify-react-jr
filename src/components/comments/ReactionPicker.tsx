import React, { useState } from 'react';
import { Smile } from 'lucide-react';
import { Reaction } from '../../data/comments';

const AVAILABLE_REACTIONS = ['👍', '❤️', '😊', '🎉', '🔧', '✅', '❗', '👀'];

interface ReactionPickerProps {
  reactions: Reaction[];
  onReact: (emoji: string) => void;
}

export function ReactionPicker({ reactions, onReact }: ReactionPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div className="flex items-center gap-1">
        {reactions.map((reaction) => (
          <button
            key={reaction.emoji}
            onClick={() => onReact(reaction.emoji)}
            className={`px-2 py-1 rounded-full text-sm border ${
              reaction.users.includes('currentUser')
                ? 'bg-emerald-100 border-emerald-200'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span>{reaction.emoji}</span>
            <span className="ml-1">{reaction.count}</span>
          </button>
        ))}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 text-slate-400 hover:text-emerald-600 rounded-full hover:bg-emerald-50"
        >
          <Smile className="h-4 w-4" />
        </button>
      </div>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 p-2 bg-white rounded-lg shadow-lg border border-slate-200 flex gap-1">
          {AVAILABLE_REACTIONS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                onReact(emoji);
                setIsOpen(false);
              }}
              className="p-2 hover:bg-slate-100 rounded"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
