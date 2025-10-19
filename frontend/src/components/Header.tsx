import useRedirectUser from "@/customHooks/useRedirectUser";
import { CircleUser, Menu } from "lucide-react";
import { LogOut } from "lucide-react";
import { CircleAlert } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch } from "@/state/store";
import { logOut, selectRole } from "@/state/auth/authSlice";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import logo from "@/assets/logo.png";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavLinks } from "@/components/navigation/NavLinks";

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { session, isLoading } = useRedirectUser();
  const role = useSelector(selectRole);

  const logout = async () => {
    try {
      await dispatch(logOut()).unwrap();
    } catch (error) {
      console.error("Log out failed:", error);
      toast.error("Log out failed");
    }
  };

  return (
    <Popover>
      <PopoverTrigger className="flex items-center gap-2 hover:cursor-pointer hover:opacity-70">
        <CircleUser className="size-6 sm:size-8" />
        <p className="sr-only">Open profile information</p>
        <div className="hidden sm:flex flex-col items-start">
          <p className="text-sm">
            {session?.user.user_metadata?.full_name}{" "}
            <span className="text-muted-foreground">({role})</span>
          </p>
          <p className="text-muted-foreground text-xs">{session?.user.email}</p>
        </div>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col items-center gap-2 min-w-3xs mx-4">
        <div className="flex flex-col gap-1 items-center w-full">
          {isLoading ? (
            <Skeleton className="h-6 w-[80%]" />
          ) : (
            <p>{session?.user.user_metadata?.full_name}</p>
          )}
          {isLoading ? (
            <Skeleton className="h-4 w-full" />
          ) : (
            <p className="text-muted-foreground text-sm">
              {session?.user.email}
            </p>
          )}
        </div>
        {/* If loading, show skeleton; If no profile pic URL, show icon */}
        {isLoading ? (
          <Skeleton className="size-16 rounded-full" />
        ) : session?.user.user_metadata?.avatar_url ? (
          <img
            className="size-16 rounded-full"
            src={session?.user.user_metadata?.avatar_url}
            alt=""
          />
        ) : (
          <CircleUser className="size-16" />
        )}
        <Dialog>
          <DialogTrigger className="w-full" asChild>
            <Button
              variant="outline"
              className="w-full"
              disabled={isLoading}
              // onClick={logout}
            >
              <LogOut className="w-4" />
              Log out
            </Button>
          </DialogTrigger>
          <DialogContent>
            <div className="flex flex-col items-center w-full">
              <CircleAlert className="size-16" />
              <p className="text-lg">Are you sure you want to log out?</p>
            </div>
            <div className="flex gap-2">
              <DialogClose className="flex-1" asChild>
                <Button variant="outline" className="w-full">
                  Cancel
                </Button>
              </DialogClose>
              <Button variant="destructive" className="flex-1" onClick={logout}>
                <LogOut className="w-4" />
                Log out
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PopoverContent>
    </Popover>
  );
};

export const Header = () => {
  return (
    <div className="flex justify-between items-center border-b shadow-sm px-4 py-3">
      <DropdownMenu>
        <DropdownMenuTrigger className="block sm:hidden">
          <Menu className="h-8" />
          <p className="sr-only">Open navigation menu</p>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mx-4">
          <NavLinks />
        </DropdownMenuContent>
      </DropdownMenu>
      <Link to="/dashboard">
        <img
          src={logo}
          className="h-8 sm:h-10 pointer-events-none"
          alt="ISF Cambodia homepage"
        />
      </Link>
      <Profile />
    </div>
  );
};
