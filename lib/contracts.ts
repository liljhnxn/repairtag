import { Address } from "viem";

export enum RepairStatus {
  Received = 0,
  Diagnosing = 1,
  InRepair = 2,
  ReadyForPickup = 3,
  Completed = 4,
  Cancelled = 5,
}

export interface RepairRecord {
  id: bigint;
  technician: Address;
  description: string;
  status: RepairStatus;
  createdAt: bigint;
  updatedAt: bigint;
}

export const STATUS_META: Record<
  RepairStatus,
  {
    label: string;
    description: string;
    badgeClass: string;
    dotClass: string;
    stepIndex: number;
  }
> = {
  [RepairStatus.Received]: {
    label: "Received",
    description: "Device received at the shop and logged on-chain.",
    badgeClass: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    dotClass: "bg-blue-400",
    stepIndex: 0,
  },
  [RepairStatus.Diagnosing]: {
    label: "Diagnosing",
    description: "Technician is diagnosing hardware and software faults.",
    badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    dotClass: "bg-amber-400",
    stepIndex: 1,
  },
  [RepairStatus.InRepair]: {
    label: "In Repair",
    description: "Repair is actively underway and parts are being serviced.",
    badgeClass: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    dotClass: "bg-purple-400",
    stepIndex: 2,
  },
  [RepairStatus.ReadyForPickup]: {
    label: "Ready for Pickup",
    description: "Repair completed and tested. Ready for customer pickup.",
    badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    dotClass: "bg-emerald-400",
    stepIndex: 3,
  },
  [RepairStatus.Completed]: {
    label: "Completed",
    description: "Device has been collected by customer. Job finalized.",
    badgeClass: "bg-green-500/10 text-green-400 border-green-500/30",
    dotClass: "bg-green-400",
    stepIndex: 4,
  },
  [RepairStatus.Cancelled]: {
    label: "Cancelled",
    description: "Repair process was cancelled.",
    badgeClass: "bg-red-500/10 text-red-400 border-red-500/30",
    dotClass: "bg-red-400",
    stepIndex: -1,
  },
};

// Primary verified BOT Chain Mainnet contract address
export const MAINNET_CONTRACT_ADDRESS: Address = "0x33eDC96eC0cF2A367Ea881970b95eF96B1d0F224";

let deployedFallback: Address = MAINNET_CONTRACT_ADDRESS;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const deployment = require("./deployment.json");
  if (deployment?.address && deployment.address !== "0x0000000000000000000000000000000000000000") {
    deployedFallback = deployment.address as Address;
  }
} catch {
  // Fallback to verified mainnet address
}

export const CONTRACT_ADDRESS: Address =
  (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address) ||
  deployedFallback;

export const REPAIR_TAG_ABI = [
  {
    inputs: [],
    name: "EmptyDescription",
    type: "error",
  },
  {
    inputs: [],
    name: "NotTechnician",
    type: "error",
  },
  {
    inputs: [
      { internalType: "uint256", name: "repairId", type: "uint256" },
      { internalType: "uint8", name: "status", type: "uint8" },
    ],
    name: "RepairFinalized",
    type: "error",
  },
  {
    inputs: [{ internalType: "uint256", name: "repairId", type: "uint256" }],
    name: "RepairNotFound",
    type: "error",
  },
  {
    inputs: [{ internalType: "uint8", name: "status", type: "uint8" }],
    name: "SameStatus",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "repairId", type: "uint256" },
      { indexed: true, internalType: "address", name: "technician", type: "address" },
      { indexed: false, internalType: "string", name: "description", type: "string" },
      { indexed: false, internalType: "uint256", name: "createdAt", type: "uint256" },
    ],
    name: "RepairCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "repairId", type: "uint256" },
      { indexed: false, internalType: "uint8", name: "oldStatus", type: "uint8" },
      { indexed: false, internalType: "uint8", name: "newStatus", type: "uint8" },
      { indexed: false, internalType: "uint256", name: "updatedAt", type: "uint256" },
    ],
    name: "RepairStatusUpdated",
    type: "event",
  },
  {
    inputs: [{ internalType: "string", name: "description", type: "string" }],
    name: "createRepair",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "repairId", type: "uint256" }],
    name: "getRepair",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "address", name: "technician", type: "address" },
          { internalType: "string", name: "description", type: "string" },
          { internalType: "uint8", name: "status", type: "uint8" },
          { internalType: "uint256", name: "createdAt", type: "uint256" },
          { internalType: "uint256", name: "updatedAt", type: "uint256" },
        ],
        internalType: "struct RepairTag.Repair",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getMyRepairs",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "address", name: "technician", type: "address" },
          { internalType: "string", name: "description", type: "string" },
          { internalType: "uint8", name: "status", type: "uint8" },
          { internalType: "uint256", name: "createdAt", type: "uint256" },
          { internalType: "uint256", name: "updatedAt", type: "uint256" },
        ],
        internalType: "struct RepairTag.Repair[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalRepairs",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "repairId", type: "uint256" },
      { internalType: "uint8", name: "newStatus", type: "uint8" },
    ],
    name: "updateRepairStatus",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export function shortenAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatDate(timestamp: bigint | number): string {
  const ts = typeof timestamp === "bigint" ? Number(timestamp) : timestamp;
  if (!ts) return "—";
  return new Date(ts * 1000).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
