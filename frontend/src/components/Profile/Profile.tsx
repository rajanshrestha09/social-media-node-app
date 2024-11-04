import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { login } from "@/features/auth/authSlice";

interface User {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  bio: string;
  profilePic: string;
}

const Profile = () => {
  const { authorID } = useParams();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const loginInUser = useSelector((state: RootState) => state.auth.userInfo);
  const [user, setUser] = useState<User>();
  const [profilePicUrl, setProfilePicUrl] = useState(user?.profilePic ?? "");

  const form = useForm();

  async function userProfile() {
    const user = await axios.get(`/api/v1/users/${authorID}`);

    setUser(user.data.data);
    setProfilePicUrl(user.data.data.profilePic);
  }

  useEffect(() => {
    userProfile();
  }, [authorID,profilePicUrl]);

  const handleProfileImageUpdate = useCallback(
    (newImageUrl: string) => {
      setProfilePicUrl(`${newImageUrl}?${new Date().getTime()}`);
    },
    [user, profilePicUrl]
  );

  async function onSubmit(values: any) {
    try {
      const response = await axios.post(
        "/api/v1/users/user-profile-pic",
        values,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        dispatch(login(response.data.data));
        handleProfileImageUpdate(response.data.data.profilePic);
        form.reset();
        toast({
          title: "Profile Image",
          description: "Image uploaded successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Profile Image",
        description: `Imgae uploaded fail:: ${error}`,
      });
    }
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 py-8">
      <div className="flex flex-col items-center w-full max-w-md lg:max-w-lg my-4">
        <Card className="w-full my-8 text-center">
          <div className="flex justify-center items-center my-4">
            {user?.profilePic && (
              <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-2 p-1 sm:p-2">
                <AvatarImage
                  className="rounded-full"
                  src={`${profilePicUrl}?${new Date().getTime()}`}
                />
              </Avatar>
            )}
          </div>

          <CardHeader>
            <CardTitle className="capitalize text-yellow-700">
              {user?.username}
            </CardTitle>
            <CardDescription>{user?.bio ?? "No bio available"}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-2">
            <p>
              <span className="text-lg font-semibold">Created On:</span>{" "}
              {user?.createdAt.split("T")[0]}
            </p>
            <p>
              <span className="text-lg font-semibold">Email:</span>{" "}
              {user?.email}
            </p>
          </CardContent>
        </Card>
      </div>

      {loginInUser?._id === user?._id && (
        <div className="w-full max-w-md px-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="profilePic"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="block w-full text-lg text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                        type="file"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full sm:w-auto">
                {profilePicUrl ? "Change Profile" : "Upload Profile"}
              </Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
};

export default Profile;
