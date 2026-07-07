"use client";

import type * as React from "react";
import { Toaster as Sonner } from "sonner";

export function Toaster({ ...props }: React.ComponentProps<typeof Sonner>) {
  return <Sonner toastOptions={{ className: "font-sans" }} {...props} />;
}
