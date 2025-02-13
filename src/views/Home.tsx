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
      <h2>My Media</h2>
      <table>
        <tbody className="grid grid-cols-4 gap-4">
          {mediaArray.map((item) => (
            <MediaRow key={item.media_id} item={item} setSelectedItem={setSelectedItem} />
          ))}
        </tbody>
      </table>
    </>
  );
};
export default Home;
