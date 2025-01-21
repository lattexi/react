import { MediaItem } from 'hybrid-types';

const MediaRow = (props: { item: MediaItem; }) => {
    const { item } = props;
    return (
        <tr key={item.media_id}>
            <td>
                <img src={item.thumbnail || undefined} alt={item.title} />
            </td>
            <td>{item.title}</td>
            <td>{item.description}</td>
            <td>{new Date(item.created_at).toLocaleString('fi-FI')}</td>
            <td>{item.filesize}</td>
            <td>{item.media_type}</td>
        </tr>);
};

export default MediaRow;