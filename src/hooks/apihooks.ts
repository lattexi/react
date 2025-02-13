import { Like, MediaItem, MediaItemWithOwner, UserWithNoPassword } from 'hybrid-types/DBTypes';
import { useEffect, useState } from 'react';
import { fetchData } from '../lib/functions';
import { Credentials, RegisterCredentials } from '../types/LocalTypes';
import {
  AvailableResponse,
  LoginResponse,
  MessageResponse,
  UploadResponse,
  UserResponse,
} from 'hybrid-types/MessageTypes';

const useMedia = () => {
  const [mediaArray, setMediaArray] = useState<MediaItemWithOwner[]>([]);

  useEffect(() => {
    const getMedia = async () => {
      try {
        const media = await fetchData<MediaItem[]>(import.meta.env.VITE_MEDIA_API + '/media');
        const mediaWithOwner: MediaItemWithOwner[] = await Promise.all(
          media.map(async (item) => {
            const owner = await fetchData<UserWithNoPassword>(
              import.meta.env.VITE_AUTH_API + '/users/' + item.user_id
            );

            const mediaItem: MediaItemWithOwner = {
              ...item,
              username: owner.username,
            };

            if (mediaItem.screenshots && typeof mediaItem.screenshots === 'string') {
              mediaItem.screenshots = JSON.parse(mediaItem.screenshots).map(
                (screenshot: string) => {
                  return import.meta.env.VITE_FILE_URL + screenshot;
                }
              );
            }
            return mediaItem;
          })
        );
        setMediaArray(mediaWithOwner);
      } catch (e) {
        console.error((e as Error).message);
      }
    };
    getMedia();
  }, []);

  const postMedia = async (file: UploadResponse, inputs: Record<string, string>, token: string) => {
    const media: Omit<
      MediaItem,
      'media_id' | 'user_id' | 'thumbnail' | 'created_at' | 'screenshots'
    > = {
      title: inputs.title,
      description: inputs.description,
      filename: file.data.filename,
      media_type: file.data.media_type,
      filesize: file.data.filesize,
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(media),
    };

    try {
      return await fetchData<MediaItem>(import.meta.env.VITE_MEDIA_API + '/media', options);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  return { mediaArray, postMedia };
};

const useFile = () => {
  const postFile = async (file: File, token: string) => {
    const formData = new FormData();
    formData.append('file', file);
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    };
    try {
      return await fetchData<UploadResponse>(import.meta.env.VITE_UPLOAD_API + '/upload', options);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  return { postFile };
};

const useAuthentication = () => {
  const postLogin = async (credentials: Credentials) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    };
    try {
      return await fetchData<LoginResponse>(import.meta.env.VITE_AUTH_API + '/auth/login', options);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  return { postLogin };
};

const useUser = () => {
  const getUserByToken = async (token: string) => {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      return await fetchData<UserResponse>(import.meta.env.VITE_AUTH_API + '/users/token', options);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const postRegister = async (credentials: RegisterCredentials) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    };
    try {
      return await fetchData<UserResponse>(import.meta.env.VITE_AUTH_API + '/users', options);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const getUsernameAvailable = async (username: string) => {
    try {
      const response = await fetchData<AvailableResponse>(
        import.meta.env.VITE_AUTH_API + '/users/username/' + username
      );
      return response;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const getEmailAvailable = async (email: string) => {
    try {
      const response = await fetchData<AvailableResponse>(
        import.meta.env.VITE_AUTH_API + '/users/email/' + email
      );
      return response;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  return { getUserByToken, postRegister, getUsernameAvailable, getEmailAvailable };
};

const useLike = () => {
  const postLike = async (media_id: number, token: string) => {
    // Send a POST request to /likes with object { media_id } and the token in the
    // Authorization header.
    const options = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ media_id }),
    };
    return await fetchData<MessageResponse>(import.meta.env.VITE_MEDIA_API + '/likes', options);
  };

  const deleteLike = async (like_id: number, token: string) => {
    // Send a DELETE request to /likes/:like_id with the token in the Authorization header.
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return await fetchData<MessageResponse>(
      import.meta.env.VITE_MEDIA_API + '/likes/' + like_id,
      options
    );
  };

  const getCountByMediaId = async (media_id: number) => {
    // Send a GET request to /likes/count/:media_id to get the number of likes.
    return await fetchData<{ count: number }>(
      import.meta.env.VITE_MEDIA_API + '/likes/count/' + media_id
    );
  };

  const getUserLike = async (media_id: number, token: string) => {
    // Send a GET request to /likes/bymedia/user/:media_id to get the user's like on the media.
    const options = {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return await fetchData<Like>(
      import.meta.env.VITE_MEDIA_API + '/likes/bymedia/user/' + media_id,
      options
    );
  };

  return { postLike, deleteLike, getCountByMediaId, getUserLike };
};

const useComments = () => {};

export { useMedia, useUser, useComments, useFile, useAuthentication, useLike };
