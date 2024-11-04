import { AuthLayout } from "@/components";
import { HomePage, ProfilePage, LoginPage, SignupPage, VerifyCodePage } from "./index";

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
    path: "/verifycode/:username",
    element: (
      <AuthLayout authentication={false}>
        <VerifyCodePage />
      </AuthLayout>
    )
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