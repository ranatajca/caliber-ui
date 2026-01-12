import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, User, CheckCircle, Clock, AlertCircle, MoreHorizontal, Edit, Trash2, Play, X, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: "pending" | "in-progress" | "completed";
  assignedTo: string[];
  requiredCalls: number;
  completedCalls: number;
  type: string;
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
    type: "cold-call",
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
    type: "objection",
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
    type: "discovery",
  },
];

const teamMembers = [
  { id: "1", name: "Saad Khan", initials: "SK" },
  { id: "2", name: "Tom Slocum", initials: "TS" },
  { id: "3", name: "Emily Rodriguez", initials: "ER" },
  { id: "4", name: "John Davis", initials: "JD" },
  { id: "5", name: "Sarah Martinez", initials: "SM" },
  { id: "6", name: "Michael Thompson", initials: "MT" },
];

const assignmentTypes = [
  { value: "cold-call", label: "Cold Call Practice" },
  { value: "discovery", label: "Discovery Call" },
  { value: "objection", label: "Objection Handling" },
  { value: "demo", label: "Demo Practice" },
  { value: "closing", label: "Closing Techniques" },
  { value: "follow-up", label: "Follow-up Calls" },
];

const Assignments = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState(mockAssignments);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    requiredCalls: 5,
    dueDate: "",
    assignedTo: [] as string[],
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "",
      requiredCalls: 5,
      dueDate: "",
      assignedTo: [],
    });
  };

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

  const handleStartAssignment = (assignment: Assignment) => {
    navigate("/ai-roleplays");
    toast.success(`Starting "${assignment.title}"`);
  };

  const handleEditAssignment = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description,
      type: assignment.type,
      requiredCalls: assignment.requiredCalls,
      dueDate: assignment.dueDate,
      assignedTo: assignment.assignedTo,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteAssignment = (id: string) => {
    setAssignments(assignments.filter(a => a.id !== id));
    toast.success("Assignment deleted");
  };

  const handleCreateAssignment = () => {
    if (!formData.title.trim()) {
      toast.error("Please enter an assignment title");
      return;
    }
    if (!formData.type) {
      toast.error("Please select an assignment type");
      return;
    }
    if (formData.assignedTo.length === 0) {
      toast.error("Please assign at least one team member");
      return;
    }
    if (!formData.dueDate) {
      toast.error("Please select a due date");
      return;
    }

    const newAssignment: Assignment = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description || `Complete ${formData.requiredCalls} ${assignmentTypes.find(t => t.value === formData.type)?.label || "practice"} sessions`,
      dueDate: new Date(formData.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "pending",
      assignedTo: formData.assignedTo,
      requiredCalls: formData.requiredCalls,
      completedCalls: 0,
      type: formData.type,
    };

    setAssignments([newAssignment, ...assignments]);
    setIsCreateDialogOpen(false);
    resetForm();
    toast.success("Assignment created successfully!");
  };

  const handleSaveEdit = () => {
    if (!editingAssignment) return;
    
    setAssignments(assignments.map(a => 
      a.id === editingAssignment.id 
        ? {
            ...a,
            title: formData.title,
            description: formData.description,
            type: formData.type,
            requiredCalls: formData.requiredCalls,
            dueDate: formData.dueDate,
            assignedTo: formData.assignedTo,
          }
        : a
    ));
    setIsEditDialogOpen(false);
    setEditingAssignment(null);
    resetForm();
    toast.success("Assignment updated successfully!");
  };

  const toggleTeamMember = (name: string) => {
    setFormData(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(name)
        ? prev.assignedTo.filter(n => n !== name)
        : [...prev.assignedTo, name]
    }));
  };

  const AssignmentFormContent = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="title">Assignment Title *</Label>
        <Input
          id="title"
          placeholder="e.g., Cold Call Mastery - Week 2"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Assignment Type *</Label>
        <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select training type" />
          </SelectTrigger>
          <SelectContent>
            {assignmentTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe the assignment objectives..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="requiredCalls">Required Calls *</Label>
          <Input
            id="requiredCalls"
            type="number"
            min={1}
            max={50}
            value={formData.requiredCalls}
            onChange={(e) => setFormData({ ...formData, requiredCalls: parseInt(e.target.value) || 1 })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date *</Label>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Assign Team Members *</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center space-x-2 p-2 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => toggleTeamMember(member.name)}
            >
              <Checkbox
                checked={formData.assignedTo.includes(member.name)}
                onCheckedChange={() => toggleTeamMember(member.name)}
              />
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">
                  {member.initials}
                </div>
                <span className="text-sm">{member.name}</span>
              </div>
            </div>
          ))}
        </div>
        {formData.assignedTo.length > 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            {formData.assignedTo.length} member{formData.assignedTo.length > 1 ? "s" : ""} selected
          </p>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => {
            if (isEdit) {
              setIsEditDialogOpen(false);
              setEditingAssignment(null);
            } else {
              setIsCreateDialogOpen(false);
            }
            resetForm();
          }}
        >
          Cancel
        </Button>
        <Button 
          className="flex-1"
          onClick={isEdit ? handleSaveEdit : handleCreateAssignment}
        >
          {isEdit ? "Save Changes" : "Create Assignment"}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Assignments</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Manage training assignments for your team
          </p>
        </div>
        <Button className="gap-2" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4" />
          Create Assignment
        </Button>
      </div>

      {/* Create Assignment Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Assignment</DialogTitle>
            <DialogDescription>
              Set up a new training assignment for your team members
            </DialogDescription>
          </DialogHeader>
          <AssignmentFormContent />
        </DialogContent>
      </Dialog>

      {/* Edit Assignment Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Assignment</DialogTitle>
            <DialogDescription>
              Update the assignment details
            </DialogDescription>
          </DialogHeader>
          <AssignmentFormContent isEdit />
        </DialogContent>
      </Dialog>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <Card>
          <CardContent className="p-3 md:p-4">
            <p className="text-xs md:text-sm text-muted-foreground">Total Assignments</p>
            <p className="text-2xl md:text-3xl font-bold">{assignments.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4">
            <p className="text-xs md:text-sm text-muted-foreground">In Progress</p>
            <p className="text-2xl md:text-3xl font-bold text-warning">
              {assignments.filter(a => a.status === "in-progress").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4">
            <p className="text-xs md:text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl md:text-3xl font-bold text-success">
              {assignments.filter(a => a.status === "completed").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4">
            <p className="text-xs md:text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl md:text-3xl font-bold">
              {assignments.filter(a => a.status === "pending").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Assignments List */}
      <div className="space-y-3 md:space-y-4">
        {assignments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-2">No assignments yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first training assignment to get started
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Assignment
              </Button>
            </CardContent>
          </Card>
        ) : (
          assignments.map((assignment) => (
            <Card key={assignment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex items-start gap-3 md:gap-4 cursor-pointer flex-1" onClick={() => handleStartAssignment(assignment)}>
                    {getStatusIcon(assignment.status)}
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        {assignment.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {assignment.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
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

                  <div className="flex items-center md:items-start gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-2 justify-end">
                        {assignment.assignedTo.slice(0, 3).map((person) => (
                          <div
                            key={person}
                            className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-secondary flex items-center justify-center text-[10px] md:text-xs font-medium cursor-pointer hover:ring-2 hover:ring-primary/50 -ml-1 first:ml-0"
                            title={person}
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.info(`Viewing ${person}'s profile`);
                            }}
                          >
                            {person.split(" ").map((n) => n[0]).join("")}
                          </div>
                        ))}
                        {assignment.assignedTo.length > 3 && (
                          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-muted flex items-center justify-center text-[10px] md:text-xs font-medium -ml-1">
                            +{assignment.assignedTo.length - 3}
                          </div>
                        )}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">{assignment.completedCalls}</span>
                        <span className="text-muted-foreground">/{assignment.requiredCalls} calls</span>
                      </div>
                      <div className="w-20 md:w-24 h-2 bg-muted rounded-full overflow-hidden mt-2">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${(assignment.completedCalls / assignment.requiredCalls) * 100}%` }}
                        />
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover">
                        <DropdownMenuItem onClick={() => handleStartAssignment(assignment)}>
                          <Play className="w-4 h-4 mr-2" />
                          Start Assignment
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditAssignment(assignment)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteAssignment(assignment.id)} className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Assignments;