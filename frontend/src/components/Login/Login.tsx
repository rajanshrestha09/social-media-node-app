import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signInSchema } from "@/zodSchema/signInSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { login } from "@/features/auth/authSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "../ui/separator";
import { z } from "zod";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Loader } from "lucide-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const {toast} = useToast()
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    setLoading(true);
    await axios
      .post("/api/v1/users/login/", values)
      .then((response) => {
        const userInfo = response.data.data;
        dispatch(login(userInfo));
        toast({
          title: "Login success!",
          description: "You have successfully login."
        })
      })
      .catch((error) => {
        setApiError(error.response.data.message);
        toast({
          title: "Login Failure!",
          description:error.response.data.message,
          variant:"destructive"
        })
      });
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen px-4 sm:px-0">
      <Card className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
        <CardHeader className="text-center">
          <CardTitle>Login Form</CardTitle>
          <CardDescription>
            Don't have an account?{" "}
            <span className="text-blue-400 hover:text-blue-600 font-semibold">
              <Link to="/register">Register</Link>
            </span>
          </CardDescription>
        </CardHeader>

        <Separator className="my-4" />

        {loading && (
          <div className="flex justify-center mt-2">
            <Loader />
          </div>
        )}

        <CardContent className="mt-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    {apiError === "User not exist" ? (
                      <FormMessage>{apiError}</FormMessage>
                    ) : (
                      <FormMessage />
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    {apiError === "Incorrect Password." ? (
                      <FormMessage>{apiError}</FormMessage>
                    ) : (
                      <FormMessage />
                    )}
                  </FormItem>
                )}
              />
              <div className="text-center">
                <Button type="submit" className="w-full md:w-auto">
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
