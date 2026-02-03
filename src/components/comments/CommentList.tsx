import React from 'react';
import { Comment } from '../../data/comments';
import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentForm';

interface CommentListProps {
  comments: Comment[];
  onAddComment: (content: string, images: string[]) => void;
  onAddReply: (commentId: string, content: string, images: string[]) => void;
  onReact: (commentId: string, emoji: string) => void;
  onReplyReact: (commentId: string, replyId: string, emoji: string) => void;
}

export function CommentList({
  comments,
  onAddComment,
  onAddReply,
  onReact,
  onReplyReact,
}: CommentListProps) {
  return (
    <div className="space-y-8">
      <CommentForm onSubmit={onAddComment} />

      <div className="space-y-8">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReply={onAddReply}
            onReact={onReact}
            onReplyReact={onReplyReact}
          />
        ))}
      </div>
    </div>
  );
}
