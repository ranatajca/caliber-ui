import { Plus, User, MoreVertical, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Member {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "rep";
  avatar?: string;
  totalCalls: number;
  avgScore: number;
  lastActive: string;
}

const mockMembers: Member[] = [
  {
    id: "1",
    name: "Saad Khan",
    email: "saad@caliber.ai",
    role: "admin",
    totalCalls: 35,
    avgScore: 75,
    lastActive: "Just now",
  },
  {
    id: "2",
    name: "Tom Slocum",
    email: "tom@caliber.ai",
    role: "manager",
    totalCalls: 48,
    avgScore: 82,
    lastActive: "2 hours ago",
  },
  {
    id: "3",
    name: "Sarah Martinez",
    email: "sarah@caliber.ai",
    role: "rep",
    totalCalls: 47,
    avgScore: 89,
    lastActive: "1 day ago",
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    email: "emily@caliber.ai",
    role: "rep",
    totalCalls: 38,
    avgScore: 82,
    lastActive: "3 hours ago",
  },
];

const Members = () => {
  const getRoleBadge = (role: Member["role"]) => {
    switch (role) {
      case "admin":
        return "bg-primary text-primary-foreground";
      case "manager":
        return "bg-secondary text-secondary-foreground";
      case "rep":
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Members</h1>
          <p className="text-muted-foreground mt-1">
            Manage your team members and their access
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Invite Member
        </Button>
      </div>

      {/* Members Table */}
      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-medium text-muted-foreground">Member</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Role</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Calls</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Avg Score</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Last Active</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {mockMembers.map((member) => (
                <tr key={member.id} className="border-b border-border hover:bg-muted/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                        <User className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {member.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getRoleBadge(member.role)}`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-medium">{member.totalCalls}</span>
                  </td>
                  <td className="p-4">
                    <span className={`font-medium ${
                      member.avgScore >= 80 ? "text-success" : member.avgScore >= 70 ? "text-warning" : "text-destructive"
                    }`}>
                      {member.avgScore}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-muted-foreground">{member.lastActive}</span>
                  </td>
                  <td className="p-4">
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Members;
