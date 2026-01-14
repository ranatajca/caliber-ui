import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "rep" | "manager";

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isManager: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<UserRole>("rep");

  return (
    <RoleContext.Provider value={{ role, setRole, isManager: role === "manager" }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
};
