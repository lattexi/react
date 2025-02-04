import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./views/Home";
import Profile from "./views/Profile";
import Upload from "./views/Upload";
import Layout from "./components/Layout";
import Single from "./views/Single";
import Login from "./views/Login";

const App = () => {
  return (
    <>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />}></Route>
            <Route path="/Profile" element={<Profile />}></Route>
            <Route path="/Upload" element={<Upload />}></Route>
            <Route path="/Single" element={<Single />}></Route>
            <Route path="/Login" element={<Login />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
