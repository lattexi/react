import { useEffect } from "react";
import { useUserContext } from "../hooks/ContextHooks";

const Logout = () => {
  const { handleLogout } = useUserContext();
  useEffect(() => {
    handleLogout();
  }, []);
  return <h1>Logout</h1>;
};

export default Logout;
