import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Loader2 } from "lucide-react";

interface props {
  children: React.ReactNode;
  authentication: Boolean;
}

const AuthLayout = ({ children, authentication = true }: props) => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const authStatus = useSelector((state: RootState)=> state.auth.status);
  
  useEffect(() => {
    if (authentication && authStatus !== authentication) {
      navigate("/login");
    } else if (!authentication && authStatus !== authentication) {
      navigate("/");
    }
    setLoader(false);
  }, [authStatus, navigate, authentication]);

  return loader ? <Loader2 /> : <>{children}</>;
};

export default AuthLayout;
