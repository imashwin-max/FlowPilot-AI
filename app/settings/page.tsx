import { AppShell } from "@/components/app-shell";
import { SettingsPanel } from "@/components/settings-panel";

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="space-y-6 pb-16 lg:pb-0">
        <div>
          <h1 className="text-3xl font-semibold">Settings</h1>
          <p className="text-muted-foreground">Configure Gemini, profile identity, and presentation theme.</p>
        </div>
        <SettingsPanel />
      </div>
    </AppShell>
  );
}
