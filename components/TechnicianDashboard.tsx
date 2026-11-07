"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { createPublicClient, http } from "viem";
import {
  Plus,
  RefreshCw,
  ExternalLink,
  Wrench,
  CheckCircle,
  Clock,
  Archive,
  Search,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import {
  CONTRACT_ADDRESS,
  REPAIR_TAG_ABI,
  RepairRecord,
  RepairStatus,
  formatDate,
} from "@/lib/contracts";
import { activeChain } from "@/lib/chains";
import { StatusBadge } from "./StatusBadge";
import { CreateRepairModal } from "./CreateRepairModal";
import { UpdateStatusModal } from "./UpdateStatusModal";

export const TechnicianDashboard: React.FC = () => {
  const { address, isConnected } = useAccount();

  const [repairs, setRepairs] = useState<RepairRecord[]>([]);
  const [totalPlatformRepairs, setTotalPlatformRepairs] = useState<bigint>(0n);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState<RepairRecord | null>(null);
  const [searchFilter, setSearchFilter] = useState("");

  const fetchRepairs = useCallback(async () => {
    if (!address || CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const client = createPublicClient({
        chain: activeChain,
        transport: http(),
      });

      // Call getMyRepairs() simulating caller address
      const [fetchedRepairs, total] = await Promise.all([
        client.readContract({
          address: CONTRACT_ADDRESS,
          abi: REPAIR_TAG_ABI,
          functionName: "getMyRepairs",
          account: address,
        }),
        client.readContract({
          address: CONTRACT_ADDRESS,
          abi: REPAIR_TAG_ABI,
          functionName: "getTotalRepairs",
        }),
      ]);

      const formatted: RepairRecord[] = fetchedRepairs.map((r: any) => ({
        id: r.id,
        technician: r.technician,
        description: r.description,
        status: r.status as RepairStatus,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      }));

      // Sort descending by ID (newest first)
      formatted.sort((a, b) => Number(b.id - a.id));

      setRepairs(formatted);
      setTotalPlatformRepairs(total);
    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
      setError("Failed to load your technician repairs. Ensure the contract is deployed.");
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    if (isConnected && address) {
      fetchRepairs();
    }
  }, [isConnected, address, fetchRepairs]);

  if (!isConnected) {
    return null;
  }

  // Filtered repairs
  const filteredRepairs = repairs.filter(
    (r) =>
      r.id.toString().includes(searchFilter) ||
      r.description.toLowerCase().includes(searchFilter.toLowerCase())
  );

  // Quick stats
  const activeCount = repairs.filter(
    (r) =>
      r.status === RepairStatus.Received ||
      r.status === RepairStatus.Diagnosing ||
      r.status === RepairStatus.InRepair
  ).length;

  const readyCount = repairs.filter((r) => r.status === RepairStatus.ReadyForPickup).length;
  const completedCount = repairs.filter((r) => r.status === RepairStatus.Completed).length;

  return (
    <section className="space-y-6">
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-charcoal-700 bg-charcoal-850/80 p-6 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">Technician Workspace</h2>
            <span className="rounded-full bg-brandPurple/20 px-2.5 py-0.5 text-xs font-semibold text-brandPurple-light">
              Active Session
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-400">
            Manage your repair orders, issue customer tags, and update status on BOT Chain Mainnet.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchRepairs}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-xl border border-charcoal-700 bg-charcoal-900 px-3.5 py-2.5 text-xs font-medium text-gray-300 hover:bg-charcoal-800 transition-colors disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-brandPurple-light" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brandPurple to-brandGreen px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-brandPurple/20 hover:opacity-95 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Create Repair</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-charcoal-700 bg-charcoal-850/60 p-4">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>My Total Repairs</span>
            <Archive className="h-4 w-4 text-brandPurple-light" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">{repairs.length}</div>
          <div className="mt-1 text-[11px] text-gray-400">
            Platform Total: {totalPlatformRepairs.toString()}
          </div>
        </div>

        <div className="rounded-xl border border-charcoal-700 bg-charcoal-850/60 p-4">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>In Progress</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-400">{activeCount}</div>
          <div className="mt-1 text-[11px] text-gray-400">Received / Diagnosing / In Repair</div>
        </div>

        <div className="rounded-xl border border-charcoal-700 bg-charcoal-850/60 p-4">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Ready for Pickup</span>
            <Sparkles className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-400">{readyCount}</div>
          <div className="mt-1 text-[11px] text-gray-400">Awaiting customer collection</div>
        </div>

        <div className="rounded-xl border border-charcoal-700 bg-charcoal-850/60 p-4">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Completed</span>
            <CheckCircle className="h-4 w-4 text-brandGreen" />
          </div>
          <div className="mt-2 text-2xl font-bold text-brandGreen">{completedCount}</div>
          <div className="mt-1 text-[11px] text-gray-400">Successfully closed jobs</div>
        </div>
      </div>

      {/* Repairs Table / Cards */}
      <div className="rounded-2xl border border-charcoal-700 bg-charcoal-850/70 overflow-hidden shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 border-b border-charcoal-700/60">
          <div>
            <h3 className="text-base font-bold text-white">Logged Repair Orders</h3>
            <p className="text-xs text-gray-400">Records created with your connected technician account</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID or description..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full rounded-lg border border-charcoal-700 bg-charcoal-900 py-1.5 pl-9 pr-3 text-xs text-white placeholder-gray-500 focus:border-brandPurple focus:outline-none"
            />
          </div>
        </div>

        {error && (
          <div className="m-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-950/30 p-3.5 text-xs text-red-300">
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {filteredRepairs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-charcoal-800 text-gray-400 mb-3">
              <Wrench className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-semibold text-white">No repair tickets found</h4>
            <p className="mt-1 text-xs text-gray-400 max-w-sm mx-auto">
              {searchFilter
                ? "No repairs match your search criteria."
                : "You have not logged any repairs yet. Click 'Create Repair' to issue your first on-chain tag."}
            </p>
            {!searchFilter && (
              <button
                onClick={() => setCreateModalOpen(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brandPurple px-4 py-2 text-xs font-semibold text-white hover:bg-brandPurple-muted transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Create Your First Repair</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-charcoal-700/60 bg-charcoal-900/60 text-gray-400 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Repair ID</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Created</th>
                  <th className="py-3.5 px-4 hidden lg:table-cell">Last Updated</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-700/50">
                {filteredRepairs.map((repair) => {
                  const isFinalized =
                    repair.status === RepairStatus.Completed ||
                    repair.status === RepairStatus.Cancelled;

                  return (
                    <tr
                      key={repair.id.toString()}
                      className="hover:bg-charcoal-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-white">
                        #{repair.id.toString()}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-gray-200 max-w-xs truncate">
                        {repair.description}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={repair.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-gray-400 hidden md:table-cell">
                        {formatDate(repair.createdAt)}
                      </td>
                      <td className="py-3.5 px-4 text-gray-400 hidden lg:table-cell">
                        {formatDate(repair.updatedAt)}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedRepair(repair);
                              setStatusModalOpen(true);
                            }}
                            disabled={isFinalized}
                            className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all ${
                              isFinalized
                                ? "bg-charcoal-800 text-gray-500 cursor-not-allowed opacity-50"
                                : "bg-brandPurple/20 text-brandPurple-light hover:bg-brandPurple hover:text-white"
                            }`}
                          >
                            Update Status
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateRepairModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={fetchRepairs}
      />

      <UpdateStatusModal
        repair={selectedRepair}
        isOpen={statusModalOpen}
        onClose={() => {
          setStatusModalOpen(false);
          setSelectedRepair(null);
        }}
        onSuccess={fetchRepairs}
      />
    </section>
  );
};

