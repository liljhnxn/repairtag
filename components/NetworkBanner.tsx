"use client";

import React from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { botchainMainnet } from "@/lib/chains";

export const NetworkBanner: React.FC = () => {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  const isMainnet = chainId === botchainMainnet.id;

  if (!isConnected || isMainnet) {
    return null;
  }

  return (
    <div className="border-b border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-amber-200">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
          <span>
            You are connected to an unsupported network. Please switch to{" "}
            <strong>BOT Chain Mainnet (Chain ID {botchainMainnet.id})</strong> to interact with RepairTag.
          </span>
        </div>
        <button
          onClick={() => switchChain({ chainId: botchainMainnet.id })}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1 text-xs font-semibold text-charcoal-950 transition-colors hover:bg-amber-400 disabled:opacity-50"
        >
          <span>{isPending ? "Switching..." : "Switch to BOT Chain"}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
