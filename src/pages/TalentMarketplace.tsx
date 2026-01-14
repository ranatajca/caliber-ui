import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Filter, 
  Star, 
  TrendingUp, 
  Award, 
  Briefcase,
  MapPin,
  Clock,
  ChevronRight,
  Zap,
  Target,
  Phone,
  MessageSquare,
  Shield,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";

interface TalentProfile {
  id: string;
  name: string;
  avatar: string;
  caliberId: string;
  overallScore: number;
  scoreChange: number;
  strengths: string[];
  specialties: string[];
  experience: string;
  location: string;
  availability: "available" | "interviewing" | "not-looking";
  lastActive: string;
  callsCompleted: number;
  avgCallScore: number;
  topSkills: {
    name: string;
    score: number;
  }[];
  verified: boolean;
}

const mockTalent: TalentProfile[] = [
  {
    id: "1",
    name: "Sarah Chen",
    avatar: "SC",
    caliberId: "CAL-2847",
    overallScore: 94,
    scoreChange: 3,
    strengths: ["Enterprise Sales", "SaaS", "Objection Handling"],
    specialties: ["C-Suite", "Tech"],
    experience: "7 years",
    location: "San Francisco, CA",
    availability: "available",
    lastActive: "2 hours ago",
    callsCompleted: 342,
    avgCallScore: 91,
    topSkills: [
      { name: "Discovery", score: 96 },
      { name: "Closing", score: 93 },
      { name: "Rapport", score: 92 }
    ],
    verified: true
  },
  {
    id: "2",
    name: "Marcus Johnson",
    avatar: "MJ",
    caliberId: "CAL-1592",
    overallScore: 91,
    scoreChange: 5,
    strengths: ["SMB Sales", "Fintech", "Demo Skills"],
    specialties: ["Financial Services", "Healthcare"],
    experience: "5 years",
    location: "New York, NY",
    availability: "interviewing",
    lastActive: "1 day ago",
    callsCompleted: 256,
    avgCallScore: 88,
    topSkills: [
      { name: "Objection Handling", score: 94 },
      { name: "Product Demo", score: 91 },
      { name: "Follow-up", score: 89 }
    ],
    verified: true
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    avatar: "ER",
    caliberId: "CAL-3721",
    overallScore: 89,
    scoreChange: -1,
    strengths: ["Cold Calling", "Lead Gen", "Persistence"],
    specialties: ["Startups", "E-commerce"],
    experience: "3 years",
    location: "Austin, TX",
    availability: "available",
    lastActive: "5 hours ago",
    callsCompleted: 189,
    avgCallScore: 85,
    topSkills: [
      { name: "Cold Outreach", score: 95 },
      { name: "Tonality", score: 88 },
      { name: "Qualification", score: 86 }
    ],
    verified: false
  },
  {
    id: "4",
    name: "David Kim",
    avatar: "DK",
    caliberId: "CAL-4892",
    overallScore: 87,
    scoreChange: 2,
    strengths: ["Technical Sales", "AI/ML Products", "Solution Selling"],
    specialties: ["Enterprise Tech", "Cloud"],
    experience: "6 years",
    location: "Seattle, WA",
    availability: "available",
    lastActive: "3 hours ago",
    callsCompleted: 298,
    avgCallScore: 84,
    topSkills: [
      { name: "Technical Knowledge", score: 97 },
      { name: "Complex Sales", score: 90 },
      { name: "Discovery", score: 85 }
    ],
    verified: true
  },
  {
    id: "5",
    name: "Lisa Thompson",
    avatar: "LT",
    caliberId: "CAL-5123",
    overallScore: 85,
    scoreChange: 4,
    strengths: ["Relationship Building", "Account Management", "Upselling"],
    specialties: ["Real Estate", "Insurance"],
    experience: "8 years",
    location: "Chicago, IL",
    availability: "not-looking",
    lastActive: "1 week ago",
    callsCompleted: 412,
    avgCallScore: 83,
    topSkills: [
      { name: "Relationship Building", score: 96 },
      { name: "Retention", score: 91 },
      { name: "Cross-selling", score: 88 }
    ],
    verified: true
  }
];

const strengthFilters = [
  "All Strengths",
  "Enterprise Sales",
  "SMB Sales",
  "Cold Calling",
  "Objection Handling",
  "Technical Sales",
  "SaaS",
  "Fintech",
  "Demo Skills"
];

const specialtyFilters = [
  "All Industries",
  "Tech",
  "Financial Services",
  "Healthcare",
  "E-commerce",
  "Real Estate",
  "Startups"
];

const TalentMarketplace = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [strengthFilter, setStrengthFilter] = useState("All Strengths");
  const [specialtyFilter, setSpecialtyFilter] = useState("All Industries");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  const filteredTalent = mockTalent.filter(talent => {
    const matchesSearch = talent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      talent.strengths.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      talent.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStrength = strengthFilter === "All Strengths" || 
      talent.strengths.includes(strengthFilter);
    
    const matchesSpecialty = specialtyFilter === "All Industries" ||
      talent.specialties.some(s => s.toLowerCase().includes(specialtyFilter.toLowerCase()));
    
    const matchesAvailability = availabilityFilter === "all" ||
      talent.availability === availabilityFilter;

    return matchesSearch && matchesStrength && matchesSpecialty && matchesAvailability;
  });

  const getAvailabilityBadge = (availability: TalentProfile["availability"]) => {
    switch (availability) {
      case "available":
        return <Badge className="bg-success/10 text-success border-success/20">Available</Badge>;
      case "interviewing":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Interviewing</Badge>;
      case "not-looking":
        return <Badge variant="secondary">Not Looking</Badge>;
    }
  };

  const handleContact = (talent: TalentProfile) => {
    toast.success(`Contact request sent to ${talent.name}!`);
  };

  const handleViewProfile = (talent: TalentProfile) => {
    toast.info(`Viewing ${talent.name}'s full profile...`);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Talent Marketplace</h1>
          <p className="text-muted-foreground mt-1">
            Discover top sales talent verified by Caliber scores
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Shield className="w-3 h-3" />
            {mockTalent.filter(t => t.verified).length} Verified Reps
          </Badge>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockTalent.length}</p>
                <p className="text-sm text-muted-foreground">Available Reps</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">89</p>
                <p className="text-sm text-muted-foreground">Avg Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Industries</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">48h</p>
                <p className="text-sm text-muted-foreground">Avg Response</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, skill, or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={strengthFilter} onValueChange={setStrengthFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Strength" />
              </SelectTrigger>
              <SelectContent>
                {strengthFilters.map(filter => (
                  <SelectItem key={filter} value={filter}>{filter}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                {specialtyFilters.map(filter => (
                  <SelectItem key={filter} value={filter}>{filter}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="interviewing">Interviewing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Talent Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredTalent.map((talent) => (
          <Card key={talent.id} className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer" onClick={() => handleViewProfile(talent)}>
            <CardContent className="p-5">
              <div className="flex gap-4">
                {/* Avatar & Score */}
                <div className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xl font-bold text-primary">
                      {talent.avatar}
                    </div>
                    {talent.verified && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <div className={`text-2xl font-bold ${
                    talent.overallScore >= 90 ? "text-success" : 
                    talent.overallScore >= 80 ? "text-primary" : "text-warning"
                  }`}>
                    {talent.overallScore}
                  </div>
                  <div className={`flex items-center gap-1 text-xs ${talent.scoreChange >= 0 ? "text-success" : "text-destructive"}`}>
                    <TrendingUp className={`w-3 h-3 ${talent.scoreChange < 0 && "rotate-180"}`} />
                    {talent.scoreChange > 0 ? "+" : ""}{talent.scoreChange}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{talent.name}</h3>
                      <p className="text-xs text-muted-foreground">{talent.caliberId}</p>
                    </div>
                    {getAvailabilityBadge(talent.availability)}
                  </div>

                  {/* Strengths */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {talent.strengths.map(strength => (
                      <Badge key={strength} variant="secondary" className="text-xs">
                        {strength}
                      </Badge>
                    ))}
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5" />
                      {talent.experience}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {talent.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      {talent.callsCompleted} calls
                    </span>
                  </div>

                  {/* Top Skills */}
                  <div className="space-y-1.5">
                    {talent.topSkills.slice(0, 2).map(skill => (
                      <div key={skill.name} className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-24 truncate">{skill.name}</span>
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${skill.score}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium w-8">{skill.score}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  Active {talent.lastActive}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleViewProfile(talent); }}>
                    View Profile
                  </Button>
                  <Button size="sm" onClick={(e) => { e.stopPropagation(); handleContact(talent); }} className="gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Contact
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTalent.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No talent found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search query</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TalentMarketplace;
