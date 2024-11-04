import { useCallback, useState } from "react";
import { Card, CardContent, CardTitle } from "../ui/card";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

type Comment = {
  _id: string;
  authorName: string;
  content: [];
};

interface Post {
  _id: string;
}

const CommentPop = (post: Post) => {
  const [comments, setComments] = useState<Comment[] | null>();
  const { toast } = useToast();
  //=====================  Suggestion btn fn
  const handleSuggestionBtn = useCallback(async (postId: string) => {
    try {
      const response = await axios.get("/api/v1/comment/get-comment", {
        params: { postId },
      });
      if (response.data.statusCode === 200) {
        if (response.data.data.length === 0) {
          setComments(null);
        }
        setComments(response.data.data);
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
    <Popover>
      <PopoverTrigger>
        <Button
          onClick={() => handleSuggestionBtn(post._id)}
          className="mx-2 bg-green-700 hover:bg-green-900"
        >
          Read Suggestion
        </Button>
      </PopoverTrigger>
      {comments?.length !== 0 ? (
        <PopoverContent className="outline-dotted w-full max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl">
          <div className="text-xl font-bold text-center mb-4">
            Total suggestions: {comments?.length}
          </div>
          <ScrollArea className="h-[300px] sm:h-[400px]">
            {comments?.map((comment) => (
              <Card
                key={comment?._id}
                className="my-2 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto"
              >
                <div className="flex items-center">
                  <CardTitle className="mx-2 text-lg text-yellow-700 capitalize">
                    {comment.authorName}
                  </CardTitle>
                  <span>says:</span>
                </div>
                <Separator />
                <CardContent className="border-2 m-2 py-2">
                  {comment.content}
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        </PopoverContent>
      ) : (
        <PopoverContent className="outline-dotted w-full max-w-xs sm:max-w-sm md:max-w-md text-center p-4">
          No comments
        </PopoverContent>
      )}
    </Popover>
  );
};

export default CommentPop;
