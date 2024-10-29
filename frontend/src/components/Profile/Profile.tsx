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
  // console.log("Author id::: ",authorID);

  const { toast } = useToast();
  const dispatch = useDispatch();
  const loginInUser = useSelector((state: RootState) => state.auth.userInfo);
  const [user, setUser] = useState<User>();
  /* The line `const [profilePicUrl, setProfilePicUrl] = useState(user?.profilePic ?? "");` is
  initializing a state variable `profilePicUrl` using the `useState` hook in React. */
  const [profilePicUrl, setProfilePicUrl] = useState(
    user?.profilePic ?? ""
  );
  // console.log(profilePicUrl);

  const form = useForm();
  // console.log(user);

  async function userProfile() {
    const user = await axios.get(`/api/v1/users/${authorID}`);

   // console.log("Profile User::", user.data.data);
    setUser(user.data.data);
    setProfilePicUrl(user.data.data.profilePic)
  }

  useEffect(() => {
    userProfile();
  }, [authorID]);

  const handleProfileImageUpdate = useCallback(
    (newImageUrl: string) => {
      setProfilePicUrl(`${newImageUrl}?${new Date().getTime()}`);
    },
    [user]
  );

  async function onSubmit(values: any) {
    //console.log("VAlue::", values);
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
       // console.log(`User:`, response.data.data);
        dispatch(login(response.data.data));
        handleProfileImageUpdate(response.data.data.profilePic);
        form.reset();
        toast({
          title: "Profile Image",
          description: "Image uploaded successfully",
        });
      }
    } catch (error) {
     // console.log("Something wrong while uploading pic.");
      toast({
        title: "Profile Image",
        description: `Imgae uploaded fail:: ${error}`,
      });
    }
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center w-3/4 my-2">
        <Card className="w-2/4 my-8 text-center">
          <div className="flex justify-center items-center my-2">
            {user?.profilePic && (
              <Avatar className="h-32 w-32 border-2 p-2">
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
            <CardDescription>{user?.bio ?? "no bio"}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              <span className="text-lg font-semibold">Created On:</span>{" "}
              {user?.createdAt.split("T")[0]}
            </p>
            <p>
              <span className="text-lg font-semibold">Email: </span>{" "}
              {user?.email}
            </p>
          </CardContent>
        </Card>
      </div>

      {loginInUser?._id === user?._id && (
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="profilePic"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="block my-2 w-full text-lg text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                        id="small_size"
                        type="file"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit">
                {profilePicUrl ? "Change Profile" : "Upload Profile"}{" "}
              </Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
};

export default Profile;
