"use client";

import React, { useState } from "react";
import { Search, Loader2, ExternalLink, Calendar, User, FileText, Check, Copy } from "lucide-react";
import { createPublicClient, http } from "viem";
import { activeChain } from "@/lib/chains";
import {
  CONTRACT_ADDRESS,
  REPAIR_TAG_ABI,
  RepairRecord,
  RepairStatus,
  shortenAddress,
  formatDate,
} from "@/lib/contracts";
import { StatusBadge } from "./StatusBadge";
import { ProgressTracker } from "./ProgressTracker";

export const RepairLookup: React.FC = () => {
  const [repairIdInput, setRepairIdInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [repair, setRepair] = useState<RepairRecord | null>(null);
  const [copied, setCopied] = useState(false);

  const handleTrack = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const idToLookup = repairIdInput.trim();

    if (!idToLookup) {
      setError("Please enter a valid Repair ID");
      return;
    }

    if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
      setError(
        "Smart contract is not configured yet. Please configure NEXT_PUBLIC_CONTRACT_ADDRESS in .env"
      );
      return;
    }

    setLoading(true);
    setError(null);
    setRepair(null);

    try {
      // Create independent public client targeting Botchain so customers don't need a wallet
      const client = createPublicClient({
        chain: activeChain,
        transport: http(),
      });

      const parsedId = BigInt(idToLookup);

      const result = await client.readContract({
        address: CONTRACT_ADDRESS,
        abi: REPAIR_TAG_ABI,
        functionName: "getRepair",
        args: [parsedId],
      });

      const fetchedRepair: RepairRecord = {
        id: result.id,
        technician: result.technician,
        description: result.description,
        status: result.status as RepairStatus,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      };

      setRepair(fetchedRepair);
    } catch (err: any) {
      console.error("Lookup error:", err);
      if (err.message?.includes("RepairNotFound") || err.name === "ContractFunctionRevertedError") {
        setError(`Repair #${idToLookup} was not found on-chain. Please verify the ID.`);
      } else {
        setError("Failed to fetch repair record. Please verify the ID or network connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative overflow-hidden rounded-2xl border border-charcoal-700 bg-charcoal-850/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-black/40">
      {/* Decorative gradient glow */}
      <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brandPurple/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-24 -bottom-24 h-64 w-64 rounded-full bg-brandGreen/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-brandPurple/30 bg-brandPurple/10 px-3 py-1 text-xs font-semibold text-brandPurple-light mb-3">
            <span>Customer Portal</span>
            <span className="text-gray-400">•</span>
            <span>No Wallet Required</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Track Repair Status
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Enter your unique repair order ID provided by your repair shop to check real-time progress on-chain.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              placeholder="e.g. 1001"
              value={repairIdInput}
              onChange={(e) => setRepairIdInput(e.target.value)}
              className="w-full rounded-xl border border-charcoal-700 bg-charcoal-900 py-3.5 pl-11 pr-4 text-sm text-white placeholder-gray-500 focus:border-brandPurple focus:outline-none focus:ring-2 focus:ring-brandPurple/20 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !repairIdInput.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brandPurple to-brandPurple-muted px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brandPurple/25 hover:opacity-95 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Checking On-Chain...</span>
              </>
            ) : (
              <span>Track Repair</span>
            )}
          </button>
        </form>

        {/* Error message */}
        {error && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-950/30 p-4 text-sm text-red-300 animate-in fade-in">
            {error}
          </div>
        )}

        {/* Result Card */}
        {repair && (
          <div className="mt-8 rounded-2xl border border-charcoal-700 bg-charcoal-900/90 p-6 sm:p-7 shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-charcoal-700/70 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider text-gray-400">Repair Order</span>
                  <span className="text-xl font-bold text-white">#{repair.id.toString()}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-400">Technician:</span>
                  <a
                    href={`${activeChain.blockExplorers.default.url}/address/${repair.technician}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-xs text-brandPurple-light hover:underline"
                  >
                    <span>{shortenAddress(repair.technician)}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <StatusBadge status={repair.status} size="lg" />
              </div>
            </div>

            {/* Visual Progress Tracker */}
            <div className="my-6">
              <ProgressTracker status={repair.status} />
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl bg-charcoal-850/80 p-4 border border-charcoal-700/60 text-sm">
              <div className="sm:col-span-2">
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                  <FileText className="h-3.5 w-3.5 text-brandPurple-light" />
                  <span>Repair Description</span>
                </div>
                <p className="text-white font-medium break-words">{repair.description}</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                  <Calendar className="h-3.5 w-3.5 text-gray-400" />
                  <span>Date Received</span>
                </div>
                <p className="text-gray-300 font-mono text-xs">{formatDate(repair.createdAt)}</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                  <Calendar className="h-3.5 w-3.5 text-gray-400" />
                  <span>Last Updated</span>
                </div>
                <p className="text-gray-300 font-mono text-xs">{formatDate(repair.updatedAt)}</p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400 pt-2">
              <button
                onClick={() => copyToClipboard(window.location.origin + "?id=" + repair.id.toString())}
                className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-brandGreen" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Direct link copied!" : "Copy direct tracking link"}</span>
              </button>

              <a
                href={`${activeChain.blockExplorers.default.url}/address/${CONTRACT_ADDRESS}#code`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-gray-400 hover:text-brandPurple-light transition-colors"
              >
                <div className="h-3.5 w-3.5 shrink-0 overflow-hidden rounded bg-black">
                  <img
                    src="/botchain-logo.png"
                    alt="BOT Chain"
                    className="h-full w-full object-contain"
                  />
                </div>
                <span>Verified on BotchainScan ({CONTRACT_ADDRESS.slice(0, 6)}...{CONTRACT_ADDRESS.slice(-4)})</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

