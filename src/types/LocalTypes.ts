import { User, UserWithNoPassword } from "hybrid-types/DBTypes";

export type Credentials = Pick<User, "username" | "password">;
export type RegisterCredentials = Pick<User, "username" | "password" | "email">;

export type AuthContextType = {
  user: UserWithNoPassword | null;
  handleLogin: (credentials: Credentials) => void;
  handleLogout: () => void;
  handleAutoLogin: () => void;
};
