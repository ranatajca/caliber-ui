import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <AppHeader userName="Saad" />
      <main className="ml-60 pt-14 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
