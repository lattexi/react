import { MediaItemWithOwner } from 'hybrid-types/DBTypes';
import { useUserContext } from '../hooks/ContextHooks';
import { useForm } from '../hooks/formHooks';
import { useCommentStore } from '../hooks/storeHooks';
import { useEffect, useRef } from 'react';
import { useComment } from '../hooks/apiHooks';

const Comments = ({ item }: { item: MediaItemWithOwner }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { user } = useUserContext();
  const { comments, setComments } = useCommentStore();
  const { postComment, getCommentsByMediaId } = useComment();

  const initValues = { comment_text: '' };
  const doComment = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
    // TODO: add try-catch & user notification
    await postComment(inputs.comment_text, item.media_id, token);
    // update comments after post
    getComments();
    // reset form
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setInputs(initValues);
  };

  const { handleSubmit, handleInputChange, inputs, setInputs } = useForm(doComment, initValues);

  const getComments = async () => {
    try {
      const comments = await getCommentsByMediaId(item.media_id);
      setComments(comments);
    } catch (error) {
      setComments([]);
      console.error((error as Error).message);
    }
  };

  useEffect(() => {
    getComments();
  }, []);

  return (
    <>
      {user && (
        <form className="flex flex-col items-center justify-center" onSubmit={handleSubmit}>
          <div className="flex w-full flex-col">
            <label htmlFor="comment_text">Post a comment</label>
            <input
              className="my-2.5 rounded-md border p-2.5"
              name="comment_text"
              type="text"
              id="comment_text"
              onChange={handleInputChange}
              autoComplete="off"
              ref={inputRef}
            />
          </div>
          <button
            disabled={!inputs.comment_text}
            className="my-2.5 block w-full rounded-md bg-stone-500 p-2 text-center transition-all duration-500 ease-in-out hover:bg-stone-700"
            type="submit"
          >
            Post
          </button>
        </form>
      )}
      <h3>Comments</h3>
      {comments.length > 0 && (
        <ul>
          {comments.map((comment) => (
            <li key={comment.comment_id} className="my-2 rounded-md bg-stone-500 p-2">
              <p className="text-xs font-bold">
                {comment.username} ({new Date(comment.created_at || '').toLocaleString('fi-FI')}
                ):
              </p>
              <p>{comment.comment_text}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default Comments;
