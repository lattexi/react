import { useForm } from "../hooks/formHooks";
import { RegisterCredentials } from "../types/LocalTypes";
import { useUser } from "../hooks/apihooks";
import { useNavigate } from "react-router-dom";

// LoginForm.tsx
const RegisterForm = () => {
  const navigate = useNavigate();
  const { postRegister } = useUser();
  const initValues: RegisterCredentials = {
    username: "",
    password: "",
    email: "",
  };

  const doRegister = async () => {
    try {
      const registerResult = await postRegister(inputs as RegisterCredentials);
      console.log(registerResult);
      navigate("/login");
    } catch (e) {
      console.error((e as Error).message);
    }
  };

  const { handleSubmit, handleInputChange, inputs } = useForm(
    doRegister,
    initValues,
  );

  return (
    <>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="registerusername">Username</label>
          <input
            name="username"
            type="text"
            id="registerusername"
            onChange={handleInputChange}
            autoComplete="username"
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            name="email"
            type="email"
            id="email"
            onChange={handleInputChange}
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="registerpassword">Password</label>
          <input
            name="password"
            type="password"
            id="registerpassword"
            onChange={handleInputChange}
            autoComplete="current-password"
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default RegisterForm;
