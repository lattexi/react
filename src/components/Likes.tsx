import { Like, MediaItemWithOwner } from 'hybrid-types/DBTypes';
import { useEffect, useReducer } from 'react';
import { useLike } from '../hooks/apiHooks';

type LikeState = {
  count: number;
  userLike: Like | null;
};

type LikeAction = {
  type: 'set_like_count' | 'like';
  like?: Like | null;
  count?: number;
};

const likeInitialState: LikeState = {
  count: 0,
  userLike: null,
};

const likeReducer = (state: LikeState, action: LikeAction): LikeState => {
  switch (action.type) {
    case 'set_like_count':
      return { ...state, count: action.count ?? 0 };
    case 'like':
      return { ...state, userLike: action.like ?? null };
    default:
      return state;
  }
};

const Likes = ({ item }: { item: MediaItemWithOwner }) => {
  const [likeState, likeDispatch] = useReducer(likeReducer, likeInitialState);
  const { postLike, deleteLike, getCountByMediaId, getUserLike } = useLike();

  const getLikes = async () => {
    const token = localStorage.getItem('token');
    if (!item || !token) {
      return;
    }
    try {
      const userLike = await getUserLike(item.media_id, token);
      likeDispatch({ type: 'like', like: userLike });
    } catch (e) {
      likeDispatch({ type: 'like', like: null });
      console.error('get user like error', (e as Error).message);
    }
  };

  const getLikeCount = async () => {
    try {
      const countResponse = await getCountByMediaId(item.media_id);
      console.log(countResponse);
      likeDispatch({ type: 'set_like_count', count: countResponse.count });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getLikes();
    getLikeCount();
  }, [item]);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!item || !token) {
        return;
      }
      // If user has liked the media, delete the like. Otherwise, post the like.
      if (likeState.userLike) {
        // delete the like and dispatch the new like count to the state. Dispatching is already done in the getLikes and getLikeCount functions.
        await deleteLike(likeState.userLike.like_id, token);
        // optionally use getLikes() & getLikeCount() here to update all likes from db
        likeDispatch({ type: 'like', like: null });
        likeDispatch({ type: 'set_like_count', count: likeState.count - 1 });
      } else {
        // post the like and dispatch the new like count to the state. Dispatching is already done in the getLikes and getLikeCount functions.
        await postLike(item.media_id, token);
        getLikes();
        getLikeCount();
      }
    } catch (e) {
      console.log('like error', (e as Error).message);
    }
  };

  return (
    <>
      <p>Likes: {likeState.count}</p>
      <button
        className="cursor-pointer rounded-sm bg-blue-600 p-2"
        onClick={() => {
          handleLike();
          console.log('likeState', likeState);
        }}
      >
        {likeState.userLike ? 'Unlike' : 'Like'}
      </button>
    </>
  );
};

export default Likes;
