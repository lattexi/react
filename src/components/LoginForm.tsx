import { useForm } from "../hooks/formHooks";
import { Credentials } from "../types/LocalTypes";
import { useUserContext } from "../hooks/ContextHooks";

// LoginForm.tsx
const LoginForm = (props: { toggleRegister: () => void }) => {
  const toggleRegister = props.toggleRegister;
  const { handleLogin } = useUserContext();
  const initValues: Credentials = {
    username: "",
    password: "",
  };

  const doLogin = async () => {
    try {
      handleLogin(inputs as Credentials);
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
        <p onClick={toggleRegister} className="toggleRegister">
          Click here to register
        </p>
      </form>
    </>
  );
};

export default LoginForm;
