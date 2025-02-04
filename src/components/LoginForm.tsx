import { useForm } from "../hooks/formHooks";
import { Credentials } from "../types/LocalTypes";
import { useAuthentication } from "../hooks/apihooks";
import { useNavigate } from "react-router-dom";

// LoginForm.tsx
const LoginForm = () => {
  const navigate = useNavigate();
  const { postLogin } = useAuthentication();
  const initValues: Credentials = {
    username: "",
    password: "",
  };

  const doLogin = async () => {
    try {
      const loginResult = await postLogin(inputs as Credentials);
      if (loginResult) {
        localStorage.setItem("token", loginResult.token);
      }
      navigate("/");
    } catch (e) {
      console.error((e as Error).message);
    }
  };

  const { handleSubmit, handleInputChange, inputs } = useForm(
    doLogin,
    initValues,
  );

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="loginusername">Username</label>
          <input
            name="username"
            type="text"
            id="loginusername"
            onChange={handleInputChange}
            autoComplete="username"
          />
        </div>
        <div>
          <label htmlFor="loginpassword">Password</label>
          <input
            name="password"
            type="password"
            id="loginpassword"
            onChange={handleInputChange}
            autoComplete="current-password"
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default LoginForm;
