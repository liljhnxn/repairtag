"use client";

import React, { useState } from "react";
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from "wagmi";
import { Wrench, Shield, Wallet, LogOut, ChevronDown, Check } from "lucide-react";
import { shortenAddress } from "@/lib/contracts";
import { botchainTestnet } from "@/lib/chains";

export const Header: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isCorrectNetwork = chainId === botchainTestnet.id;

  const handleConnect = () => {
    const injectedConnector = connectors.find((c) => c.id === "injected") || connectors[0];
    if (injectedConnector) {
      connect({ connector: injectedConnector });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-charcoal-700/60 bg-charcoal-900/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brandPurple to-brandGreen p-0.5 shadow-lg shadow-brandPurple/20">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-charcoal-900">
              <Wrench className="h-5 w-5 text-brandGreen" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white">
                Repair<span className="text-brandPurple-light">Tag</span>
              </span>
              <span className="hidden sm:inline-block rounded border border-brandPurple/30 bg-brandPurple/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brandPurple-light">
                Botchain
              </span>
            </div>
            <p className="text-xs text-gray-400">Every repair, tracked.</p>
          </div>
        </div>

        {/* Right action area */}
        <div className="flex items-center gap-3">
          {/* Network indicator */}
          {isConnected && (
            <div className="hidden md:flex items-center">
              {isCorrectNetwork ? (
                <div className="flex items-center gap-1.5 rounded-lg border border-charcoal-700 bg-charcoal-850 px-3 py-1.5 text-xs text-gray-300">
                  <span className="h-2 w-2 rounded-full bg-brandGreen shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
                  <span>Botchain Testnet</span>
                </div>
              ) : (
                <button
                  onClick={() => switchChain?.({ chainId: botchainTestnet.id })}
                  className="flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-400 hover:bg-amber-500/20 transition-colors"
                >
                  <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                  <span>Switch to Botchain</span>
                </button>
              )}
            </div>
          )}

          {/* Wallet button */}
          {!isConnected ? (
            <button
              onClick={handleConnect}
              disabled={isPending}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-brandPurple to-brandGreen p-px font-medium shadow-md transition-all duration-300 hover:shadow-brandPurple/25 disabled:opacity-50"
            >
              <div className="inline-flex h-full w-full items-center gap-2 rounded-[11px] bg-charcoal-900 px-4 py-2 text-sm text-white transition-all group-hover:bg-opacity-80">
                <Wallet className="h-4 w-4 text-brandPurple-light" />
                <span>{isPending ? "Connecting..." : "Connect Wallet"}</span>
              </div>
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-xl border border-charcoal-700 bg-charcoal-850 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:border-brandPurple/40"
              >
                <div className="h-2 w-2 rounded-full bg-brandGreen" />
                <span>{shortenAddress(address || "")}</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-xl border border-charcoal-700 bg-charcoal-850 p-1.5 shadow-xl shadow-black/50 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <div className="px-3 py-2 text-xs border-b border-charcoal-700/60 text-gray-400">
                    Connected as Technician
                  </div>
                  <button
                    onClick={() => {
                      disconnect();
                      setDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Disconnect</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

