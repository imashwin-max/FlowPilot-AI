import { TeamMember, Project } from './impact-analyzer';

export const mockTeamMembers: TeamMember[] = [
  {
    id: "tm-1",
    name: "Sarah Chen",
    email: "sarah.chen@company.com",
    role: "Senior Frontend Developer", 
    skills: ["React", "TypeScript", "Payment Systems", "Team Lead"],
    criticalityScore: 9,
    projectIds: ["proj-1", "proj-2"]
  },
  {
    id: "tm-2",
    name: "Marcus Johnson", 
    email: "marcus.johnson@company.com",
    role: "Backend Engineer",
    skills: ["Node.js", "Python", "Database", "API Design"],
    criticalityScore: 8,
    projectIds: ["proj-1", "proj-3"]
  },
  {
    id: "tm-3",
    name: "Lisa Wang",
    email: "lisa.wang@company.com",
    role: "DevOps Engineer", 
    skills: ["AWS", "Docker", "CI/CD", "Monitoring"],
    criticalityScore: 9,
    projectIds: ["proj-1", "proj-2", "proj-3"]
  },
  {
    id: "tm-4",
    name: "Tom Rodriguez",
    email: "tom.rodriguez@company.com", 
    role: "Junior Developer",
    skills: ["React", "JavaScript", "Testing"],
    criticalityScore: 4,
    projectIds: ["proj-2"]
  },
  {
    id: "tm-5",
    name: "Emma Davis",
    email: "emma.davis@company.com",
    role: "Product Manager",
    skills: ["Product Strategy", "Stakeholder Management", "Analytics"], 
    criticalityScore: 7,
    projectIds: ["proj-1", "proj-2"]
  }
];

export const mockProjects: Project[] = [
  {
    id: "proj-1", 
    name: "Payment System Redesign",
    priority: "critical",
    deadline: "2024-02-15",
    requiredSkills: ["React", "Node.js", "Payment Systems", "Testing"],
    teamMemberIds: ["tm-1", "tm-2", "tm-5"],
    status: "active"
  },
  {
    id: "proj-2",
    name: "Mobile App Launch", 
    priority: "high",
    deadline: "2024-03-01",
    requiredSkills: ["React", "TypeScript", "Product Strategy"],
    teamMemberIds: ["tm-1", "tm-3", "tm-4", "tm-5"],
    status: "active"
  },
  {
    id: "proj-3",
    name: "Infrastructure Upgrade",
    priority: "medium", 
    deadline: "2024-04-01",
    requiredSkills: ["AWS", "Python", "CI/CD"],
    teamMemberIds: ["tm-2", "tm-3"],
    status: "planning"
  }
];
