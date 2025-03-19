import { MediaItemWithOwner, User, UserWithNoPassword } from 'hybrid-types/DBTypes';

export type Credentials = Pick<User, 'username' | 'password'>;
export type RegisterCredentials = Pick<User, 'username' | 'password' | 'email'>;

export type AuthContextType = {
  user: UserWithNoPassword | null;
  handleLogin: (credentials: Credentials) => void;
  handleLogout: () => void;
  handleAutoLogin: () => void;
  handleGoogleLoginSuccess: (credentialResponse: any) => void;
};

export type MediaItemProps = {
  item: MediaItemWithOwner;
  setSelectedItem: (item: MediaItemWithOwner | undefined) => void;
};

export type SingleViewProps = {
  item: MediaItemWithOwner;
  onDelete: () => void;
  setSelectedItem: (item: MediaItemWithOwner | undefined) => void;
};

export type GoogleLoginResponse = {
  token: string;
  user: UserWithNoPassword;
};
