import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className="ml-64 transition-all duration-300">
        <AppHeader userName="Saad" />
        <main className="min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
