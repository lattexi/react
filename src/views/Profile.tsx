import { useUser } from "../hooks/apihooks";
import { useEffect, useState } from "react";
import { UserWithNoPassword } from "hybrid-types/DBTypes";

const Profile = () => {
  const [user, setUser] = useState<UserWithNoPassword | null>(null);
  const { getUserByToken } = useUser();

  const getUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const userResponse = await getUserByToken(token);
    setUser(userResponse.user);
  };

  useEffect(() => {
    getUser();
  }, []);
  console.log(user);

  return (
    <>
      <h1>Profile</h1>

      {user && (
        <>
          <p>{user.username}</p>
          <p>{user.email}</p>
          <p>{user.level_name}</p>
          <p>{new Date(user.created_at).toLocaleString("fi-FI")}</p>
        </>
      )}
    </>
  );
};

export default Profile;
