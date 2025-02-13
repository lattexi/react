import { MediaItemWithOwner } from 'hybrid-types/DBTypes';
import { Link } from 'react-router-dom';
import { useUserContext } from '../hooks/ContextHooks';
import Likes from './Likes';

type MediaItemProps = {
  item: MediaItemWithOwner;
  setSelectedItem: (item: MediaItemWithOwner | undefined) => void;
};

const MediaRow = (props: MediaItemProps) => {
  const { user } = useUserContext();
  const { item } = props;
  return (
    <tr className="flex w-64 flex-col">
      <td className="p-2">
        <img
          className="rounded-sm object-cover"
          src={item.thumbnail || (item.screenshots && item.screenshots[0]) || undefined}
          alt={item.title}
        />
      </td>
      <td className="p-2">{item.title}</td>
      <td className="p-2">{item.description}</td>
      <td className="p-2">{new Date(item.created_at).toLocaleString('fi-FI')}</td>
      <td className="p-2">{item.filesize}</td>
      <td className="p-2">{item.media_type}</td>
      <td className="p-2">{item.username}</td>
      <td>
        <p className="p-2">
          <Link
            className="w-full cursor-pointer rounded-sm bg-stone-900 p-4"
            to="/Single"
            state={{ item }}
          >
            Show
          </Link>
        </p>
      </td>
      {user && user.username === item.username && (
        <>
          <button
            onClick={() => {
              props.setSelectedItem(item);
            }}
            className="w-full cursor-pointer rounded-sm bg-stone-900 p-4"
          >
            Modify
          </button>
          <button className="w-full cursor-pointer rounded-sm bg-stone-900 p-4">Delete</button>
        </>
      )}
    </tr>
  );
};

export default MediaRow;
