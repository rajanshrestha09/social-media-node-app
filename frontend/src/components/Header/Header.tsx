import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@radix-ui/react-navigation-menu";
import { ModeToggle } from "../ThemeMode/mode-toggle";

import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { Button } from "../ui/button";
import { logout } from "@/features/auth/authSlice";
import axios from "axios";

const Header = () => {
  const isauth = useSelector((state: RootState) => state.auth.status);
  const loginInUser = useSelector((state: RootState) => state.auth.userInfo);
  const dispatch = useDispatch();

  async function logoutBtn() {
    try {
      await axios.post("/api/v1/users/logout");
      dispatch(logout());
    } catch (error) {
      console.log(`Error::`, error);
    }
  }

  const navItems = [
    {
      path: "/",
      title: "Home",
      status: isauth,
    },
    {
      path: `/profile/${loginInUser?._id}`,
      title: "Profile",
      status: isauth,
    },
  ];
  return (
    <div className="w-full flex flex-col items-center mt-4 md:flex-row md:justify-between md:items-center md:space-x-4 px-4">
      <div className="font-bold text-lg mb-4 md:mb-0">Problem-To-Solution</div>
      <div className="w-full space-y-4 md:w-auto flex justify-center md:justify-end items-center space-x-4">
        <NavigationMenu className="">
          <NavigationMenuList className="flex flex-col items-center space-y-6 md:space-y-0 md:flex-row md:space-x-4 ">
            {navItems.map((item) =>
              item.status ? (
                <NavigationMenuItem className="w-full md:w-auto">
                  <Link
                    to={item.path}
                    key={item.title}
                    className="w-full md:w-auto text-center border-2 border-slate-400 px-3 py-2 rounded-md hover:bg-slate-600 transition duration-150 ease-in-out"
                  >
                    {item.title}
                  </Link>
                </NavigationMenuItem>
              ) : null
            )}

            {isauth ? (
              <NavigationMenuItem className="w-full md:w-auto text-center">
                <Button onClick={logoutBtn} className="w-full md:w-auto">
                  Logout
                </Button>
              </NavigationMenuItem>
            ) : null}
            <ModeToggle />
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};

export default Header;
