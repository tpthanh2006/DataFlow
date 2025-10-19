import { cn } from "@/lib/utils";
import { useEffect, type ComponentProps } from "react";
import { Button } from "../ui/button";
import { MoveLeft, MoveRight } from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui/navigation-menu";

export interface FormCreationSidebarLink {
  label: string;
  route: string;
  disabled: boolean;
}

export interface FormCreationSidebarProps {
  links: FormCreationSidebarLink[];
}

export const FormCreationSidebar = ({ links }: FormCreationSidebarProps) => {
  const location = useLocation();

  return (
    <div className="flex flex-col gap-2 h-fit">
      <Button variant="outline" asChild>
        <Link to="/dashboard">
          <MoveLeft />
          Dashboard
        </Link>
      </Button>
      <NavigationMenu className="h-fit px-2 py-4  rounded-lg shadow-md border border-border justify-start items-start">
        <NavigationMenuList className="flex flex-col">
          {links.map((link) => (
            <NavigationMenuItem className="font-medium w-full" key={link.route}>
              <NavigationMenuLink
                className={cn(
                  "data-[active=true]:focus:bg-primary data-[active=true]:hover:bg-primary/80 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground",
                  link.disabled
                    ? "text-muted-foreground pointer-events-none"
                    : "",
                )}
                data-active={location.pathname === link.route}
                asChild
              >
                {/* <Link to={link.route}>{link.label}</Link> */}
                {!link.disabled ? (
                  <Link to={link.route}>{link.label}</Link>
                ) : (
                  <p>{link.label}</p>
                )}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export const FormCreationPageLayout = ({
  links,
  className,
  ...props
}: ComponentProps<"div"> & ComponentProps<typeof FormCreationSidebar>) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentStepLink = links.find(
    (link) => link.route === location.pathname,
  );

  // If a link is disabled (e.g. the previous steps haven't been completed yet) then we
  // redirect to the first step (first link)
  // I moved it here so we don't have to rewrite it for every step's component
  useEffect(() => {
    if (currentStepLink && currentStepLink.disabled) {
      navigate(links[0].route);
    }
  }, [currentStepLink, links, navigate]);

  return (
    <div className={cn("flex gap-4", className)} {...props}>
      <FormCreationSidebar links={links} />
      <Outlet />
    </div>
  );
};

/**
 * All content for a form creation step (form, additional info, etc. go in this component)
 * @param props Accepts the props of a <div/> element
 */
export const FormCreationContent = ({
  className,
  ...props
}: ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 p-8 flex-1 rounded-lg shadow-md border border-border",
        className,
      )}
      {...props}
    />
  );
};

/**
 * Heading information layout component for a form creation section (form name, form step name, etc.)
 * @param props Accepts the props of a <div/> element
 */
export const FormCreationHeading = ({
  className,
  ...props
}: ComponentProps<"div">) => {
  return <div className={cn("flex flex-col gap-2", className)} {...props} />;
};

type FormCreationFormNameProps = {
  name?: string;
};

/**
 * Displays the form's name or a default if none
 * @param props Accepts the props of an <h1/> element
 * @param name The form's name. If undefined, defaults to "Untitled form"
 * @returns
 */
const FormCreationFormName = ({
  name,
  className,
  ...props
}: ComponentProps<"h1"> & FormCreationFormNameProps) => {
  return (
    <h1 className={cn("h1", className)} {...props}>
      {name || "Untitled form"}
    </h1>
  );
};

FormCreationHeading.FormName = FormCreationFormName;

type FormCreationStepNameProps = {
  name: string;
};

/**
 * Displays the name of the current step in the form creation process
 * @param props Accepts the props of an <h2/> element
 * @param name The current step's name.
 * @returns
 */
const FormCreationStepName = ({
  name,
  ...props
}: ComponentProps<"h2"> & FormCreationStepNameProps) => {
  return (
    <h2 className="h2 mb-0" {...props}>
      {name}
    </h2>
  );
};

FormCreationHeading.StepName = FormCreationStepName;

const FormCreationDescription = ({
  className,
  ...props
}: ComponentProps<"p">) => {
  return (
    <p
      className={cn(className, "text-base text-muted-foreground")}
      {...props}
    />
  );
};

FormCreationHeading.Description = FormCreationDescription;

/**
 * A simple layout component for quick information for our users
 * @param props Accepts the props of a <div/> element
 */
export const FormCreationInfo = ({
  className,
  ...props
}: ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 bg-gray-50 px-4 py-6 rounded-lg shadow-inner border border-border",
        className,
      )}
      {...props}
    />
  );
};

const FormCreationInfoHeading = ({
  className,
  ...props
}: ComponentProps<"p">) => {
  return (
    <p
      className={cn("text-base font-semibold text-gray-800", className)}
      {...props}
    />
  );
};
FormCreationInfo.Heading = FormCreationInfoHeading;

export const FormCreationInfoText = ({
  className,
  ...props
}: ComponentProps<"p">) => {
  return <p className={cn("text-sm text-gray-600", className)} {...props} />;
};
FormCreationInfo.Text = FormCreationInfoText;

/**
 * Buttons layout for form creation
 * @param props Accepts the props of a <div/> element
 */
export const FormCreationButtons = ({
  className,
  ...props
}: ComponentProps<"div">) => {
  return <div className={cn("flex justify-end gap-2", className)} {...props} />;
};

type FormCreationBackButtonProps = {
  to: string;
};

/**
 * The back button for a form creation step
 * @param to Path to the previous page
 */
export const FormCreationBackButton = ({ to }: FormCreationBackButtonProps) => {
  return (
    <Button variant="outline" asChild>
      <Link to={to}>Back</Link>
    </Button>
  );
};

/**
 * The submit button for a form creation step :)
 * @param props Accepts the props of a shadcn <Button/> element
 */
export const FormCreationSubmitButton = ({
  ...props
}: ComponentProps<typeof Button>) => {
  return (
    <Button type="submit" variant="secondary" {...props}>
      Save and Continue <MoveRight />
    </Button>
  );
};
