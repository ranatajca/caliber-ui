import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Building2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Signup state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupCompany, setSignupCompany] = useState("");
  const [accountType, setAccountType] = useState<"individual" | "team">("individual");

  const defaultTab = location.search.includes("signup") ? "signup" : "login";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    
    toast.success("Welcome back!");
    navigate("/home");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPassword) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (signupPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    
    toast.success("Account created! Welcome to Caliber.");
    navigate("/home");
  };

  const features = [
    "Unlimited AI roleplays",
    "Real-time call scoring",
    "Performance analytics",
    "Team leaderboards",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl overflow-hidden">
              <img src="/favicon.png" alt="Caliber" className="w-full h-full object-cover" />
            </div>
            <span className="text-2xl font-display font-bold text-sidebar-foreground">Caliber</span>
          </div>
          
          <h1 className="text-4xl font-display font-bold text-sidebar-foreground mb-6">
            Train your sales team with AI-powered coaching
          </h1>
          <p className="text-sidebar-foreground/70 text-lg mb-12">
            Practice calls, analyze performance, and improve close rates with intelligent feedback.
          </p>
          
          <div className="space-y-4">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-sidebar-primary/20 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-sidebar-primary" />
                </div>
                <span className="text-sidebar-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-sidebar-foreground/50 text-sm">
          Trusted by 500+ sales teams worldwide
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center justify-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl overflow-hidden">
              <img src="/favicon.png" alt="Caliber" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-display font-bold">Caliber</span>
          </div>

          <Card className="border-0 shadow-xl">
            <Tabs defaultValue={defaultTab}>
              <CardHeader className="pb-0">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
              </CardHeader>
              
              <CardContent className="pt-6">
                {/* Login Form */}
                <TabsContent value="login" className="mt-0">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="you@company.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="login-password">Password</Label>
                        <button type="button" className="text-xs text-primary hover:underline">
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In"}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </form>
                  
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" type="button" onClick={() => toast.info("Google sign-in coming soon")}>
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </Button>
                    <Button variant="outline" type="button" onClick={() => toast.info("Microsoft sign-in coming soon")}>
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z"/>
                      </svg>
                      Microsoft
                    </Button>
                  </div>
                </TabsContent>

                {/* Signup Form */}
                <TabsContent value="signup" className="mt-0">
                  <form onSubmit={handleSignup} className="space-y-4">
                    {/* Account Type Toggle */}
                    <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg">
                      <button
                        type="button"
                        onClick={() => setAccountType("individual")}
                        className={cn(
                          "py-2 px-3 rounded-md text-sm font-medium transition-all",
                          accountType === "individual"
                            ? "bg-card shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        Individual
                      </button>
                      <button
                        type="button"
                        onClick={() => setAccountType("team")}
                        className={cn(
                          "py-2 px-3 rounded-md text-sm font-medium transition-all",
                          accountType === "team"
                            ? "bg-card shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        Team / Company
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signup-name"
                          placeholder="John Doe"
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="you@company.com"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    {accountType === "team" && (
                      <div className="space-y-2">
                        <Label htmlFor="signup-company">Company Name</Label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="signup-company"
                            placeholder="Acme Inc."
                            value={signupCompany}
                            onChange={(e) => setSignupCompany(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          className="pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
                    </div>
                    
                    <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                      {isLoading ? "Creating account..." : "Create Account"}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                    
                    <p className="text-xs text-center text-muted-foreground">
                      By signing up, you agree to our{" "}
                      <a href="#" className="text-primary hover:underline">Terms</a> and{" "}
                      <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                    </p>
                  </form>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
          
          {accountType === "individual" && (
            <p className="text-center text-sm text-muted-foreground mt-6">
              Signing up as individual? You'll appear in our{" "}
              <a href="/talent" className="text-primary hover:underline">Talent Marketplace</a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
