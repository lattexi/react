import { Comment } from 'hybrid-types/DBTypes';
import { create } from 'zustand';

type CommentStore = {
  comments: Partial<Comment & { username: string }>[];
  setComments: (comments: Partial<Comment & { username: string }>[]) => void;
  addComment: (comment: Partial<Comment & { username: string }>) => void;
};

export const useCommentStore = create<CommentStore>((set) => ({
  comments: [],
  setComments: (comments) => set(() => ({ comments })),
  addComment: (comment) =>
    set((state) => ({
      comments: [
        ...state.comments,
        {
          comment_id: state.comments.length + 1,
          comment_text: comment.comment_text,
          user_id: comment.user_id,
          media_id: comment.media_id,
          created_at: new Date(),
          username: comment.username,
        },
      ],
    })),
}));
