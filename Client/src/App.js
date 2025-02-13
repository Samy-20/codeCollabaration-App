import "./App.css";
import Dashboard from "./modules/Dashboard/index";
import From from "./modules/Form/index";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast"

function App() {
  return (
    <>
    <Toaster position="top-center"></Toaster>
      <Routes>
        <Route path="/" element={<From />}></Route>
        <Route path="/:roomId" element={<Dashboard />}></Route>
      </Routes>
    </>
  );
}

export default App;


