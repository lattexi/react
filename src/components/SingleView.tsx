import { useEffect, useState } from 'react';
import { SingleViewProps } from '../types/LocalTypes';
import { useUserContext } from '../hooks/ContextHooks';
import { useMedia } from '../hooks/apiHooks';
import Likes from './Likes';
import Comments from './Comments';
import { Link } from 'react-router-dom';
import { useForm } from '../hooks/formHooks';

const SingleView = (props: SingleViewProps) => {
  const { item, setSelectedItem, onDelete } = props;
  const { user } = useUserContext();
  const { deleteMedia, modifyMedia } = useMedia();

  const [saving, setSaving] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(item);

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
      } finally {
        onDelete();
      }
    }
  };

  const initValues = {
    title: currentItem.title,
    description: currentItem.description || '',
  };

  const doSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not authenticated');
      }
      // Lähetetään muutokset backendille käyttäen currentItem's media_id:tä ja formin arvoja
      await modifyMedia(currentItem.media_id, inputs, token);
      setCurrentItem({ ...currentItem, title: inputs.title, description: inputs.description });
      setIsEditing(false);
    } catch (e) {
      console.error((e as Error).message);
    } finally {
      setSaving(false);
      setIsEditing(false);
    }
  };

  const { handleSubmit, handleInputChange, inputs } = useForm(doSave, initValues);

  return (
    <>
      <dialog
        className="no-scrollbar fixed top-1/2 left-1/2 max-h-[90vh] w-11/12 -translate-x-1/2 -translate-y-1/2 transform overflow-y-auto rounded-2xl bg-stone-600 p-4 text-stone-50 shadow-lg md:w-3xl"
        open
      >
        {currentItem && (
          <>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="mt-4">
                <div className="my-2 flex flex-col">
                  <label htmlFor="title" className="mb-1">
                    Title
                  </label>
                  <input
                    name="title"
                    type="text"
                    id="title"
                    onChange={handleInputChange}
                    value={inputs.title}
                    className="my-2 rounded-sm border-2 border-stone-500 p-2"
                  />
                </div>
                <div className="my-2 flex flex-col">
                  <label htmlFor="description" className="mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={5}
                    id="description"
                    onChange={handleInputChange}
                    value={inputs.description}
                    className="my-2 rounded-sm border-2 border-stone-500 p-2"
                  ></textarea>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="mt-4 cursor-pointer rounded-sm bg-stone-500 p-2 text-2xl"
                    onClick={doSave}
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    className="mt-4 cursor-pointer rounded-sm bg-stone-800 p-2 text-2xl"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h2>{currentItem.title}</h2>
                <p>{currentItem.description}</p>
              </>
            )}

            <div className="py-4">
              {currentItem.media_type.startsWith('video') ? (
                <video
                  src={currentItem.filename}
                  controls
                  className="m-auto max-h-[70vh] rounded-2xl"
                ></video>
              ) : (
                <img
                  src={currentItem.filename}
                  alt={currentItem.title}
                  className="m-auto max-h-[70vh] rounded-2xl"
                />
              )}
            </div>
            <div className="flex justify-between align-middle">
              <div>
                <p className="text-xl">Uploaded by: {currentItem.username}</p>
                <p>{new Date(currentItem.created_at).toLocaleString('fi-FI')}</p>
                <p>{Math.round(currentItem.filesize / 1024)} KB</p>
              </div>
              <div className="flex gap-2">
                <button
                  className="h-3/4 cursor-pointer rounded-sm bg-stone-800 p-2"
                  onClick={() => {
                    setSelectedItem(undefined);
                  }}
                >
                  Close
                </button>
                <button className="h-3/4 cursor-pointer rounded-sm bg-stone-800 p-2">
                  <Link to="/Single" state={{ currentItem }}>
                    Show Full
                  </Link>
                </button>
                {user && user.username === currentItem.username && (
                  <>
                    <button
                      className="h-3/4 cursor-pointer rounded-sm bg-blue-500 p-2"
                      onClick={() => setIsEditing(true)}
                    >
                      Modify
                    </button>
                    <button
                      className="h-3/4 cursor-pointer rounded-sm bg-red-500 p-2"
                      onClick={() => handleDelete(currentItem.media_id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
              <div>
                <Likes item={currentItem} />
              </div>
            </div>
          </>
        )}
        <Comments item={currentItem} />
      </dialog>
    </>
  );
};

export default SingleView;
