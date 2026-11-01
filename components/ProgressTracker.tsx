import React from "react";
import { RepairStatus } from "@/lib/contracts";
import { CheckCircle2, Clock, AlertTriangle, Wrench, PackageCheck, Eye } from "lucide-react";

interface ProgressTrackerProps {
  status: RepairStatus;
}

const STAGES = [
  { status: RepairStatus.Received, label: "Received", icon: Clock },
  { status: RepairStatus.Diagnosing, label: "Diagnosing", icon: Eye },
  { status: RepairStatus.InRepair, label: "In Repair", icon: Wrench },
  { status: RepairStatus.ReadyForPickup, label: "Ready for Pickup", icon: PackageCheck },
  { status: RepairStatus.Completed, label: "Completed", icon: CheckCircle2 },
];

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ status }) => {
  if (status === RepairStatus.Cancelled) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-4 text-center">
        <div className="flex items-center justify-center gap-2 text-red-400 font-medium">
          <AlertTriangle className="h-5 w-5" />
          <span>This repair was marked as Cancelled</span>
        </div>
        <p className="text-xs text-red-400/80 mt-1">
          No further updates will be made to this repair order.
        </p>
      </div>
    );
  }

  const currentStepIndex = STAGES.findIndex((s) => s.status === status);

  return (
    <div className="w-full py-4">
      <div className="relative flex items-center justify-between">
        {/* Background track line */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-charcoal-700 -z-0" />

        {/* Active progress line */}
        <div
          className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-brandPurple to-brandGreen transition-all duration-500 -z-0"
          style={{
            width: `calc(${(Math.max(0, currentStepIndex) / (STAGES.length - 1)) * 100}% - 48px * ${
              currentStepIndex / (STAGES.length - 1)
            })`,
          }}
        />

        {STAGES.map((stage, idx) => {
          const isDone = currentStepIndex > idx;
          const isCurrent = currentStepIndex === idx;
          const isPending = currentStepIndex < idx;
          const Icon = stage.icon;

          return (
            <div key={stage.status} className="flex flex-col items-center relative z-10">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  isCurrent
                    ? "border-brandGreen bg-charcoal-900 text-brandGreen shadow-lg shadow-brandGreen/20 ring-4 ring-brandGreen/10 scale-110"
                    : isDone
                    ? "border-brandPurple bg-brandPurple/20 text-brandPurple-light"
                    : "border-charcoal-700 bg-charcoal-850 text-gray-500"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="h-5 w-5 text-brandGreen" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium text-center max-w-[70px] sm:max-w-none transition-colors ${
                  isCurrent
                    ? "text-brandGreen font-semibold"
                    : isDone
                    ? "text-gray-300"
                    : "text-gray-500"
                }`}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

