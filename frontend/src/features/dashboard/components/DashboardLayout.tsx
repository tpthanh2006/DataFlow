import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/navigation/Sidebar";

export const DashboardLayout = () => {
  return (
    <div className="flex items-start gap-4">
      <Sidebar />
      <Outlet />
    </div>
  );
};
