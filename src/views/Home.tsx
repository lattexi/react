import { MediaItemWithOwner } from 'hybrid-types/DBTypes';
import MediaRow from '../components/MediaRow';
import { useState } from 'react';
import SingleView from '../components/SingleView';
import { useMedia } from '../hooks/apiHooks';

const Home = () => {
  const [selectedItem, setSelectedItem] = useState<MediaItemWithOwner | undefined>(undefined);
  const { mediaArray } = useMedia();

  console.log(mediaArray);
  return (
    <>
      {selectedItem && <SingleView item={selectedItem} setSelectedItem={setSelectedItem} />}
      <h2>Feed</h2>
      <table className="m-auto w-full">
        <tbody className="grid grid-cols-1 justify-between sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {mediaArray.map((item) => (
            <MediaRow key={item.media_id} item={item} setSelectedItem={setSelectedItem} />
          ))}
        </tbody>
      </table>
    </>
  );
};
export default Home;
