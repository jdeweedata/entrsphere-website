"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { ReactNode } from "react";

interface AuthFormWrapperProps {
  children: ReactNode;
}

export function AuthFormWrapper({ children }: AuthFormWrapperProps) {
  return <AuthProvider>{children}</AuthProvider>;
}
