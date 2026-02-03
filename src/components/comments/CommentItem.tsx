import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Reply } from 'lucide-react';
import { Comment, Reply as ReplyType } from '../../data/comments';
import { CommentForm } from './CommentForm';
import { ReactionPicker } from './ReactionPicker';
import { TipTapEditor } from '../editor/TipTapEditor';

interface CommentItemProps {
  comment: Comment;
  onReply: (commentId: string, content: string, images: string[]) => void;
  onReact: (commentId: string, emoji: string) => void;
  onReplyReact: (commentId: string, replyId: string, emoji: string) => void;
}

export function CommentItem({
  comment,
  onReply,
  onReact,
  onReplyReact,
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);

  const handleReply = (content: string, images: string[]) => {
    onReply(comment.id, content, images);
    setIsReplying(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <img
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop"
          alt="User avatar"
          className="w-8 h-8 rounded-full"
        />
        <div className="flex-1">
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="font-medium text-slate-800">John Doe</span>
                <span className="text-sm text-slate-500 ml-2">
                  {formatDistanceToNow(new Date(comment.timestamp), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="p-1 text-slate-400 hover:text-emerald-600 rounded-full hover:bg-emerald-50"
              >
                <Reply className="h-4 w-4" />
              </button>
            </div>
            <div className="mb-4">
              <TipTapEditor
                content={comment.content}
                onChange={() => {}}
                editable={false}
              />
            </div>
            <ReactionPicker
              reactions={comment.reactions}
              onReact={(emoji) => onReact(comment.id, emoji)}
            />
          </div>

          {/* Replies */}
          <div className="mt-4 space-y-4 pl-8">
            {comment.replies.map((reply) => (
              <ReplyItem
                key={reply.id}
                reply={reply}
                onReact={(emoji) => onReplyReact(comment.id, reply.id, emoji)}
              />
            ))}
          </div>

          {isReplying && (
            <div className="mt-4 pl-8">
              <CommentForm onSubmit={handleReply} buttonText="Reply" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ReplyItemProps {
  reply: ReplyType;
  onReact: (emoji: string) => void;
}

function ReplyItem({ reply, onReact }: ReplyItemProps) {
  return (
    <div className="flex gap-4">
      <img
        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop"
        alt="User avatar"
        className="w-8 h-8 rounded-full"
      />
      <div className="flex-1">
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="font-medium text-slate-800">Jane Smith</span>
              <span className="text-sm text-slate-500 ml-2">
                {formatDistanceToNow(new Date(reply.timestamp), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
          <div className="mb-4">
            <TipTapEditor
              content={reply.content}
              onChange={() => {}}
              editable={false}
            />
          </div>
          <ReactionPicker reactions={reply.reactions} onReact={onReact} />
        </div>
      </div>
    </div>
  );
}
