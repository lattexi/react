import { MediaItemWithOwner } from 'hybrid-types/DBTypes';
import { useLocation } from 'react-router-dom';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import Likes from '../components/Likes';

const Single = () => {
  const { state } = useLocation();
  const item: MediaItemWithOwner = state.item;
  const navigate: NavigateFunction = useNavigate();
  return (
    <div className="flex flex-col items-center">
      <h1>{item.title}</h1>
      <p>{item.description}</p>
      <p>Size: {Math.round(item.filesize / 1024)} KB</p>{' '}
      <p>Created at: {new Date(item.created_at).toLocaleString('fi-FI')}</p>
      <div className="py-4">
        {item.media_type.startsWith('video') ? (
          <video src={item.filename} controls className="h-screen"></video>
        ) : (
          <img src={item.filename} alt={item.title} className="h-screen" />
        )}
        <div className="flex flex-row justify-between py-4">
          <div>
            <p>Uploaded by: {item.username}</p>
            <p>Media type: {item.media_type}</p>
            <p>File size: {item.filesize}</p>
          </div>
          <button
            className="cursor-pointer rounded-sm bg-stone-700 p-4"
            onClick={() => navigate(-1)}
          >
            Go back
          </button>
          <Likes item={item} />
        </div>
      </div>
    </div>
  );
};

export default Single;
