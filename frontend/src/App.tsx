import Header from "./components/Header/Header";
import { Outlet } from "react-router-dom";
import { Separator } from "./components/ui/separator";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {login, logout} from "./features/auth/authSlice";
import { Toaster } from "./components/ui/toaster";

function App() {
  const dispatch = useDispatch()
  async function getCurrentUser(){
    
   try {
    const response = await axios.get('/api/v1/users/current-user');
    const userInfo = response.data.data
    dispatch(login(userInfo))
   } catch (error) {
      console.log(`Error:: =>  ${error}`);
      dispatch(logout())
   }
  }
  useEffect(() => {
   getCurrentUser()
  }, []);
  return (
    <>
      <Header />
      <Separator className="mt-2" />
      <Outlet />
      <Toaster />
    </>
  );
}

export default App;
