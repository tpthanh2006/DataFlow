import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui/navigation-menu";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";

const links = [
  {
    route: "/dashboard",
    label: "Dashboard",
  },
  {
    route: "/forms",
    label: "Forms",
  },
  {
    route: "/resources",
    label: "Resources",
  },
  {
    route: "/staff-user-groups",
    label: "Configure User Groups",
  },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="hidden sm:flex flex-col gap-2 h-fit">
      <Button asChild>
        <Link to="#">+ Create Form</Link>
      </Button>
      <NavigationMenu
        className="px-2 py-4 rounded-lg shadow-md border border-border justify-start items-start max-w-full [&>div]:w-full"
        orientation="vertical"
        viewport={false}
      >
        <NavigationMenuList className="flex flex-col">
          {links.map((link) => (
            <NavigationMenuItem
              className="font-medium w-full "
              key={link.route}
            >
              <NavigationMenuLink
                className={cn(
                  "w-full data-[active=true]:focus:bg-primary data-[active=true]:hover:bg-primary/80 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground",
                )}
                data-active={location.pathname === link.route}
                asChild
              >
                <Link to={link.route}>{link.label}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};
