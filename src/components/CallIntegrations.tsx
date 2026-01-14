import { useState } from "react";
import { 
  Video, 
  Upload, 
  Link2, 
  CheckCircle2, 
  ExternalLink,
  FileAudio,
  Loader2,
  X,
  RefreshCw,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface UploadedCall {
  id: string;
  name: string;
  duration: string;
  size: string;
  status: "processing" | "analyzed" | "error";
  score?: number;
}

const CallIntegrations = () => {
  const [fathomConnected, setFathomConnected] = useState(false);
  const [autoSync, setAutoSync] = useState(false);
  const [uploadedCalls, setUploadedCalls] = useState<UploadedCall[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFathomConnect = () => {
    toast.info("Redirecting to Fathom authorization...");
    // Simulate OAuth flow
    setTimeout(() => {
      setFathomConnected(true);
      toast.success("Successfully connected to Fathom!");
    }, 1500);
  };

  const handleFathomDisconnect = () => {
    setFathomConnected(false);
    setAutoSync(false);
    toast.success("Disconnected from Fathom");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    const newCalls: UploadedCall[] = Array.from(files).map((file, index) => ({
      id: `upload-${Date.now()}-${index}`,
      name: file.name,
      duration: "Analyzing...",
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      status: "processing" as const
    }));

    setUploadedCalls(prev => [...prev, ...newCalls]);

    // Simulate processing
    setTimeout(() => {
      setIsUploading(false);
      setUploadedCalls(prev => prev.map(call => 
        newCalls.some(nc => nc.id === call.id) 
          ? { ...call, status: "analyzed" as const, duration: "4:32", score: Math.floor(Math.random() * 20) + 75 }
          : call
      ));
      toast.success(`${files.length} call(s) analyzed successfully!`);
    }, 3000);
  };

  const removeCall = (callId: string) => {
    setUploadedCalls(prev => prev.filter(c => c.id !== callId));
    toast.success("Call removed");
  };

  const handleSyncNow = () => {
    toast.info("Syncing latest calls from Fathom...");
    setTimeout(() => {
      const syncedCall: UploadedCall = {
        id: `fathom-${Date.now()}`,
        name: "Discovery Call - Acme Corp",
        duration: "23:45",
        size: "From Fathom",
        status: "analyzed",
        score: 87
      };
      setUploadedCalls(prev => [...prev, syncedCall]);
      toast.success("1 new call synced from Fathom!");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Fathom Integration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Video className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Fathom Integration</CardTitle>
                <CardDescription>Connect to sync your live call recordings automatically</CardDescription>
              </div>
            </div>
            {fathomConnected && (
              <Badge className="bg-success/10 text-success border-success/20">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Connected
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!fathomConnected ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-muted/50 rounded-xl">
              <div>
                <p className="font-medium">Connect your Fathom account</p>
                <p className="text-sm text-muted-foreground">
                  Automatically analyze all your sales calls for scoring
                </p>
              </div>
              <Button onClick={handleFathomConnect} className="gap-2">
                <Link2 className="w-4 h-4" />
                Connect Fathom
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="font-medium">fathom@company.com</p>
                    <p className="text-sm text-muted-foreground">Last synced: 5 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleSyncNow}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sync Now
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleFathomDisconnect}>
                    Disconnect
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-sync" className="font-medium">Auto-sync new calls</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically import and analyze new recordings
                  </p>
                </div>
                <Switch
                  id="auto-sync"
                  checked={autoSync}
                  onCheckedChange={(checked) => {
                    setAutoSync(checked);
                    toast.success(checked ? "Auto-sync enabled" : "Auto-sync disabled");
                  }}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Manual Upload */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Upload Call Recordings</CardTitle>
              <CardDescription>Upload recordings manually for analysis</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
            <input
              type="file"
              id="call-upload"
              accept="audio/*,video/*,.mp3,.wav,.mp4,.webm"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
            <label htmlFor="call-upload" className="cursor-pointer">
              <FileAudio className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="font-medium mb-1">Drop files here or click to upload</p>
              <p className="text-sm text-muted-foreground">
                Supports MP3, WAV, MP4, WebM (max 500MB)
              </p>
            </label>
          </div>

          {/* Privacy Notice */}
          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg text-sm">
            <Zap className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Privacy:</span> Calls are processed for scoring and then deleted. 
              No personal customer information is stored.
            </p>
          </div>

          {/* Uploaded Calls List */}
          {uploadedCalls.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Uploaded Calls</h4>
              {uploadedCalls.map(call => (
                <div key={call.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      {call.status === "processing" ? (
                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                      ) : call.status === "analyzed" ? (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      ) : (
                        <X className="w-4 h-4 text-destructive" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm truncate max-w-[200px]">{call.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {call.duration} • {call.size}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {call.score && (
                      <span className={`font-bold ${
                        call.score >= 85 ? "text-success" : 
                        call.score >= 75 ? "text-primary" : "text-warning"
                      }`}>
                        {call.score}
                      </span>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="w-8 h-8" 
                      onClick={() => removeCall(call.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Other Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Other Integrations</CardTitle>
          <CardDescription>Connect more tools to enhance your analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { name: "Gong", status: "coming-soon" },
              { name: "Chorus", status: "coming-soon" },
              { name: "Zoom", status: "coming-soon" },
              { name: "Google Meet", status: "coming-soon" }
            ].map(integration => (
              <div key={integration.name} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <Video className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <span className="font-medium">{integration.name}</span>
                </div>
                <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CallIntegrations;
