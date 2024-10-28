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
import { Loader} from "lucide-react";
import axios from "axios";

const Login = () => {
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

  console.log(apiError);

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    setLoading(true);
    await axios
      .post("/api/v1/users/login/", values)
      .then((response) => {
        console.log("Response:: ",response.data.data);
        
        const userInfo = response.data.data;        
        dispatch(login(userInfo));
      })
      .catch((error) => {
        setApiError(error.response.data.message);
      });
  }

  return (
    <div className=" flex flex-col justify-center items-center h-screen">
      <Card className="w-96">
        <CardHeader className="text-center">
          <CardTitle>Login Form</CardTitle>
          <CardDescription>
            {" "}
            Dont have an account?{" "}
            <span className="text-blue-400 hover:text-blue-600 hover:text-bold">
              <Link to="/register">Register</Link>
            </span>
          </CardDescription>
        </CardHeader>
        <Separator />

        {loading ? (
          <div className="flex justify-center mt-2">
            <Loader />
          </div>
        ) : null}

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
                    {apiError == "User not exist" ? (
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

                    {apiError == "Incorrect Password." ? (
                      <FormMessage>{apiError}</FormMessage>
                    ) : (
                      <FormMessage />
                    )}
                  </FormItem>
                )}
              />
              <div className="text-center">
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
