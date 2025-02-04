import {
  MediaItem,
  MediaItemWithOwner,
  UserWithNoPassword,
} from "hybrid-types/DBTypes";
import { useEffect, useState } from "react";
import { fetchData } from "../lib/functions";
import { Credentials, RegisterCredentials } from "../types/LocalTypes";
import { LoginResponse, UserResponse } from "hybrid-types/MessageTypes";

const useMedia = () => {
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

  return { mediaArray };
};

const useAuthentication = () => {
  const postLogin = async (credentials: Credentials) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    };
    try {
      return await fetchData<LoginResponse>(
        import.meta.env.VITE_AUTH_API + "/auth/login",
        options,
      );
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
      return await fetchData<UserResponse>(
        import.meta.env.VITE_AUTH_API + "/users/token",
        options,
      );
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const postRegister = async (credentials: RegisterCredentials) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    };
    try {
      return await fetchData<UserResponse>(
        import.meta.env.VITE_AUTH_API + "/users",
        options,
      );
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  return { getUserByToken, postRegister };
};

const useComments = () => {
  // TODO: implement comments server api call
};

export { useMedia, useUser, useComments, useAuthentication };
