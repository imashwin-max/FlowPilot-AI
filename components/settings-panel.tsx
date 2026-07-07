"use client";

import { useEffect, useState } from "react";
import { Moon, Save, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function SettingsPanel() {
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState("Demo Manager");
  const [email, setEmail] = useState("manager@flowpilot.ai");
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    setName(localStorage.getItem("flowpilot_profile_name") || "Demo Manager");
    setEmail(localStorage.getItem("flowpilot_profile_email") || "manager@flowpilot.ai");
    setApiKey(localStorage.getItem("flowpilot_gemini_key") || "");
  }, []);

  function save() {
    localStorage.setItem("flowpilot_profile_name", name);
    localStorage.setItem("flowpilot_profile_email", email);
    localStorage.setItem("flowpilot_gemini_key", apiKey);
    toast.success("Settings saved");
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>Gemini API key</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input type="password" value={apiKey} onChange={(event) => setApiKey(event.target.value)} placeholder="AIza..." />
          <p className="text-sm text-muted-foreground">Saved locally in this browser and sent only to FlowPilot workflow API calls.</p>
          <Button onClick={save}><Save className="h-4 w-4" /> Save key</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input value={name} onChange={(event) => setName(event.target.value)} />
          <Input value={email} onChange={(event) => setEmail(event.target.value)} />
          <Button onClick={save}><Save className="h-4 w-4" /> Save profile</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Theme</CardTitle></CardHeader>
        <CardContent className="flex gap-2">
          <Button variant={theme === "light" ? "default" : "outline"} onClick={() => setTheme("light")}><Sun className="h-4 w-4" /> Light</Button>
          <Button variant={theme === "dark" ? "default" : "outline"} onClick={() => setTheme("dark")}><Moon className="h-4 w-4" /> Dark</Button>
          <Button variant={theme === "system" ? "default" : "outline"} onClick={() => setTheme("system")}>System</Button>
        </CardContent>
      </Card>
    </div>
  );
}
