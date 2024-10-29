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
      console.log("Posting post error:: Home.tsx ==> ", error);
      toast({
        title: "Post success",
        description: "Something went wront while posting.",
        variant: "destructive",
      });
    }
  }

  // getl all the post from backend
  async function getAllPost() {
    try {
      const response = await axios.get("/api/v1/post/get-all-post");
      const data = response.data.data;
      // console.log("Data::" ,data);

      dispatch(postProb(data));
      //console.log(data);
      setGetAllUserPost(data);
    } catch (error) {}
  }

  useEffect(() => {
    getAllPost();
  }, [refresh]);

  return (
    <div className="mx-24">
      {/* Post form setup start */}
      <div className=" mt-8 flex justify-between items-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex justify-between items-center"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="w-full mr-4">
                  <FormControl>
                    <Textarea
                      placeholder="Write down your problem."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Post</Button>
          </form>
        </Form>
      </div>
      {/* Form setup end */}
      <Separator className="my-4 h-1" />
      {getAllUserPost.map((post: postInterface) => (
        <div key={post._id} className="mx-8 flex justify-center">
          <Card className="w-full my-2">
            <CardHeader>
              <Link to={`/profile/${post.authorID}`}>
                <CardTitle className="capitalize text-yellow-700">
                  {post.author}
                </CardTitle>
              </Link>
            </CardHeader>
            <CardContent className="">{post.content}</CardContent>
            <CardFooter className="">
              {/* TODO: */}
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
