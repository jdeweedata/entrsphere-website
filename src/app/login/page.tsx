import type { Metadata } from "next";
import Image from "next/image";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your EntrSphere account to access the admin dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Image
            src="/entrsphere_asset_icon_transparent.webp"
            alt="EntrSphere Logo"
            width={48}
            height={48}
            className="w-12 h-12 mx-auto mb-4"
          />
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Sign in to your account
          </h2>
          <p className="text-slate-600">Access the admin dashboard</p>
        </div>
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
