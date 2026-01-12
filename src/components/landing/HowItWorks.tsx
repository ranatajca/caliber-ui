import { motion } from "framer-motion";
import { Upload, UserCheck, PhoneCall, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Client Onboarding",
    description: "Upload your playbooks, scripts, and sample recordings. Our AI ingests your specific sales context."
  },
  {
    icon: UserCheck,
    step: "02", 
    title: "Talent Verification",
    description: "Candidates enter The Filter—a 15-minute AI roleplay. They're scored 0-100 on objection handling and closing."
  },
  {
    icon: PhoneCall,
    step: "03",
    title: "Live Selling",
    description: "Verified reps use The Sidecar extension to call leads directly from your CRM with real-time coaching."
  },
  {
    icon: BarChart3,
    step: "04",
    title: "Full Transparency",
    description: "Every call is recorded, scored, and synced back to your CRM. 100% visibility into what's said to your leads."
  }
];

const HowItWorks = () => {
  return (
    <section className="py-24 px-4 relative bg-secondary/20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black mb-4">
            <span className="text-foreground">How </span>
            <span className="text-gradient-accent">Caliber</span>
            <span className="text-foreground"> Works</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From ingest to insight in four simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-[2px] bg-gradient-to-r from-primary/50 to-transparent" />
              )}
              
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-card border border-border mb-6 group hover:border-primary/50 transition-colors">
                  <step.icon className="w-10 h-10 text-primary" />
                </div>
                <div className="text-xs font-mono text-primary mb-2">{step.step}</div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
