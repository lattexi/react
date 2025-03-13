import { MediaItemProps } from '../types/LocalTypes';

const MediaRow = (props: MediaItemProps) => {
  const { item, setSelectedItem } = props;

  return (
    <tr
      className="mx-auto my-2 flex w-full flex-col overflow-hidden rounded-lg transition-all duration-200 hover:cursor-pointer hover:bg-stone-700 sm:w-60"
      onClick={() => {
        setSelectedItem(item);
      }}
    >
      <td className="p-2">
        <img
          className="h-96 w-full rounded-sm object-cover sm:h-60 sm:w-60"
          src={item.thumbnail || (item.screenshots && item.screenshots[0]) || undefined}
          alt={item.title}
        />
      </td>
      <td className="overflow-hidden p-2 overflow-ellipsis whitespace-nowrap">{item.title}</td>
      <td className="overflow-hidden p-2 overflow-ellipsis whitespace-nowrap">
        {item.description}
      </td>
      <td className="overflow-hidden p-2 overflow-ellipsis whitespace-nowrap">
        {new Date(item.created_at).toLocaleString('fi-FI')}
      </td>
      <td className="overflow-hidden p-2 overflow-ellipsis whitespace-nowrap">{item.filesize}</td>
      <td className="overflow-hidden p-2 overflow-ellipsis whitespace-nowrap">{item.media_type}</td>
      <td className="overflow-hidden p-2 overflow-ellipsis whitespace-nowrap">{item.username}</td>
      <td className="p-2"></td>
    </tr>
  );
};

export default MediaRow;
