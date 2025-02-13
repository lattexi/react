import { MediaItemWithOwner } from 'hybrid-types/DBTypes';
import { useUserContext } from '../hooks/ContextHooks';
import { useCommentStore } from '../store';

const Comments = ({ item }: { item: MediaItemWithOwner }) => {
  const user = useUserContext();
  const { comments, addComment } = useCommentStore();

  const initValues = { comment_text = '' };
  const doComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const comment_text = formData.get('comment_text') as string;
    addComment({ comment_text, user_id: user.user_id, media_id: item.media_id });
  };

  return (
    <div>
      <h1>Comments</h1>
      {user && (
        <form>
          <div>
            <label htmlFor="commenttext">Comment</label>
            <input
              className="my-2 rounded-sm border border-stone-500 p-2"
              name="comment_text"
              type="text"
              id="commenttext"
              autoComplete="off"
            />
          </div>
          <button type="submit" className="my-2 cursor-pointer rounded-sm bg-stone-500 p-2">
            Comment
          </button>
        </form>
      )}
      {comments.length > 0 && (
        <ul>
          {comments.map((comment) => (
            <li key={comment.comment_id}>
              {comment.username} ({new Date(comment.created_at || '').toLocaleString('fi-FI')}):{' '}
              {comment.comment_text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Comments;
