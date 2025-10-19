import { Outlet } from "react-router-dom";
import { Header } from "./Header";

export const Layout = () => {
  return (
    <>
      <Header />
      <div className="p-4">
        <Outlet />
      </div>
    </>
  );
};
