import { useForm } from '../hooks/formHooks';
import { Credentials } from '../types/LocalTypes';
import { useUserContext } from '../hooks/ContextHooks';

// LoginForm.tsx
const LoginForm = (props: { toggleRegister: () => void }) => {
  const toggleRegister = props.toggleRegister;
  const { handleLogin } = useUserContext();
  const initValues: Credentials = {
    username: '',
    password: '',
  };

  const doLogin = async () => {
    try {
      handleLogin(inputs as Credentials);
    } catch (e) {
      console.error((e as Error).message);
    }
  };

  const { handleSubmit, handleInputChange, inputs } = useForm(doLogin, initValues);

  return (
    <>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="loginusername">Username</label>
          <input
            className="my-2 rounded-sm border border-stone-500 p-2"
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
            className="my-2 rounded-sm border border-stone-500 p-2"
            name="password"
            type="password"
            id="loginpassword"
            onChange={handleInputChange}
            autoComplete="current-password"
          />
        </div>
        <button type="submit" className="my-2 cursor-pointer rounded-sm bg-stone-500 p-2">
          Login
        </button>
        <p onClick={toggleRegister} className="cursor-pointer">
          Click here to register
        </p>
      </form>
    </>
  );
};

export default LoginForm;
