import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Phone, Settings, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const StartSimulation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isCallActive, setIsCallActive] = useState(false);

  const handleStartCall = () => {
    setIsCallActive(true);
    // Navigate to active call after a short delay
    setTimeout(() => {
      navigate(`/calls/demo-call-id`);
    }, 2000);
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    navigate(`/calls/demo-call-id`);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/simulations")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">Cold Call Simulation</h1>
            <span className="px-2 py-1 bg-muted text-muted-foreground text-xs font-medium rounded">
              DEMO
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Settings className="w-4 h-4" />
            Customize buyer bot
          </Button>
          <Button variant="outline" onClick={() => navigate("/calls")}>
            View calls
          </Button>
        </div>
      </div>

      {/* Simulation Card */}
      <div className="max-w-xl mx-auto mt-12">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-lg font-semibold mb-2">Instructions</h2>
            <p className="text-muted-foreground text-sm mb-8">
              Start a cold call simulation with Jane from Agile Solutions, a B2B SaaS
              company that sells project management software, and learn how to do a
              cold call effectively. Wear headphones for the best experience.
            </p>

            {/* Buyer Avatar */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
                <User className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Jane Bowen</h3>
              <p className="text-muted-foreground">Director of Sales @ Agile Solutions</p>
            </div>

            {/* Call Button */}
            {!isCallActive ? (
              <Button
                size="lg"
                onClick={handleStartCall}
                className="w-full max-w-xs gap-2"
              >
                <Phone className="w-5 h-5" />
                Start call
              </Button>
            ) : (
              <Button
                size="lg"
                variant="destructive"
                onClick={handleEndCall}
                className="w-full max-w-xs gap-2"
              >
                <Phone className="w-5 h-5" />
                End call
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StartSimulation;
