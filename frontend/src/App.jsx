import Login from "./components/Login";
import RequestPasswordReset from "./components/RequestPasswordReset";
import ResetPassword from "./components/ResetPassword";
import { Route, Routes } from "react-router-dom";
import Homepage from "./components/Homepage";

const App = () => {

  return (
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/home" element={<Homepage/>}/>

      <Route path="/forgotpassword" element={<RequestPasswordReset/>}/>
      <Route path="/reset-password" element={<ResetPassword/>}/>
    </Routes>
   
  );
};

export default App;
