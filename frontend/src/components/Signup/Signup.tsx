import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signUpSchema } from "@/zodSchema/signUpSchema";
import { useNavigate } from "react-router-dom";
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
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const {toast} = useToast()
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();
  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    try {
      setLoading(true);
      const response = await axios.post("/api/v1/users/register/", values);
      if (response.data.success) {
        const username = response.data.data.username;
        form.reset();
        navigate(`/verifycode/${username}`);
        toast({
          title: 'User register success',
          description: response.data.message,
          variant:"default"
          
        })
      }
    } catch (error: any) {
      if(!error.response.data.success){
        toast({
          title: 'User register failed',
          description: error.response.data.message,
          variant:"destructive"
          
        })
      }
      
      navigate("/register");
    }
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen px-4 sm:px-0">
      <Card className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
        <CardHeader className="text-center">
          <CardTitle>Register Form</CardTitle>
          <CardDescription>
            Already registered?{" "}
            <span className="text-blue-400 hover:text-blue-600 font-semibold">
              <Link to="/login">Login</Link>
            </span>
          </CardDescription>
        </CardHeader>
        <Separator className="my-4" />
        {loading && (
          <div className="flex justify-center mt-2">
            <Loader2 />
          </div>
        )}
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
                      <Input
                        placeholder="Password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
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

export default Signup;
