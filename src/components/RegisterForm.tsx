import { useForm } from '../hooks/formHooks';
import { RegisterCredentials } from '../types/LocalTypes';
import { useUser } from '../hooks/apiHooks';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

// LoginForm.tsx
const RegisterForm = (props: { toggleRegister: () => void }) => {
  const toggleRegister = props.toggleRegister;
  const navigate = useNavigate();
  const [usernameAvailable, setUsernameAvailable] = useState<boolean>(true);
  const [emailAvailable, setEmailAvailable] = useState<boolean>(true);
  const { postRegister, getUsernameAvailable, getEmailAvailable } = useUser();
  const initValues: RegisterCredentials = {
    username: '',
    password: '',
    email: '',
  };

  const doRegister = async () => {
    try {
      const registerResult = await postRegister(inputs as RegisterCredentials);
      console.log(registerResult);
      navigate('/login');
    } catch (e) {
      console.error((e as Error).message);
    }
  };

  const { handleSubmit, handleInputChange, inputs } = useForm(doRegister, initValues);

  useEffect(() => {
    if (inputs.email && /\S+@\S+\.\S+/.test(inputs.email)) {
      getEmailAvailable(inputs.email).then((response) => {
        setEmailAvailable(response.available);
      });
    } else {
      setEmailAvailable(true);
    }
  }, [inputs.email]);

  useEffect(() => {
    if (inputs.username.length > 3) {
      getUsernameAvailable(inputs.username).then((response) => {
        setUsernameAvailable(response.available);
      });
    } else {
      setUsernameAvailable(true);
    }
  }, [inputs.username]);

  return (
    <>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="registerusername">Username</label>
          <input
            className="my-2 rounded-sm border border-stone-500 p-2"
            name="username"
            type="text"
            id="registerusername"
            onChange={handleInputChange}
            autoComplete="username"
          />
          {!usernameAvailable && <p>Username already in use</p>}
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            className="my-2 rounded-sm border border-stone-500 p-2"
            name="email"
            type="email"
            id="email"
            onChange={handleInputChange}
            autoComplete="email"
          />
          {!emailAvailable && <p>Email already in use</p>}
        </div>
        <div>
          <label htmlFor="registerpassword">Password</label>
          <input
            className="my-2 rounded-sm border border-stone-500 p-2"
            name="password"
            type="password"
            id="registerpassword"
            onChange={handleInputChange}
            autoComplete="current-password"
          />
        </div>
        <button type="submit" className="my-2 cursor-pointer rounded-sm bg-stone-500 p-2">
          Register
        </button>
        <p onClick={toggleRegister} className="toggleRegister">
          Click here to login
        </p>
      </form>
    </>
  );
};

export default RegisterForm;
