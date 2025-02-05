import { MediaItemWithOwner } from "hybrid-types/DBTypes";
import MediaRow from "../components/MediaRow";
import { useState } from "react";
import SingleView from "../components/SingleView";
import { useMedia } from "../hooks/apiHooks";

const Home = () => {
  const [selectedItem, setSelectedItem] = useState<
    MediaItemWithOwner | undefined
  >(undefined);

  const { mediaArray } = useMedia();

  console.log(mediaArray);
  return (
    <>
      {selectedItem && (
        <SingleView item={selectedItem} setSelectedItem={setSelectedItem} />
      )}
      <h2>My Media</h2>
      <table>
        <thead>
          <tr>
            <th>Thumbnail</th>
            <th>Title</th>
            <th>Description</th>
            <th>Created</th>
            <th>Size</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {mediaArray.map((item) => (
            <MediaRow
              key={item.media_id}
              item={item}
              setSelectedItem={setSelectedItem}
            />
          ))}
        </tbody>
      </table>
    </>
  );
};
export default Home;
