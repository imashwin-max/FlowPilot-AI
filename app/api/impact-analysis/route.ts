import { NextRequest, NextResponse } from "next/server";
import { mockTeamMembers, mockProjects } from "@/lib/mock-team-data";
import { ImpactAnalysis } from "@/lib/impact-analyzer";

function calculateImpactScore(
  employeeId: string,
  startDate: string, 
  endDate: string
): ImpactAnalysis {
  const employee = mockTeamMembers.find(tm => tm.id === employeeId);
  if (!employee) {
    throw new Error("Employee not found");
  }

  // Get employee's projects
  const employeeProjects = mockProjects.filter(p => 
    employee.projectIds.includes(p.id)
  );

  // Start with base impact from criticality
  let impactScore = employee.criticalityScore * 8;

  // Analyze affected projects
  const affectedProjects = employeeProjects.map(project => {
    let projectImpact: "low" | "medium" | "high" | "critical" = "low";
    let delayDays = 0;

    // Check for unique skills (only this person has the skill)
    const employeeUniqueSkills = employee.skills.filter(skill => {
      const othersWithSkill = mockTeamMembers.filter(tm => 
        tm.id !== employee.id && 
        tm.skills.includes(skill) &&
        project.teamMemberIds.includes(tm.id)
      );
      return othersWithSkill.length === 0;
    });

    // Critical impact if they have unique skills
    if (employeeUniqueSkills.length > 0) {
      projectImpact = "critical";
      delayDays = 5;
      impactScore += 25;
    } else if (project.priority === "critical") {
      projectImpact = "high"; 
      delayDays = 2;
      impactScore += 15;
    } else if (project.priority === "high") {
      projectImpact = "medium";
      delayDays = 1;
      impactScore += 8;
    } else {
      impactScore += 3;
    }

    return {
      projectId: project.id,
      projectName: project.name,
      impactLevel: projectImpact,
      delayDays: delayDays > 0 ? delayDays : undefined
    };
  });

  // Calculate team capacity drop
  const totalTeamSize = mockTeamMembers.length;
  const teamCapacityDrop = Math.round((employee.criticalityScore / 45) * 100);

  // Find skill gaps
  const skillGaps = employee.skills.filter(skill => {
    const othersWithSkill = mockTeamMembers.filter(tm => 
      tm.id !== employee.id && tm.skills.includes(skill)
    );
    return othersWithSkill.length <= 1;
  });

  // Generate better alternative dates
  const nextWeekStart = new Date(Date.parse(startDate) + 7 * 24 * 60 * 60 * 1000)
    .toISOString().split('T')[0];
  const nextWeekEnd = new Date(Date.parse(endDate) + 7 * 24 * 60 * 60 * 1000)
    .toISOString().split('T')[0];
  
  const prevWeekStart = new Date(Date.parse(startDate) - 7 * 24 * 60 * 60 * 1000)
    .toISOString().split('T')[0];
  const prevWeekEnd = new Date(Date.parse(endDate) - 7 * 24 * 60 * 60 * 1000)
    .toISOString().split('T')[0];

  const suggestedAlternatives = [
    {
      startDate: nextWeekStart,
      endDate: nextWeekEnd,
      impactScore: Math.max(15, impactScore - 25),
      reason: "Lower project activity period"
    },
    {
      startDate: prevWeekStart, 
      endDate: prevWeekEnd,
      impactScore: Math.max(10, impactScore - 20),
      reason: "Before critical project milestones"
    }
  ];

  // Coverage options
  const coverageOptions = employee.skills.map(skill => ({
    skill,
    availableBackups: mockTeamMembers
      .filter(tm => tm.id !== employee.id && tm.skills.includes(skill))
      .map(tm => tm.name)
  }));

  return {
    impactScore: Math.min(100, impactScore),
    affectedProjects,
    skillGaps,
    teamCapacityDrop,
    suggestedAlternatives,
    criticalMeetings: Math.floor(Math.random() * 4) + 2,
    coverageOptions
  };
}

export async function POST(request: NextRequest) {
  try {
    const { employeeId, startDate, endDate } = await request.json();

    if (!employeeId || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const analysis = calculateImpactScore(employeeId, startDate, endDate);

    return NextResponse.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error("Impact analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze impact" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    teamMembers: mockTeamMembers,
    projects: mockProjects
  });
}
