import { MediaItemWithOwner, User, UserWithNoPassword } from 'hybrid-types/DBTypes';

export type Credentials = Pick<User, 'username' | 'password'>;
export type RegisterCredentials = Pick<User, 'username' | 'password' | 'email'>;

export type AuthContextType = {
  user: UserWithNoPassword | null;
  handleLogin: (credentials: Credentials) => void;
  handleLogout: () => void;
  handleAutoLogin: () => void;
};

export type MediaItemProps = {
  item: MediaItemWithOwner;
  onDelete?: (media_id: number) => void;
  setSelectedItem: (item: MediaItemWithOwner | undefined) => void;
};
