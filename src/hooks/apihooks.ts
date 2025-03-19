import {
  Like,
  MediaItem,
  MediaItemWithOwner,
  UserWithNoPassword,
  Comment,
  TagResult,
  Tag,
} from 'hybrid-types/DBTypes';
import { useEffect, useState } from 'react';
import { fetchData } from '../lib/functions';
import { Credentials, GoogleLoginResponse, RegisterCredentials } from '../types/LocalTypes';
import {
  AvailableResponse,
  LoginResponse,
  MessageResponse,
  UploadResponse,
  UserResponse,
} from 'hybrid-types/MessageTypes';

const useMedia = (user_id?: number) => {
  console.log('useMedia hook');
  const [mediaArray, setMediaArray] = useState<MediaItemWithOwner[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasNext, setHasNext] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const getMedia = async (pageNumber: number) => {
    setLoading(true);
    const url = user_id
      ? import.meta.env.VITE_MEDIA_API + `/media/byuser/${user_id}`
      : import.meta.env.VITE_MEDIA_API + `/media?page=${pageNumber}&limit=${16}`;
    if (user_id) {
      console.log('user_id', user_id);
    }
    try {
      console.log('fetching media');
      const media = await fetchData<MediaItem[]>(url);
      const mediaWithOwner: MediaItemWithOwner[] = await Promise.all(
        media.map(async (item) => {
          console.log('fetching owner');
          const owner = await fetchData<UserWithNoPassword>(
            import.meta.env.VITE_AUTH_API + '/users/' + item.user_id
          );

          const mediaItem: MediaItemWithOwner = {
            ...item,
            username: owner.username,
          };

          if (mediaItem.screenshots && typeof mediaItem.screenshots === 'string') {
            mediaItem.screenshots = JSON.parse(mediaItem.screenshots).map((screenshot: string) => {
              return import.meta.env.VITE_FILE_URL + screenshot;
            });
          }
          return mediaItem;
        })
      );
      setMediaArray(mediaWithOwner);

      if (mediaWithOwner.length < 16) {
        setHasNext(false);
      } else {
        setHasNext(true);
      }
    } catch (e) {
      console.error((e as Error).message);
    }
    setLoading(false);
  };

  const refreshMedia = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    getMedia(currentPage);
  }, [currentPage, user_id, refreshTrigger]);

  const changePage = async (newPage: number) => {
    if (newPage < 1) return;
    if (newPage > currentPage && !hasNext) return;
    setCurrentPage(newPage);
  };

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
      return await fetchData<{ media: MediaItem }>(
        import.meta.env.VITE_MEDIA_API + '/media',
        options
      );
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const deleteMedia = async (media_id: number, token: string) => {
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      return await fetchData<MessageResponse>(
        import.meta.env.VITE_MEDIA_API + '/media/' + media_id,
        options
      );
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const modifyMedia = async (media_id: number, inputs: Record<string, string>, token: string) => {
    const media: Pick<MediaItem, 'title' | 'description'> = {
      title: inputs.title,
      description: inputs.description,
    };

    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(media),
    };

    try {
      return await fetchData<MessageResponse>(
        import.meta.env.VITE_MEDIA_API + '/media/' + media_id,
        options
      );
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  return {
    mediaArray,
    postMedia,
    deleteMedia,
    modifyMedia,
    currentPage,
    changePage,
    hasNext,
    loading,
    refreshMedia,
  };
};

const useTags = () => {
  const postTag = async (media_id: number, tag: string, token: string) => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ media_id, tag_name: tag }),
    };
    try {
      return await fetchData<MessageResponse>(import.meta.env.VITE_MEDIA_API + '/tags', options);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const deleteTag = async (tag_id: number, token: string) => {
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      return await fetchData<MessageResponse>(
        import.meta.env.VITE_MEDIA_API + '/tags/' + tag_id,
        options
      );
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const getTagsByMediaId = async (media_id: number) => {
    try {
      return await fetchData<TagResult[]>(
        import.meta.env.VITE_MEDIA_API + '/tags/bymedia/' + media_id
      );
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const getMediaByTag = async (tag_id: number) => {
    try {
      return await fetchData<MediaItemWithOwner[]>(
        import.meta.env.VITE_MEDIA_API + '/tags/bytag/' + tag_id
      );
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const getAllTags = async () => {
    try {
      return await fetchData<Tag[]>(import.meta.env.VITE_MEDIA_API + '/tags');
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  return { postTag, deleteTag, getTagsByMediaId, getAllTags, getMediaByTag };
};

const useRatings = () => {
  const postRating = async (media_id: number, rating: number, token: string) => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ media_id, rating }),
    };
    try {
      return await fetchData<MessageResponse>(import.meta.env.VITE_MEDIA_API + '/rating', options);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const deleteRating = async (rating_id: number, token: string) => {
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      return await fetchData<MessageResponse>(
        import.meta.env.VITE_MEDIA_API + '/rating/' + rating_id,
        options
      );
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const getRatingByMediaId = async (media_id: number) => {
    try {
      return await fetchData<{ rating: number }>(
        import.meta.env.VITE_MEDIA_API + '/rating/average/' + media_id
      );
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  return { postRating, deleteRating, getRatingByMediaId };
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

  const postGoogleLogin = async (idToken: string) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    };
    try {
      return await fetchData<GoogleLoginResponse>(
        import.meta.env.VITE_AUTH_API + '/auth/google',
        options
      );
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  return { postLogin, postGoogleLogin };
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

  const getUserById = async (user_id: number) => {
    try {
      console.log('user_id', user_id);
      return await fetchData<UserWithNoPassword>(
        import.meta.env.VITE_AUTH_API + '/users/' + user_id
      );
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

  return { getUserByToken, postRegister, getUsernameAvailable, getEmailAvailable, getUserById };
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

const useComment = () => {
  const { getUserById } = useUser();
  const postComment = async (comment_text: string, media_id: number, token: string) => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ comment_text, media_id }),
    };
    return await fetchData<MessageResponse>(import.meta.env.VITE_MEDIA_API + '/comments', options);
  };

  const getCommentsByMediaId = async (media_id: number) => {
    const comments = await fetchData<Comment[]>(
      import.meta.env.VITE_MEDIA_API + '/comments/bymedia/' + media_id
    );
    const commentsWithUsername = await Promise.all<Comment & { username: string }>(
      comments.map(async (comment) => {
        const user = await getUserById(comment.user_id);
        return { ...comment, username: user.username };
      })
    );
    return commentsWithUsername;
  };

  return { postComment, getCommentsByMediaId };
};

export { useMedia, useUser, useComment, useFile, useAuthentication, useLike, useTags, useRatings };
