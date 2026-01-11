import type { Metadata } from "next";
import DashboardContentWrapper from "@/components/wrappers/DashboardContentWrapper";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "EntrSphere Admin Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardPage() {
  return <DashboardContentWrapper />;
}
