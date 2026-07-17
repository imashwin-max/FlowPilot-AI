"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingDown,
  Users,
  Calendar,
  Zap,
  ArrowRight,
  BarChart3
} from 'lucide-react';
import { 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import { Card, CardContent } from "@/components/ui/card";

interface ImpactResult {
  impactScore: number;
  affectedProjects: Array<{
    projectName: string;
    impactLevel: string;
    delayDays?: number;
  }>;
  teamCapacityDrop: number;
  criticalMeetings: number;
  suggestedAlternatives: Array<{
    startDate: string;
    endDate: string;
    impactScore: number;
    reason: string;
  }>;
  skillGaps: string[];
  coverageOptions: Array<{
    skill: string;
    availableBackups: string[];
  }>;
}

const teamMembers = [
  { id: 'tm-1', name: 'Sarah Chen', role: 'Senior Frontend Developer', criticalityScore: 9, avatar: '👩‍💻' },
  { id: 'tm-2', name: 'Marcus Johnson', role: 'Backend Engineer', criticalityScore: 8, avatar: '👨‍💻' },
  { id: 'tm-3', name: 'Lisa Wang', role: 'DevOps Engineer', criticalityScore: 9, avatar: '👩‍🔧' },
  { id: 'tm-4', name: 'Tom Rodriguez', role: 'Junior Developer', criticalityScore: 4, avatar: '👨‍🎓' },
  { id: 'tm-5', name: 'Emma Davis', role: 'Product Manager', criticalityScore: 7, avatar: '👩‍💼' },
];

export function ImpactSimulator({ hideHeader = false }: { hideHeader?: boolean }) {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [result, setResult] = useState<ImpactResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);

  const selectedMember = teamMembers.find(m => m.id === selectedEmployee);

  // Real-time analysis
  useEffect(() => {
    if (selectedEmployee && startDate && endDate) {
      const timeoutId = setTimeout(analyzeImpact, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [selectedEmployee, startDate, endDate]);

  // Animate score counter
  useEffect(() => {
    if (result) {
      setAnimatedScore(0);
      const target = result.impactScore;
      const duration = 1200;
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setAnimatedScore(target);
          clearInterval(timer);
        } else {
          setAnimatedScore(Math.round(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [result]);

  const analyzeImpact = async () => {
    if (!selectedEmployee || !startDate || !endDate) return;
    setLoading(true);
    try {
      const response = await fetch('/api/impact-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId: selectedEmployee, startDate, endDate })
      });
      const data = await response.json();
      setResult(data.analysis);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const getImpactConfig = (score: number) => {
    if (score >= 80) return {
      color: '#ef4444',
      bg: 'from-red-500 to-red-600',
      lightBg: 'bg-red-500/10',
      border: 'border-red-500/20',
      text: 'text-red-500',
      label: 'CRITICAL IMPACT',
      icon: <AlertTriangle className="w-9 h-9" />,
      description: 'This leave request will severely impact team operations and core milestones.'
    };
    if (score >= 60) return {
      color: '#f97316',
      bg: 'from-orange-500 to-orange-600',
      lightBg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
      text: 'text-orange-500',
      label: 'HIGH IMPACT',
      icon: <Clock className="w-9 h-9" />,
      description: 'Significant disruption is expected across active software sprint deliverables.'
    };
    if (score >= 40) return {
      color: '#f59e0b',
      bg: 'from-amber-500 to-amber-600',
      lightBg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      text: 'text-amber-500',
      label: 'MEDIUM IMPACT',
      icon: <Zap className="w-9 h-9" />,
      description: 'Disruption is expected, but manageable with active backup coverages.'
    };
    return {
      color: '#10b981',
      bg: 'from-emerald-500 to-emerald-600',
      lightBg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      text: 'text-emerald-500',
      label: 'LOW IMPACT',
      icon: <CheckCircle className="w-9 h-9" />,
      description: 'Minimal impact identified. Ready for safe manager approvals.'
    };
  };

  return (
    <div className="w-full text-foreground space-y-6">
      {/* Header (optional) */}
      {!hideHeader && (
        <div className="border-b border-border/40 pb-5">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Zap className="h-7 w-7 text-primary" /> AI Team Impact Simulator
          </h1>
          <p className="text-muted-foreground text-xs mt-1">
            Simulate and predict department leave request impacts with real-time AI capacity analysis.
          </p>
        </div>
      )}

      {/* Control Panel Card */}
      <Card className="p-6 relative overflow-hidden bg-card border-border/45">
        <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
          <Users className="w-4.5 h-4.5 text-primary" />
          Configure Simulator Parameters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Employee Select */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Select Team Member
            </label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full bg-background border border-border/60 rounded-lg px-3 py-2 text-xs font-medium text-foreground focus:ring-1 focus:ring-primary focus:border-transparent outline-none h-10 transition-all"
            >
              <option value="">Choose employee...</option>
              {teamMembers.map(member => (
                <option key={member.id} value={member.id} className="bg-card text-foreground">
                  {member.avatar} {member.name} ({member.role})
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Simulated Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-background border border-border/60 rounded-lg px-3 py-2 text-xs font-medium text-foreground focus:ring-1 focus:ring-primary focus:border-transparent outline-none h-10 transition-all"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Simulated End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-background border border-border/60 rounded-lg px-3 py-2 text-xs font-medium text-foreground focus:ring-1 focus:ring-primary focus:border-transparent outline-none h-10 transition-all"
            />
          </div>
        </div>

        {/* Selected Employee Info */}
        <AnimatePresence>
          {selectedMember && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-5 border border-primary/10 bg-primary/5 rounded-lg p-4"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl shrink-0">{selectedMember.avatar}</span>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">{selectedMember.name}</h3>
                    <p className="text-primary text-xs font-semibold">{selectedMember.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-extrabold text-primary">
                    {selectedMember.criticalityScore}/10
                  </div>
                  <div className="text-[10px] uppercase font-bold text-muted-foreground">Criticality Index</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Loading Indicator */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center py-8"
          >
            <div className="inline-flex items-center gap-2.5 bg-card border border-border/40 rounded-lg px-5 py-3 shadow-md">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span className="text-xs text-foreground font-semibold">AI resolving project dependencies...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Display */}
      <AnimatePresence>
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Primary Scores & Counters */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Radial Config Score */}
              <Card className={`lg:col-span-1 bg-gradient-to-br ${getImpactConfig(result.impactScore).bg} text-white p-6 text-center flex flex-col justify-between items-center shadow-lg border-0`}>
                <div className="flex flex-col items-center mt-2">
                  <div className="p-2.5 bg-white/20 rounded-full mb-3">
                    {getImpactConfig(result.impactScore).icon}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">Overall Impact Rating</div>
                  <div className="text-6xl font-black mt-2 tracking-tight">
                    {animatedScore}
                  </div>
                  <div className="text-xs opacity-75 font-semibold mt-1">out of 100</div>
                </div>

                <div className="w-full mt-6 space-y-3">
                  <div className="text-xs font-bold bg-white/20 rounded-md py-1.5 px-3 uppercase tracking-wider">
                    {getImpactConfig(result.impactScore).label}
                  </div>
                  <p className="text-xs opacity-85 leading-relaxed">
                    {getImpactConfig(result.impactScore).description}
                  </p>
                </div>
              </Card>

              {/* Stats Grid */}
              <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                {[
                  {
                    icon: <TrendingDown className="w-5 h-5" />,
                    label: 'Capacity Drop',
                    value: `${result.teamCapacityDrop}%`,
                    color: 'text-orange-500 dark:text-orange-400',
                    bg: 'bg-orange-500/10 border-orange-500/10'
                  },
                  {
                    icon: <Users className="w-5 h-5" />,
                    label: 'Blocked Meetings',
                    value: result.criticalMeetings,
                    color: 'text-red-500 dark:text-red-400',
                    bg: 'bg-red-500/10 border-red-500/10'
                  },
                  {
                    icon: <BarChart3 className="w-5 h-5" />,
                    label: 'Affected Projects',
                    value: result.affectedProjects.length,
                    color: 'text-purple-500 dark:text-purple-400',
                    bg: 'bg-purple-500/10 border-purple-500/10'
                  },
                  {
                    icon: <Zap className="w-5 h-5" />,
                    label: 'Skill Gaps Exposed',
                    value: result.skillGaps.length,
                    color: 'text-amber-500 dark:text-amber-400',
                    bg: 'bg-amber-500/10 border-amber-500/10'
                  }
                ].map((stat, i) => (
                  <Card key={i} className={`p-5 flex flex-col justify-between border ${stat.bg} shadow-sm`}>
                    <div className={`${stat.color} p-1.5 bg-background/50 rounded-lg w-fit`}>{stat.icon}</div>
                    <div className="mt-4">
                      <div className={`text-3xl font-extrabold tracking-tight ${stat.color}`}>{stat.value}</div>
                      <div className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider mt-1">{stat.label}</div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Project Details & Alternates */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Project Impacts list */}
              <Card className="p-6 bg-card border-border/45 shadow-sm">
                <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-4.5 h-4.5 text-red-500" />
                  Project Milestones Impact
                </h3>
                <div className="space-y-3">
                  {result.affectedProjects.map((project, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg border-l-4 flex justify-between items-center ${
                        project.impactLevel === 'critical'
                          ? 'border-red-500 bg-red-500/5'
                          : project.impactLevel === 'high'
                          ? 'border-orange-500 bg-orange-500/5'
                          : 'border-amber-500 bg-amber-500/5'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs text-foreground">{project.projectName}</div>
                        <div className={`text-[10px] uppercase font-bold tracking-wider mt-0.5 ${
                          project.impactLevel === 'critical' ? 'text-red-500' :
                          project.impactLevel === 'high' ? 'text-orange-500' : 'text-amber-500'
                        }`}>
                          {project.impactLevel} severity
                        </div>
                      </div>
                      {project.delayDays && (
                        <div className="text-right">
                          <div className="text-red-500 font-extrabold text-sm">+{project.delayDays}d Delay</div>
                          <div className="text-[9px] text-muted-foreground uppercase font-bold">estimated risk</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              {/* AI Alternatives suggested */}
              <Card className="p-6 bg-card border-border/45 shadow-sm">
                <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                  <Calendar className="w-4.5 h-4.5 text-emerald-500" />
                  AI Suggested Safe Windows
                </h3>
                <div className="space-y-3">
                  {result.suggestedAlternatives.map((alt, i) => (
                    <div
                      key={i}
                      className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg hover:bg-emerald-500/10 transition-colors cursor-pointer group flex justify-between items-center"
                    >
                      <div className="flex-1 pr-4">
                        <div className="font-bold text-xs text-emerald-600 dark:text-emerald-400">
                          {alt.startDate} &rarr; {alt.endDate}
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{alt.reason}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-emerald-500 font-extrabold text-sm">{alt.impactScore}/100</div>
                        <div className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider">
                          -{result.impactScore - alt.impactScore} pts risk
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Backups coverage detail */}
            <Card className="p-6 bg-card border-border/45 shadow-sm">
              <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                <Users className="w-4.5 h-4.5 text-primary" />
                Staff Skill Backup Analysis
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {result.coverageOptions.map((coverage, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-lg border flex flex-col justify-between min-h-[110px] ${
                      coverage.availableBackups.length === 0
                        ? 'border-red-500/15 bg-red-500/5'
                        : 'border-emerald-500/15 bg-emerald-500/5'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-foreground tracking-tight">{coverage.skill}</div>
                      <div className={`text-[9px] uppercase font-bold mt-1 tracking-wider ${
                        coverage.availableBackups.length === 0 ? 'text-red-500' : 'text-emerald-500'
                      }`}>
                        {coverage.availableBackups.length === 0 ? 'No back-up coverage' : 'Coverage available'}
                      </div>
                    </div>
                    {coverage.availableBackups.length > 0 ? (
                      <div className="mt-2 text-[10px] text-muted-foreground leading-normal">
                        Backups: {coverage.availableBackups.join(', ')}
                      </div>
                    ) : (
                      <div className="mt-2 text-[10px] text-red-500/80 font-medium">SLA breach risk active.</div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!result && !loading && (
        <div className="text-center py-16 border border-dashed border-border/60 rounded-xl bg-card/25 backdrop-blur-sm">
          <div className="text-4xl mb-3 animate-bounce">🎯</div>
          <h3 className="text-sm font-bold text-muted-foreground mb-1">
            Input leave dates & team member to start simulation
          </h3>
          <p className="text-xs text-muted-foreground/70 max-w-sm mx-auto leading-relaxed">
            The AI engine checks active Jira scopes, DevOps criticality indices, and suggests alternative windows automatically.
          </p>
        </div>
      )}
    </div>
  );
}
