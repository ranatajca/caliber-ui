import { motion } from "framer-motion";
import { Brain, Chrome, Phone, Database, Users, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Brain,
    title: "The Filter",
    description: "AI-powered sales simulations that verify candidate skills through realistic roleplays",
    details: ["B2B Enterprise Track", "B2C High-Ticket Track", "0-100 Scouting Reports"]
  },
  {
    icon: Chrome,
    title: "The Sidecar",
    description: "Chrome extension that lives inside your CRM with live scripts and battlecards",
    details: ["DOM Injection", "Context Switching", "Real-time Objection Help"]
  },
  {
    icon: Phone,
    title: "The Dialer",
    description: "One-click calling with automatic recording and CRM write-back",
    details: ["Twilio Integration", "Auto-Recording", "Activity Sync"]
  },
  {
    icon: Database,
    title: "Unified API",
    description: "Connect once, work with any CRM through intelligent middleware",
    details: ["Salesforce", "HubSpot", "Zoho", "Pipedrive"]
  },
  {
    icon: Users,
    title: "Talent Pool",
    description: "Access pre-verified sales professionals ready to sell on day one",
    details: ["Verified Scores", "Skill Matching", "Instant Deployment"]
  },
  {
    icon: Target,
    title: "Performance AI",
    description: "Every call scored, analyzed, and optimized in real-time",
    details: ["100% Coverage", "Trend Analysis", "Coach Recommendations"]
  }
];

const Features = () => {
  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black mb-4">
            <span className="text-foreground">Three Components.</span>{" "}
            <span className="text-gradient-primary">One System.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Caliber digitizes the entire lifecycle of a salesperson—from verification to live oversight.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card variant="elevated" className="h-full hover:border-primary/30 group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.details.map((detail) => (
                      <li key={detail} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
