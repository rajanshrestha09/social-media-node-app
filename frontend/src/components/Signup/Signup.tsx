import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signUpSchema } from "@/zodSchema/signUpSchema";
import {useNavigate} from "react-router-dom"
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
import { Loader2 } from "lucide-react";
import axios from "axios";

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate()
  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    try {
      setLoading(true);
      const data = await axios
        .post("/api/v1/users/register/", values)
        .then((response) => {
          return response.data;
        });
      if(data.success) form.reset()
      navigate('/login')
    } catch (error) {
      navigate('/register')
    }
  }

  return (
    <div className=" flex flex-col justify-center items-center h-screen">
      <Card className="w-96">
        <CardHeader className="text-center">
          <CardTitle>Register Form</CardTitle>
          <CardDescription>
            {" "}
            Already registered?{" "}
            <span className="text-blue-400 hover:text-blue-600 hover:text-bold">
              <Link to="/login">Login</Link>
            </span>
          </CardDescription>
        </CardHeader>
        <Separator />
        {loading ? (
          <div className="flex justify-center mt-2">
            <Loader2 />
          </div>
        ) : null}

        <CardContent className="mt-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
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
                      <Input placeholder="Password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
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

export default Signup;
