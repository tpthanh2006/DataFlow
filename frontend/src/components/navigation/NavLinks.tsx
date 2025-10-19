import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Link, useLocation } from "react-router-dom";
import type { ComponentProps } from "react";
import { Button } from "../ui/button";

const NavLink = ({ to, ...props }: ComponentProps<typeof Link>) => {
  const location = useLocation();

  return (
    <NavigationMenuItem className="w-full">
      <NavigationMenuLink asChild>
        <Link to={to} data-active={location.pathname === to} {...props} />
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

// TODO: We need to be able to change the links displayed based on the user's role
// TODO: Change the link's routes
export const NavLinks = ({
  className,
  ...props
}: ComponentProps<typeof NavigationMenu>) => {
  return (
    <NavigationMenu className={className} {...props}>
      <NavigationMenuList className="flex flex-col w-full min-w-[10rem]">
        <NavigationMenuItem className="w-full">
          <Button className="w-full" data-slot={undefined} asChild>
            <Link to="#">+ Create Form</Link>
          </Button>
        </NavigationMenuItem>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/forms">Forms</NavLink>
        <NavLink to="/resources">Resources</NavLink>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
