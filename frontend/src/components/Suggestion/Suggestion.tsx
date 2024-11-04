import { Form, FormControl, FormField, FormItem } from "../ui/form";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useCallback } from "react";

interface Post {
  _id: string;
}

const Suggestion = (post: Post) => {
  const { toast } = useToast();

  const commentForm = useForm({});
  const commentSubmit = useCallback(async (values: any) => {
    try {
      const response = await axios.post(
        "/api/v1/comment/comment-to-post",
        values
      );
      if (response.data.statusCode === 200) {
        commentForm.reset();
        toast({
          title: "Post success",
          description: response.data.message,
        });
      }
    } catch (error) {
      toast({
        title: "Post success",
        description: "Something went wront while commenting.",
        variant: "destructive",
      });
    }
  }, []);
  return (
    <Drawer>
      <DrawerTrigger>
        <Button variant="outline">Suggestion</Button>
      </DrawerTrigger>
      <DrawerContent className="p-4 sm:p-6 md:mx-12 lg:mx-24 mb-8 max-w-full ">
        <DrawerTitle className="mb-4 text-center">
          Comment down here!
        </DrawerTitle>
        <Form {...commentForm}>
          <form
            onSubmit={commentForm.handleSubmit(commentSubmit)}
            className="space-y-4"
          >
            <FormField
              control={commentForm.control}
              name="id"
              defaultValue={post._id}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="hidden" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={commentForm.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about yourself"
                      className="resize-none w-full sm:w-3/4 mx-auto"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DrawerClose asChild>
              <Button type="submit" className="w-full sm:w-auto mx-auto block">
                Confirm
              </Button>
            </DrawerClose>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
};

export default Suggestion;
