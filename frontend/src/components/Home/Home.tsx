import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { postSchema } from "@/zodSchema/postSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postProb } from "@/features/postSlice/postSlice";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import axios from "axios";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CommentPop from "../CommentPop/CommentPop";
import Suggestion from "../Suggestion/Suggestion";
import { RootState } from "@/store/store";
import { Link } from "react-router-dom";

interface postInterface {
  _id: string;
  authorID: string;
  author: string;
  content: string;
}

const Home = () => {
  const post = useSelector((state: RootState) => state.post.postState);
  const [getAllUserPost, setGetAllUserPost] = useState(post || []);
  const [refresh, setRefresh] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: "",
    },
  });

  async function onSubmit(values: z.infer<typeof postSchema>) {
    try {
      const response = await axios.post("/api/v1/post/post-ques", values);
      if (response.data.statusCode === 200) {
        form.reset();
        setRefresh(!refresh);
        toast({
          title: "Post success",
          description: response.data.message,
        });
      }
    } catch (error) {
      toast({
        title: "Post success",
        description: "Something went wront while posting.",
        variant: "destructive",
      });
    }
  }
  async function getAllPost() {
    try {
      const response = await axios.get("/api/v1/post/get-all-post");
      const data = response.data.data;
      dispatch(postProb(data));
      setGetAllUserPost(data);
    } catch (error) {}
  }

  useEffect(() => {
    getAllPost();
  }, [refresh]);

  return (
    <div className="px-4 md:px-12 lg:px-24">
      {/* Post form setup start */}
      <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col md:flex-row items-center md:justify-between space-y-4 md:space-y-0"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="w-full md:mr-4">
                  <FormControl>
                    <Textarea
                      placeholder="Write down your problem."
                      className="resize-none w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full md:w-auto">
              Post
            </Button>
          </form>
        </Form>
      </div>
      {/* Form setup end */}
      <Separator className="my-4 h-1" />

      {getAllUserPost.map((post: postInterface) => (
        <div
          key={post._id}
          className="flex justify-center px-2 sm:px-4 md:px-8 lg:px-0"
        >
          <Card className="w-full md:max-w-2xl my-2">
            <CardHeader>
              <Link to={`/profile/${post.authorID}`}>
                <CardTitle className="capitalize text-yellow-700">
                  {post.author}
                </CardTitle>
              </Link>
            </CardHeader>
            <CardContent>{post.content}</CardContent>
            <CardFooter className="flex justify-between items-center">
              {/* TODO: Additional actions */}
              {/* <Button variant="ghost" className="mx-2">
            Like
          </Button> */}
              <Suggestion {...post} />
              <CommentPop {...post} />
            </CardFooter>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default Home;
