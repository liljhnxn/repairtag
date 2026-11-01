import React from "react";
import { RepairStatus, STATUS_META } from "@/lib/contracts";

interface StatusBadgeProps {
  status: RepairStatus;
  size?: "sm" | "md" | "lg";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = "md" }) => {
  const meta = STATUS_META[status] || STATUS_META[RepairStatus.Received];

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs font-medium",
    md: "px-3 py-1 text-xs font-semibold",
    lg: "px-4 py-1.5 text-sm font-semibold",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border backdrop-blur-sm ${meta.badgeClass} ${sizeClasses[size]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass} animate-pulse`} />
      {meta.label}
    </span>
  );
};

