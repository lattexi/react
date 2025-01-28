import { MediaItem } from 'hybrid-types/DBTypes';
import MediaRow from '../components/MediaRow';
import { useEffect, useState } from 'react';
import SingleView from '../components/SingleView';
import { fetchData } from '../lib/functions';

const Home = () => {
    const [selectedItem, setSelectedItem] = useState<MediaItem | undefined>(undefined);
    const [mediaArray, setMediaArray] = useState<MediaItem[]>([]);

    useEffect(() => {
        const getMedia = async () => {
            try {
                const json = await fetchData<MediaItem[]>('test.json');
                setMediaArray(json);
            } catch (e) { console.error((e as Error).message); }
        };
        getMedia();
    }, []);

    console.log(mediaArray);
    return (
        <>
            {selectedItem && <SingleView item={selectedItem} setSelectedItem={setSelectedItem} />}
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
                        <MediaRow key={item.media_id} item={item} setSelectedItem={setSelectedItem} />
                    ))}
                </tbody>
            </table>
        </>
    );
};
export default Home;