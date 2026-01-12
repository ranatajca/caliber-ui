import { Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Caliber</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              The world's first operating system for liquid sales talent. 
              Replace gut feeling with data-driven AI simulation and real-time oversight.
            </p>
          </div>

          {/* For Talent */}
          <div>
            <h4 className="font-semibold mb-4">For Talent</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/arena" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Sales Arena
                </Link>
              </li>
              <li>
                <Link to="/arena" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Get Verified
                </Link>
              </li>
              <li>
                <Link to="/arena" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  View Opportunities
                </Link>
              </li>
            </ul>
          </div>

          {/* For Clients */}
          <div>
            <h4 className="font-semibold mb-4">For Clients</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/client" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Hire Talent
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/client" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Enterprise
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 Caliber. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
