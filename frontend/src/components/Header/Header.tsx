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
    <div className="mx-24 flex flex-row justify-between items-center  mt-2 ">
      <div className="text-xl font-bold">Problem-To-Solution</div>
      <div>
        <NavigationMenu>
          <NavigationMenuList className="flex justify-center items-center  space-x-8">
            <NavigationMenuItem>
              {navItems.map((item) =>
                item.status ? (
                  <Link
                    to={item.path}
                    key={item.title}
                    className="mx-1 border-2 border-slate-400 px-2 py-1 rounded-md hover:bg-slate-600"
                  >
                    {item.title}
                  </Link>
                ) : null
              )}
            </NavigationMenuItem>
            <NavigationMenuItem className="flex justify-center items-center">
              {isauth ? (
                <Button onClick={logoutBtn} className="mr-2">
                  Logout
                </Button>
              ) : null}
              <ModeToggle />
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      {/* <div className="flex"></div> */}
    </div>
  );
};

export default Header;
