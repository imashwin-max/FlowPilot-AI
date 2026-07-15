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
  const [managerCode, setManagerCode] = useState("");

  useEffect(() => {
    setName(localStorage.getItem("flowpilot_profile_name") || "Demo Manager");
    setEmail(localStorage.getItem("flowpilot_profile_email") || "manager@flowpilot.ai");
    setManagerCode(localStorage.getItem("flowpilot_manager_code") || "");
  }, []);

  function save() {
    localStorage.setItem("flowpilot_profile_name", name);
    localStorage.setItem("flowpilot_profile_email", email);
    localStorage.setItem("flowpilot_manager_code", managerCode);
    toast.success("Settings saved");
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>Manager access code</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="password"
            value={managerCode}
            onChange={(event) => setManagerCode(event.target.value)}
            placeholder="Enter the code shared with managers"
          />
          <p className="text-sm text-muted-foreground">
            Required to approve or reject requests on the Approvals page. Ask your admin for this code -
            it is not stored anywhere except this browser.
          </p>
          <Button onClick={save}><Save className="h-4 w-4" /> Save code</Button>
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
