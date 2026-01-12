import { useState } from "react";
import { User, Bell, Shield, CreditCard, Building2, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const Settings = () => {
  const [firstName, setFirstName] = useState("Saad");
  const [lastName, setLastName] = useState("Khan");
  const [email, setEmail] = useState("saad@caliber.ai");
  const [companyName, setCompanyName] = useState("Caliber AI");
  const [industry, setIndustry] = useState("Sales Technology");
  const [callCompleted, setCallCompleted] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [newAssignment, setNewAssignment] = useState(true);

  const handleSaveProfile = () => {
    toast.success("Profile saved successfully!");
  };

  const handleChangeAvatar = () => {
    toast.info("Avatar upload coming soon!");
  };

  const handleEnable2FA = () => {
    toast.success("Two-factor authentication enabled!");
  };

  const handleChangePassword = () => {
    toast.info("Password change dialog would open here");
  };

  const handleManageSubscription = () => {
    toast.info("Redirecting to billing portal...");
  };

  return (
    <div className="p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Profile
            </CardTitle>
            <CardDescription>Your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center relative group cursor-pointer" onClick={handleChangeAvatar}>
                <User className="w-8 h-8 text-muted-foreground" />
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <Button variant="outline" size="sm" onClick={handleChangeAvatar}>Change Avatar</Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Button className="mt-4" onClick={handleSaveProfile}>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Organization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Organization
            </CardTitle>
            <CardDescription>Your company settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input id="industry" value={industry} onChange={(e) => setIndustry(e.target.value)} />
            </div>
            <Button className="mt-4" onClick={() => toast.success("Organization settings saved!")}>Save Organization</Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription>Configure your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Call Completed</p>
                <p className="text-sm text-muted-foreground">
                  Get notified when a team member completes a call
                </p>
              </div>
              <Switch checked={callCompleted} onCheckedChange={(checked) => { setCallCompleted(checked); toast.success(checked ? "Notifications enabled" : "Notifications disabled"); }} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Weekly Reports</p>
                <p className="text-sm text-muted-foreground">
                  Receive weekly performance summaries
                </p>
              </div>
              <Switch checked={weeklyReports} onCheckedChange={(checked) => { setWeeklyReports(checked); toast.success(checked ? "Weekly reports enabled" : "Weekly reports disabled"); }} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">New Assignment</p>
                <p className="text-sm text-muted-foreground">
                  Get notified when you're assigned a new training
                </p>
              </div>
              <Switch checked={newAssignment} onCheckedChange={(checked) => { setNewAssignment(checked); toast.success(checked ? "Assignment notifications enabled" : "Assignment notifications disabled"); }} />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Security
            </CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleEnable2FA}>Enable</Button>
            </div>
            <div className="pt-4 border-t border-border">
              <Button variant="outline" onClick={handleChangePassword}>Change Password</Button>
            </div>
          </CardContent>
        </Card>

        {/* Billing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Billing
            </CardTitle>
            <CardDescription>Manage your subscription and billing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
              <div>
                <p className="font-medium">Pro Plan</p>
                <p className="text-sm text-muted-foreground">$49/month per seat</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleManageSubscription}>Manage Subscription</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
