export interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface Comment {
  id: string;
  jobId: string;
  userId: string;
  content: string;
  images: string[];
  timestamp: string;
  reactions: Reaction[];
  replies: Reply[];
}

export interface Reply {
  id: string;
  commentId: string;
  userId: string;
  content: string;
  images: string[];
  timestamp: string;
  reactions: Reaction[];
}

export const comments: Comment[] = [
  {
    id: '1',
    jobId: '1',
    userId: 'tech1',
    content:
      'Completed initial inspection. Found significant water damage under sink.',
    images: [
      'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&auto=format&fit=crop',
    ],
    timestamp: '2024-03-15T10:30:00Z',
    reactions: [
      { emoji: '👍', count: 2, users: ['admin1', 'tech2'] },
      { emoji: '🔧', count: 1, users: ['tech3'] },
    ],
    replies: [
      {
        id: 'r1',
        commentId: '1',
        userId: 'admin1',
        content: 'Good catch. Please proceed with the replacement.',
        images: [],
        timestamp: '2024-03-15T10:45:00Z',
        reactions: [{ emoji: '✅', count: 1, users: ['tech1'] }],
      },
    ],
  },
];
