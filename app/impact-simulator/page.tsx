import { AppShell } from "@/components/app-shell";
import { ImpactSimulator } from "@/components/impact-simulator";

export const dynamic = "force-dynamic";

export default function StandaloneImpactSimulatorPage() {
  return (
    <AppShell>
      <div className="pb-16 lg:pb-0 animate-fade-up">
        <ImpactSimulator />
      </div>
    </AppShell>
  );
}
