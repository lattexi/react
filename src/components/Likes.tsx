import { Like, MediaItemWithOwner } from 'hybrid-types/DBTypes';
import { useEffect, useReducer } from 'react';
import { useLike } from '../hooks/apiHooks';
import { useUserContext } from '../hooks/ContextHooks';

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
  const { user } = useUserContext();

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
    const token = localStorage.getItem('token');
    if (!item || !token) {
      return;
    }

    if (likeState.userLike) {
      likeDispatch({ type: 'like', like: null });
      likeDispatch({ type: 'set_like_count', count: likeState.count - 1 });

      try {
        await deleteLike(likeState.userLike.like_id, token);
        getLikes();
      } catch (error) {
        getLikes();
        getLikeCount();
      }
    } else {
      likeDispatch({ type: 'like', like: { like_id: -1 } as Like });
      likeDispatch({ type: 'set_like_count', count: likeState.count + 1 });

      try {
        await postLike(item.media_id, token);
        getLikes();
      } catch (error) {
        getLikes();
        getLikeCount();
      }
    }
  };

  const HeartIcon = ({ className = '' }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`h-10 w-10 ${className}`}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
               2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 
               14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 
               6.86-8.55 11.54L12 21.35z"
      />
    </svg>
  );

  return (
    <div className="flex items-center">
      {user ? (
        <button
          className="cursor-pointer rounded-sm"
          onClick={() => {
            handleLike();
            console.log('likeState', likeState);
          }}
        >
          <HeartIcon className={likeState.userLike ? 'text-red-500' : 'text-white'} />
        </button>
      ) : (
        <HeartIcon className="text-white" />
      )}
      <p className="p-2 text-2xl">{likeState.count}</p>
    </div>
  );
};

export default Likes;
