import { useState } from 'react';
import { useMedia } from '../hooks/apiHooks';
import { useUserContext } from '../hooks/ContextHooks';
import { MediaItemWithOwner } from 'hybrid-types/DBTypes';
import MediaRow from '../components/MediaRow';
import SingleView from '../components/SingleView';

const Posts = () => {
  const { user } = useUserContext();
  const { mediaArray, refreshMedia } = useMedia(user?.user_id);
  const [selectedItem, setSelectedItem] = useState<MediaItemWithOwner | undefined>(undefined);

  const refreshMediaHandler = () => {
    refreshMedia();
  };

  return (
    <div>
      {selectedItem && (
        <SingleView
          item={selectedItem}
          setSelectedItem={setSelectedItem}
          onDelete={refreshMediaHandler}
        />
      )}
      <h1>Posts</h1>
      <table className="m-auto w-full">
        <tbody className="grid grid-cols-1 justify-between sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {mediaArray.map((item) => (
            <MediaRow key={item.media_id} item={item} setSelectedItem={setSelectedItem} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Posts;
