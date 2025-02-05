import { useUserContext } from "../hooks/ContextHooks";

const Profile = () => {
  const { user } = useUserContext();

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
