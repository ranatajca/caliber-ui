import { Plus, User, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: "pending" | "in-progress" | "completed";
  assignedTo: string[];
  requiredCalls: number;
  completedCalls: number;
}

const mockAssignments: Assignment[] = [
  {
    id: "1",
    title: "Cold Call Mastery - Week 1",
    description: "Complete 10 cold call simulations with B2B personas",
    dueDate: "Jan 15, 2026",
    status: "in-progress",
    assignedTo: ["Saad Khan", "Tom Slocum"],
    requiredCalls: 10,
    completedCalls: 6,
  },
  {
    id: "2",
    title: "Objection Handling Training",
    description: "Practice handling common objections with AI buyers",
    dueDate: "Jan 20, 2026",
    status: "pending",
    assignedTo: ["Emily Rodriguez", "John Davis"],
    requiredCalls: 5,
    completedCalls: 0,
  },
  {
    id: "3",
    title: "Discovery Call Practice",
    description: "Focus on discovery questions and active listening",
    dueDate: "Jan 10, 2026",
    status: "completed",
    assignedTo: ["Sarah Martinez"],
    requiredCalls: 8,
    completedCalls: 8,
  },
];

const Assignments = () => {
  const getStatusIcon = (status: Assignment["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-success" />;
      case "in-progress":
        return <Clock className="w-5 h-5 text-warning" />;
      case "pending":
        return <AlertCircle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusLabel = (status: Assignment["status"]) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in-progress":
        return "In Progress";
      case "pending":
        return "Pending";
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Assignments</h1>
          <p className="text-muted-foreground mt-1">
            Manage training assignments for your team
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create Assignment
        </Button>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {mockAssignments.map((assignment) => (
          <Card key={assignment.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  {getStatusIcon(assignment.status)}
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {assignment.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {assignment.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        Due: {assignment.dueDate}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        assignment.status === "completed"
                          ? "bg-success/10 text-success"
                          : assignment.status === "in-progress"
                          ? "bg-warning/10 text-warning"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {getStatusLabel(assignment.status)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-2 mb-2">
                    {assignment.assignedTo.map((person, i) => (
                      <div
                        key={person}
                        className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium"
                        title={person}
                      >
                        {person.split(" ").map((n) => n[0]).join("")}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">{assignment.completedCalls}</span>
                    <span className="text-muted-foreground">
                      /{assignment.requiredCalls} calls
                    </span>
                  </div>
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden mt-2">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{
                        width: `${(assignment.completedCalls / assignment.requiredCalls) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Assignments;
