import type { Metadata } from "next";
import Image from "next/image";
import RegisterForm from "@/components/auth/RegisterForm";
import { AuthFormWrapper } from "@/components/auth/AuthFormWrapper";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your EntrSphere account to join the team.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegisterPage() {
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
            Create your account
          </h2>
          <p className="text-slate-600">Join the EntrSphere team</p>
        </div>
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <AuthFormWrapper>
            <RegisterForm />
          </AuthFormWrapper>
        </div>
      </div>
    </div>
  );
}
