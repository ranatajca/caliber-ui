import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Phone, Settings2, Mic, MicOff, Volume2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const StartRoleplay = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handleStartCall = () => {
    setIsCallActive(true);
    // Simulate call for 3 seconds then redirect to call detail
    setTimeout(() => {
      navigate(`/calls/demo-${id}`);
    }, 3000);
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    navigate(`/calls/demo-${id}`);
  };

  const buyer = {
    name: "Jane Bowen",
    role: "Director of Sales",
    company: "Agile Solutions",
    traits: ["busy", "aggressive", "not friendly"],
  };

  return (
    <div className="p-4 md:p-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div className="flex items-center gap-3 md:gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/roleplays")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-display font-bold">Cold Call Simulation</h1>
              <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs font-medium rounded">
                DEMO
              </span>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">Practice your sales skills with AI</p>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate("/roleplays/new")}>
            <Settings2 className="w-4 h-4" />
            <span className="hidden sm:inline">Customize</span>
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate("/calls")}>
            <span className="hidden sm:inline">View</span> Calls
          </Button>
        </div>
      </div>

      {/* Main Card */}
      <div className="max-w-lg mx-auto mt-6 md:mt-12">
        <Card className="overflow-hidden">
          {!isCallActive ? (
            <CardContent className="p-8 text-center">
              <h2 className="text-lg font-semibold mb-2">Instructions</h2>
              <p className="text-muted-foreground text-sm mb-8 max-w-sm mx-auto">
                Start a cold call simulation with {buyer.name} from {buyer.company} and learn how to do a
                cold call effectively. Wear headphones for the best experience.
              </p>

              {/* Buyer Avatar */}
              <div className="flex flex-col items-center mb-8">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 border-4 border-white shadow-lg">
                  <User className="w-14 h-14 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{buyer.name}</h3>
                <p className="text-muted-foreground">{buyer.role} @ {buyer.company}</p>
                <div className="flex gap-2 mt-3">
                  {buyer.traits.map((trait) => (
                    <span key={trait} className="badge-trait badge-rude">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              {/* Start Button */}
              <Button
                size="lg"
                onClick={handleStartCall}
                className="w-full max-w-xs gap-2 h-12"
              >
                <Phone className="w-5 h-5" />
                Start call
              </Button>
            </CardContent>
          ) : (
            <CardContent className="p-8 text-center">
              {/* Active Call UI */}
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-success/20 to-accent/20 flex items-center justify-center mx-auto border-4 border-success/30 animate-pulse">
                  <User className="w-16 h-16 text-success" />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-success text-white text-xs font-medium rounded-full">
                  Connected
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-1">{buyer.name}</h3>
              <p className="text-muted-foreground mb-6">{buyer.role}</p>

              {/* Call Timer */}
              <div className="text-3xl font-mono font-bold text-foreground mb-8">
                00:0{Math.floor(Math.random() * 9)}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <Button
                  variant={isMuted ? "destructive" : "secondary"}
                  size="icon"
                  className="w-14 h-14 rounded-full"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  className="w-16 h-16 rounded-full"
                  onClick={handleEndCall}
                >
                  <Phone className="w-7 h-7 rotate-135" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="w-14 h-14 rounded-full"
                >
                  <Volume2 className="w-6 h-6" />
                </Button>
              </div>

              {/* Live transcript hint */}
              <div className="p-4 bg-muted rounded-xl text-sm text-muted-foreground">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="font-medium text-foreground">AI is listening...</span>
                </div>
                <p>"Look, I'm really busy right now. What do you want?"</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default StartRoleplay;
