import { useEffect, useState } from 'react';
import { useMedia } from '../hooks/apiHooks';
import { useUserContext } from '../hooks/ContextHooks';
import { MediaItemWithOwner } from 'hybrid-types/DBTypes';
import MediaRow from '../components/MediaRow';
import SingleView from '../components/SingleView';

const Posts = () => {
  const { user } = useUserContext();
  const { mediaArray, deleteMedia } = useMedia();
  const [posts, setPosts] = useState<MediaItemWithOwner[]>([]);
  const [selectedItem, setSelectedItem] = useState<MediaItemWithOwner | undefined>(undefined);

  useEffect(() => {
    if (user) {
      setPosts(mediaArray.filter((item) => item.username === user.username));
    }
  }, [mediaArray, user]);

  const handleDelete = async (media_id: number) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await deleteMedia(media_id, token);
        setPosts((prev) => prev.filter((item) => item.media_id !== media_id));
      } catch (error: any) {
        console.error(error.message);
      }
    }
  };

  return (
    <div>
      {selectedItem && <SingleView item={selectedItem} setSelectedItem={setSelectedItem} />}
      <h1>Posts</h1>
      <table className="m-auto w-full">
        <tbody className="grid grid-cols-1 justify-between sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {posts.map((item) => (
            <MediaRow
              key={item.media_id}
              item={item}
              setSelectedItem={setSelectedItem}
              onDelete={handleDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Posts;
