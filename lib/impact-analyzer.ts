export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  skills: string[];
  criticalityScore: number; // 1-10, how critical they are
  projectIds: string[];
}

export interface Project {
  id: string;
  name: string;
  priority: "low" | "medium" | "high" | "critical";
  deadline: string;
  requiredSkills: string[];
  teamMemberIds: string[];
  status: "planning" | "active" | "on-hold" | "completed";
}

export interface ImpactAnalysis {
  impactScore: number; // 0-100
  affectedProjects: {
    projectId: string;
    projectName: string;
    impactLevel: "low" | "medium" | "high" | "critical";
    delayDays?: number;
  }[];
  skillGaps: string[];
  teamCapacityDrop: number; // percentage
  suggestedAlternatives: {
    startDate: string;
    endDate: string;
    impactScore: number;
    reason: string;
  }[];
  criticalMeetings: number;
  coverageOptions: {
    skill: string;
    availableBackups: string[];
  }[];
}
