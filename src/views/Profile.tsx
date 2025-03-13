import { ChangeEvent, useEffect, useState } from 'react';
import Posts from '../components/Posts';
import { useFile, useMedia, useTags } from '../hooks/apiHooks';
import { useUserContext } from '../hooks/ContextHooks';
import { MediaItemWithOwner } from 'hybrid-types/DBTypes';

const Profile = () => {
  const { user } = useUserContext();
  const { postMedia } = useMedia();
  const { postTag, deleteTag, getTagsByMediaId, getAllTags, getMediaByTag } = useTags();
  const { postFile } = useFile();
  const [uploading, setUploading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [profilePic, setProfilePic] = useState<MediaItemWithOwner | null>(null);

  if (!user) {
    return <h1>Not logged in</h1>;
  }

  const inputs = {
    title: user.username,
    description: 'Profile picture of ' + user.username,
  };

  const handleFileChange = (evt: ChangeEvent<HTMLInputElement>) => {
    if (evt.target.files) {
      setFile(evt.target.files[0]);
    }
  };

  const uploadProfilePicture = async (file: File) => {
    setUploading(true);
    const token = localStorage.getItem('token');
    if (!token || !file) {
      throw new Error('No token found or no file selected');
    }
    try {
      const allTagsResult = await getAllTags();
      const userTag = allTagsResult.find((tag) => tag.tag_name === user.username);
      if (!userTag) {
        throw new Error('User tag not found');
      }
      const profilepic = await getMediaByTag(userTag.tag_id);
      const profilepicTags = await getTagsByMediaId(profilepic[0].media_id);

      if (profilepicTags.length > 0) {
        await deleteTag(profilepicTags[0].tag_id, token);
      }
    } catch (e) {
      console.error((e as Error).message);
    } finally {
      setUploading(false);
    }
    try {
      const fileResult = await postFile(file, token);
      const mediaResult = await postMedia(fileResult, inputs, token);
      console.log('mediaResult', mediaResult);
      const tagResult = await postTag(mediaResult.media.media_id, user.username, token);
      console.log('tagResult', tagResult);
    } catch (e) {
      console.error((e as Error).message);
    } finally {
      setUploading(false);
    }
    await getProfilePic();
  };

  const getProfilePic = async () => {
    const allTagsResult = await getAllTags();
    const userTag = allTagsResult.find((tag) => tag.tag_name === user.username);
    if (!userTag) {
      throw new Error('User tag not found');
    }
    const profilepic = await getMediaByTag(userTag.tag_id);
    console.log('profilepic', profilepic);
    setProfilePic(profilepic[0]);
  };

  useEffect(() => {
    getProfilePic();
  }, []);

  return (
    <div>
      <h1>Profile</h1>
      <div className="flex flex-row md:flex-row">
        <div className="flex flex-col items-center p-4">
          {profilePic ? (
            <img
              src={'https://upload.latexi.dev/uploads/' + profilePic.filename}
              alt="Profile"
              className="h-32 w-32 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gray-300">
              No Profile Picture
            </div>
          )}
          <div className="mt-4">
            <input
              type="file"
              accept="image/*, video/*"
              onChange={handleFileChange}
              className="w-20 border border-gray-400 p-2"
            />
            <button
              onClick={() => file && uploadProfilePicture(file)}
              disabled={uploading}
              className="ml-2 rounded bg-blue-500 p-2 text-white"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>
        {user && (
          <div className="flex flex-col gap-4 p-8">
            <p>{user.username}</p>
            <p>{user.email}</p>
            <p>{user.level_name}</p>
            <p>{new Date(user.created_at).toLocaleString('fi-FI')}</p>
          </div>
        )}
      </div>
      <Posts />
    </div>
  );
};

export default Profile;
