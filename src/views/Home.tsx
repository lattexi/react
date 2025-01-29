import {
  MediaItem,
  MediaItemWithOwner,
  UserWithLevel,
  UserWithNoPassword,
} from "hybrid-types/DBTypes";
import MediaRow from "../components/MediaRow";
import { useEffect, useState } from "react";
import SingleView from "../components/SingleView";
import { fetchData } from "../lib/functions";

const Home = () => {
  const [selectedItem, setSelectedItem] = useState<
    MediaItemWithOwner | undefined
  >(undefined);
  const [mediaArray, setMediaArray] = useState<MediaItemWithOwner[]>([]);

  useEffect(() => {
    const getMedia = async () => {
      try {
        const media = await fetchData<MediaItem[]>(
          import.meta.env.VITE_MEDIA_API + "/media",
        );
        const mediaWithOwner: MediaItemWithOwner[] = await Promise.all(
          media.map(async (item) => {
            const owner = await fetchData<UserWithNoPassword>(
              import.meta.env.VITE_AUTH_API + "/users/" + item.user_id,
            );

            const mediaItem: MediaItemWithOwner = {
              ...item,
              username: owner.username,
            };

            if (
              mediaItem.screenshots &&
              typeof mediaItem.screenshots === "string"
            ) {
              mediaItem.screenshots = JSON.parse(mediaItem.screenshots).map(
                (screenshot: string) => {
                  return import.meta.env.VITE_FILE_URL + screenshot;
                },
              );
            }
            return mediaItem;
          }),
        );
        setMediaArray(mediaWithOwner);
      } catch (e) {
        console.error((e as Error).message);
      }
    };
    getMedia();
  }, []);

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
