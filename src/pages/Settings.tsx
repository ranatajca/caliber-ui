import { useState } from "react";
import { User, Bell, Shield, CreditCard, Building2, Camera, Users, Send, CheckCircle2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import CallIntegrations from "@/components/CallIntegrations";
import ScorecardManager from "@/components/ScorecardManager";

const Settings = () => {
  const [firstName, setFirstName] = useState("Saad");
  const [lastName, setLastName] = useState("Khan");
  const [email, setEmail] = useState("saad@caliber.ai");
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [isIndividual, setIsIndividual] = useState(true);
  const [availableInTalentPool, setAvailableInTalentPool] = useState(true);
  const [callCompleted, setCallCompleted] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [pendingRequest, setPendingRequest] = useState<string | null>(null);

  const handleSaveProfile = () => {
    toast.success("Profile saved successfully!");
  };

  const handleJoinTeam = () => {
    if (!companyEmail) {
      toast.error("Please enter your company email");
      return;
    }
    setPendingRequest(companyEmail.split("@")[1]);
    toast.success("Join request sent! Waiting for admin approval.");
  };

  const handleCancelRequest = () => {
    setPendingRequest(null);
    toast.success("Request cancelled");
  };

  return (
    <div className="p-6 max-w-4xl space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

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
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center relative group cursor-pointer">
              <User className="w-8 h-8 text-muted-foreground" />
              <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>
            <Button variant="outline" size="sm">Change Avatar</Button>
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

      {/* Team / Company */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Team & Company
          </CardTitle>
          <CardDescription>Join a team or stay as an individual in the talent pool</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isIndividual ? (
            <>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Individual Account</p>
                    <p className="text-sm text-muted-foreground">You're visible in the Talent Marketplace</p>
                  </div>
                </div>
                <Badge className="bg-success/10 text-success border-success/20">Active</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Available in Talent Pool</Label>
                  <p className="text-sm text-muted-foreground">Show your profile to recruiters</p>
                </div>
                <Switch checked={availableInTalentPool} onCheckedChange={(checked) => {
                  setAvailableInTalentPool(checked);
                  toast.success(checked ? "You're now visible in talent pool" : "Hidden from talent pool");
                }} />
              </div>

              <div className="border-t border-border pt-6">
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Join a Team
                </h4>
                {pendingRequest ? (
                  <div className="flex items-center justify-between p-4 bg-warning/10 rounded-xl border border-warning/20">
                    <div>
                      <p className="font-medium">Request pending for {pendingRequest}</p>
                      <p className="text-sm text-muted-foreground">Waiting for admin approval</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleCancelRequest}>Cancel</Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">Enter your company email to request joining your team (like Slack)</p>
                    <div className="flex gap-2">
                      <Input placeholder="you@company.com" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} />
                      <Button onClick={handleJoinTeam} className="gap-2 shrink-0">
                        <Send className="w-4 h-4" />
                        Request to Join
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="font-medium">{companyName || "Caliber AI"}</p>
                  <p className="text-sm text-muted-foreground">Team member</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => { setIsIndividual(true); toast.success("Left team"); }}>Leave Team</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scorecards */}
      <ScorecardManager />

      {/* Call Integrations */}
      <CallIntegrations />

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Call Completed</p>
              <p className="text-sm text-muted-foreground">Get notified when a team member completes a call</p>
            </div>
            <Switch checked={callCompleted} onCheckedChange={setCallCompleted} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Weekly Reports</p>
              <p className="text-sm text-muted-foreground">Receive weekly performance summaries</p>
            </div>
            <Switch checked={weeklyReports} onCheckedChange={setWeeklyReports} />
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
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
            </div>
            <Button variant="outline" size="sm">Enable</Button>
          </div>
          <div className="pt-4 border-t border-border">
            <Button variant="outline">Change Password</Button>
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
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
            <div>
              <p className="font-medium">Pro Plan</p>
              <p className="text-sm text-muted-foreground">$49/month per seat</p>
            </div>
            <Button variant="outline" size="sm">Manage Subscription</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
