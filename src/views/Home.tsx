import { MediaItemWithOwner } from 'hybrid-types/DBTypes';
import MediaRow from '../components/MediaRow';
import { useState } from 'react';
import SingleView from '../components/SingleView';
import { useMedia } from '../hooks/apiHooks';

const Home = () => {
  const [selectedItem, setSelectedItem] = useState<MediaItemWithOwner | undefined>(undefined);
  const { mediaArray, currentPage, hasNext, changePage, loading, refreshMedia } = useMedia();

  console.log(mediaArray);

  const refreshMediaHandler = () => {
    refreshMedia();
  };

  return (
    <>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <>
          {selectedItem && (
            <SingleView
              item={selectedItem}
              setSelectedItem={setSelectedItem}
              onDelete={refreshMediaHandler}
            />
          )}
          <h2>Feed</h2>
          <table className="m-auto w-full">
            <tbody className="grid grid-cols-1 justify-between sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {mediaArray.map((item) => (
                <MediaRow key={item.media_id} item={item} setSelectedItem={setSelectedItem} />
              ))}
            </tbody>
          </table>
          <div className="pagination my-4 flex justify-center gap-2">
            {currentPage > 1 && (
              <button
                className="rounded bg-stone-500 p-4 hover:bg-stone-700"
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Edellinen
              </button>
            )}
            {hasNext && (
              <button
                className="rounded bg-stone-500 p-4 hover:bg-stone-700"
                onClick={() => changePage(currentPage + 1)}
              >
                Seuraava
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
};
export default Home;
