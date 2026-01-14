import { useRole } from "@/contexts/RoleContext";
import RepDashboard from "@/components/dashboard/RepDashboard";
import ManagerDashboard from "@/components/dashboard/ManagerDashboard";

const HomePage = () => {
  const { isManager } = useRole();

  return (
    <div className="p-4 md:p-6">
      {isManager ? <ManagerDashboard /> : <RepDashboard />}
    </div>
  );
};

export default HomePage;