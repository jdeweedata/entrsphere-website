"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Users, Clock } from "@phosphor-icons/react";

export function ScarcitySection() {
  const stats = useQuery(api.waitlist.getStats);

  return (
    <section className="py-16 bg-blue-50">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-4">
          Limited cohort access
        </h2>
        <p className="text-slate-600 text-center mb-8 max-w-2xl mx-auto">
          We release access in small batches to ensure quality onboarding and
          accurate benchmark data. Each cohort is capped at 25 founders.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-xl mx-auto">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-blue-100 flex items-center gap-4 w-full sm:w-auto">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" weight="fill" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Cohort {stats?.currentCohort || 1}</p>
              <p className="text-lg font-semibold text-slate-900">
                {stats?.spotsLeftInCohort || 2} spots left
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex items-center gap-4 w-full sm:w-auto">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-slate-600" weight="fill" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Cohort {(stats?.currentCohort || 1) + 1}</p>
              <p className="text-lg font-semibold text-slate-900">Waitlist open</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
