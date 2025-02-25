import { useEffect } from 'react';
import { MediaItemProps } from '../types/LocalTypes';
import { useUserContext } from '../hooks/ContextHooks';
import { useMedia } from '../hooks/apiHooks';
import Likes from './Likes';
import Comments from './Comments';
import { Link } from 'react-router-dom';

const SingleView = (props: MediaItemProps) => {
  const { item, setSelectedItem } = props;
  const { user } = useUserContext();
  const { deleteMedia } = useMedia();

  useEffect(() => {
    // Disable body scroll when the component mounts
    document.body.style.overflow = 'hidden';
    return () => {
      // Enable body scroll when the component unmounts
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleDelete = async (media_id: number) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await deleteMedia(media_id, token);
        setSelectedItem(undefined);
      } catch (error: any) {
        console.error(error.message);
      }
    }
  };

  return (
    <>
      <dialog
        className="no-scrollbar fixed top-1/2 left-1/2 max-h-[90vh] w-11/12 -translate-x-1/2 -translate-y-1/2 transform overflow-y-auto rounded-2xl bg-stone-600 p-4 text-stone-50 shadow-lg md:w-3xl"
        open
      >
        {item && (
          <>
            <h2>{item.title}</h2>
            <p>{item.description}</p>

            <div className="py-4">
              {item.media_type.startsWith('video') ? (
                <video src={item.filename} controls className=""></video>
              ) : (
                <img src={item.filename} alt={item.title} className="" />
              )}
            </div>
            <div className="flex justify-between">
              <div>
                <p className="text-xl">Uploaded by: {item.username}</p>
                <p>{new Date(item.created_at).toLocaleString('fi-FI')}</p>
                <p>{Math.round(item.filesize / 1024)} KB</p>
              </div>
              <div>
                <Likes item={item} />
              </div>
            </div>
            <button
              className="mr-2 cursor-pointer rounded-sm bg-stone-800 p-4"
              onClick={() => setSelectedItem(undefined)}
            >
              Close
            </button>
            <p className="w-fit cursor-pointer rounded-sm bg-stone-800 p-4">
              <Link to="/Single" state={{ item }}>
                Show
              </Link>
            </p>
            {user && user.username === item.username && (
              <>
                <button className="mr-2 cursor-pointer rounded-sm bg-stone-800 p-4">Modify</button>
                <button
                  className="mr-2 cursor-pointer rounded-sm bg-stone-800 p-4"
                  onClick={() => handleDelete(item.media_id)}
                >
                  Delete
                </button>
              </>
            )}
          </>
        )}
        <Comments item={item} />
      </dialog>
    </>
  );
};

export default SingleView;
