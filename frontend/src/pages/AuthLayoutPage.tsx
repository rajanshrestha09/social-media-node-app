import { AuthLayout } from "@/components";
import { HomePage, ProfilePage, LoginPage, SignupPage } from "./index";

const AuthLayoutPage = [
  {
    path: "/",
    element: (
      <AuthLayout authentication>
        <HomePage />
      </AuthLayout>
    ),
  },
  {
    path: "/login",
    element: (
      <AuthLayout authentication={false}>
        <LoginPage />
      </AuthLayout>
    ),
  },
  {
    path: "/register",
    element: (
      <AuthLayout authentication={false}>
        <SignupPage />
      </AuthLayout>
    ),
  },
  {
    path: "/profile/:authorID",
    element: (
      <AuthLayout authentication>
        <ProfilePage />
      </AuthLayout>
    ),
  },
];

export default AuthLayoutPage