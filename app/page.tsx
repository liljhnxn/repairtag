"use client";

import React from "react";
import { useAccount, useConnect } from "wagmi";
import { RepairLookup } from "@/components/RepairLookup";
import { TechnicianDashboard } from "@/components/TechnicianDashboard";
import {
  Wrench,
  ShieldCheck,
  Search,
  Zap,
  ArrowRight,
  Sparkles,
  Lock,
  Layers,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";

const MAINNET_CONTRACT = "0x33eDC96eC0cF2A367Ea881970b95eF96B1d0F224";

export default function Home() {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  const handleConnect = () => {
    const injected = connectors.find((c) => c.id === "injected") || connectors[0];
    if (injected) {
      connect({ connector: injected });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Hero section */}
      <section className="text-center pt-4 pb-2 max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-brandPurple/30 bg-brandPurple/10 px-3.5 py-1 text-xs font-semibold text-brandPurple-light shadow-inner">
          <Sparkles className="h-3.5 w-3.5" />
          <span>On-Chain Tracking for Repair Shops</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Trustless Repair Tracking for Modern Workshops
        </h1>

        <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
          Log repair tickets directly on BOT Chain Mainnet. Customers check repair status instantly
          with their Repair ID without phone calls or wallet requirements.
        </p>

        {/* Quick feature pill tags */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-gray-400">
          <div className="flex items-center gap-1.5 rounded-lg border border-charcoal-700 bg-charcoal-850/80 px-3 py-1.5">
            <Search className="h-3.5 w-3.5 text-brandPurple-light" />
            <span>Zero-Wallet Customer Lookup</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-charcoal-700 bg-charcoal-850/80 px-3 py-1.5">
            <Lock className="h-3.5 w-3.5 text-brandGreen" />
            <span>No Customer PII On-Chain</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-brandGreen/40 bg-charcoal-850/80 px-3 py-1.5 text-gray-200">
            <div className="h-4 w-4 shrink-0 overflow-hidden rounded bg-black">
              <Image
                src="/botchain-logo.png"
                alt="BOT Chain Logo"
                width={16}
                height={16}
                className="h-full w-full object-contain"
              />
            </div>
            <span>BOT Chain Mainnet (Chain 677)</span>
          </div>
        </div>
      </section>

      {/* Customer Lookup Section */}
      <RepairLookup />

      {/* Technician Section */}
      {isConnected ? (
        <TechnicianDashboard />
      ) : (
        <section className="rounded-2xl border border-charcoal-700 bg-gradient-to-r from-charcoal-850 to-charcoal-900 p-8 text-center sm:p-10 shadow-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brandPurple/20 text-brandPurple-light mb-4 shadow-lg shadow-brandPurple/10">
            <Wrench className="h-7 w-7" />
          </div>
          <h3 className="text-xl font-bold text-white">Are You a Repair Technician?</h3>
          <p className="mt-2 text-sm text-gray-400 max-w-lg mx-auto">
            Connect your MetaMask wallet to unlock your technician workspace. Create tamper-proof repair
            orders, update diagnostics, and provide real-time updates to your clients.
          </p>
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleConnect}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brandPurple to-brandGreen px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brandPurple/25 hover:opacity-95 transition-all"
            >
              <span>Connect Wallet to Access Workspace</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      )}

      {/* How it works & security guidelines */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="rounded-2xl border border-charcoal-700/80 bg-charcoal-850/40 p-6 backdrop-blur-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brandPurple/20 text-brandPurple-light mb-4">
            <Layers className="h-5 w-5" />
          </div>
          <h4 className="text-base font-bold text-white">1. Technician Logs Job</h4>
          <p className="mt-2 text-xs text-gray-400 leading-relaxed">
            The technician enters device issues (e.g., &quot;MacBook Pro display flex replacement&quot;)
            and an immutable Repair ID is generated on BOT Chain.
          </p>
        </div>

        <div className="rounded-2xl border border-charcoal-700/80 bg-charcoal-850/40 p-6 backdrop-blur-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 mb-4">
            <Zap className="h-5 w-5" />
          </div>
          <h4 className="text-base font-bold text-white">2. Live Status Updates</h4>
          <p className="mt-2 text-xs text-gray-400 leading-relaxed">
            Status advances through 5 clear stages: Received &rarr; Diagnosing &rarr; In Repair &rarr;
            Ready for Pickup &rarr; Completed. Only the original technician can update the record.
          </p>
        </div>

        <div className="rounded-2xl border border-charcoal-700/80 bg-charcoal-850/40 p-6 backdrop-blur-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brandGreen/20 text-brandGreen mb-4">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h4 className="text-base font-bold text-white">3. Zero-Knowledge Customer View</h4>
          <p className="mt-2 text-xs text-gray-400 leading-relaxed">
            Customers check status without connecting a Web3 wallet or creating an account. No
            names, phone numbers, or addresses are ever stored on-chain.
          </p>
        </div>
      </section>

      {/* BOT Chain Ecosystem Section */}
      <section className="rounded-2xl border border-charcoal-700 bg-charcoal-850/80 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-brandGreen/40 bg-black p-1.5 shadow-lg shadow-brandGreen/20">
              <Image
                src="/botchain-logo.png"
                alt="BOT Chain Official Logo"
                width={56}
                height={56}
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Powered by BOT Chain</h3>
                <span className="rounded-full bg-brandGreen/10 border border-brandGreen/30 px-2 py-0.5 text-xs font-semibold text-brandGreen">
                  Mainnet Live
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-400 max-w-xl">
                RepairTag is deployed natively on BOT Chain (Chain ID: 677, Native Token: BOT), delivering sub-second finality, micro-gas operations, and public transparency.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* BOT Chain website with Logo at front */}
            <a
              href="https://botchain.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-xl border border-charcoal-700 bg-charcoal-900 px-4 py-2.5 text-xs font-semibold text-white hover:border-brandPurple hover:bg-charcoal-800 transition-all shadow-md"
            >
              <div className="h-4 w-4 shrink-0 overflow-hidden rounded bg-black">
                <Image
                  src="/botchain-logo.png"
                  alt="BOT Chain"
                  width={16}
                  height={16}
                  className="h-full w-full object-contain"
                />
              </div>
              <span>BOT Chain website</span>
              <ExternalLink className="h-3 w-3 text-gray-400" />
            </a>

            {/* BOT Chain explorer with Logo at front */}
            <a
              href="https://scan.botchain.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-xl border border-brandGreen/40 bg-charcoal-900 px-4 py-2.5 text-xs font-semibold text-brandGreen-light hover:bg-charcoal-800 transition-all shadow-md"
            >
              <div className="h-4 w-4 shrink-0 overflow-hidden rounded bg-black">
                <Image
                  src="/botchain-logo.png"
                  alt="BOT Chain Explorer"
                  width={16}
                  height={16}
                  className="h-full w-full object-contain"
                />
              </div>
              <span>BOT Chain explorer</span>
              <ExternalLink className="h-3 w-3 text-brandGreen" />
            </a>

            {/* Mainnet Verified Contract Link */}
            <a
              href={`https://scan.botchain.ai/address/${MAINNET_CONTRACT}#code`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brandPurple to-brandGreen px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:opacity-95 transition-all"
            >
              <div className="h-4 w-4 shrink-0 overflow-hidden rounded bg-black">
                <Image
                  src="/botchain-logo.png"
                  alt="Verified Contract"
                  width={16}
                  height={16}
                  className="h-full w-full object-contain"
                />
              </div>
              <span>Verified Contract</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
