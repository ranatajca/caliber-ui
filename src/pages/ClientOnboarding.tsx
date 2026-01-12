import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Play, Check, ArrowRight, Building2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";

type Step = 1 | 2 | 3 | 4;

const ClientOnboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [playbook, setPlaybook] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = () => {
    // Simulate file upload
    const files = ["sales_call_01.mp3", "sales_call_02.mp3", "sales_call_03.mp3"];
    setUploadedFiles(files);
  };

  const handleNext = () => {
    if (step < 4) {
      setStep((prev) => (prev + 1) as Step);
    }
  };

  const handleComplete = () => {
    setIsProcessing(true);
    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);
  };

  const steps = [
    { number: 1, title: "Company Info" },
    { number: 2, title: "Upload Recordings" },
    { number: 3, title: "Add Playbook" },
    { number: 4, title: "Review" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 px-4 pb-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-6">
              <Building2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Client Onboarding</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Let's Set Up Your <span className="text-gradient-primary">Sales Context</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Upload your recordings and playbook so Caliber can create custom AI prospects and battlecards.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-12">
            {steps.map((s, index) => (
              <div key={s.number} className="flex items-center">
                <div className={`flex items-center gap-2 ${
                  step >= s.number ? "text-primary" : "text-muted-foreground"
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    step > s.number 
                      ? "bg-primary text-primary-foreground" 
                      : step === s.number 
                        ? "bg-primary/20 border-2 border-primary text-primary" 
                        : "bg-secondary text-muted-foreground"
                  }`}>
                    {step > s.number ? <Check className="w-4 h-4" /> : s.number}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">{s.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-[2px] mx-2 ${
                    step > s.number ? "bg-primary" : "bg-secondary"
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle>Tell us about your company</CardTitle>
                    <CardDescription>
                      This helps us tailor the AI prospect personas to your industry.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Company Name</label>
                      <Input
                        placeholder="e.g., Acme Corp"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Industry</label>
                      <Input
                        placeholder="e.g., SaaS, FinTech, EdTech"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                      />
                    </div>
                    <Button 
                      variant="hero" 
                      onClick={handleNext} 
                      disabled={!companyName || !industry}
                      className="w-full"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle>Upload Sales Recordings</CardTitle>
                    <CardDescription>
                      Upload 5-10 of your best sales calls. We'll analyze them to understand your selling style.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div
                      onClick={handleFileUpload}
                      className="border-2 border-dashed border-border rounded-xl p-12 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
                    >
                      <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="font-medium mb-1">Click to upload recordings</p>
                      <p className="text-sm text-muted-foreground">MP3, WAV, or M4A files (max 100MB each)</p>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2">
                        {uploadedFiles.map((file) => (
                          <div key={file} className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                            <Play className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">{file}</span>
                            <Check className="w-4 h-4 text-success ml-auto" />
                          </div>
                        ))}
                      </div>
                    )}

                    <Button 
                      variant="hero" 
                      onClick={handleNext}
                      disabled={uploadedFiles.length === 0}
                      className="w-full"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle>Add Your Sales Playbook</CardTitle>
                    <CardDescription>
                      Paste your scripts, objection handlers, and value props. This powers the live battlecards.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Playbook Content</label>
                      <Textarea
                        placeholder="Paste your sales playbook, scripts, objection handlers..."
                        value={playbook}
                        onChange={(e) => setPlaybook(e.target.value)}
                        rows={10}
                        className="resize-none"
                      />
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
                      <FileText className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Or upload a document</p>
                        <p className="text-xs text-muted-foreground">PDF, DOCX, or TXT</p>
                      </div>
                      <Button variant="outline" size="sm" className="ml-auto">
                        Upload
                      </Button>
                    </div>
                    <Button 
                      variant="hero" 
                      onClick={handleNext}
                      disabled={!playbook}
                      className="w-full"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card variant="glow">
                  <CardHeader>
                    <CardTitle>Ready to Launch</CardTitle>
                    <CardDescription>
                      Review your setup and activate Caliber for your team.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                        <div className="flex items-center gap-3">
                          <Building2 className="w-5 h-5 text-primary" />
                          <span className="font-medium">Company</span>
                        </div>
                        <span className="text-muted-foreground">{companyName} ({industry})</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                        <div className="flex items-center gap-3">
                          <Play className="w-5 h-5 text-primary" />
                          <span className="font-medium">Recordings</span>
                        </div>
                        <span className="text-muted-foreground">{uploadedFiles.length} files uploaded</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-primary" />
                          <span className="font-medium">Playbook</span>
                        </div>
                        <span className="text-muted-foreground">{playbook.length} characters</span>
                      </div>
                    </div>

                    <Button 
                      variant="hero" 
                      onClick={handleComplete}
                      disabled={isProcessing}
                      className="w-full"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Setting up your workspace...
                        </>
                      ) : (
                        <>
                          Activate Caliber
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default ClientOnboarding;
