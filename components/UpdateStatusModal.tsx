"use client";

import React, { useState, useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { X, Loader2, CheckCircle2, AlertCircle, ExternalLink, RefreshCw } from "lucide-react";
import {
  CONTRACT_ADDRESS,
  REPAIR_TAG_ABI,
  RepairRecord,
  RepairStatus,
  STATUS_META,
} from "@/lib/contracts";
import { activeChain } from "@/lib/chains";
import { StatusBadge } from "./StatusBadge";

interface UpdateStatusModalProps {
  repair: RepairRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ALL_STATUSES = [
  RepairStatus.Received,
  RepairStatus.Diagnosing,
  RepairStatus.InRepair,
  RepairStatus.ReadyForPickup,
  RepairStatus.Completed,
  RepairStatus.Cancelled,
];

export const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({
  repair,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<RepairStatus | null>(null);

  const { writeContract, data: txHash, isPending: isWriting, error: writeError, reset } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (repair) {
      setSelectedStatus(null);
      reset();
    }
  }, [repair, reset]);

  useEffect(() => {
    if (isConfirmed) {
      onSuccess();
    }
  }, [isConfirmed, onSuccess]);

  if (!isOpen || !repair) return null;

  const isFinalized =
    repair.status === RepairStatus.Completed || repair.status === RepairStatus.Cancelled;

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStatus === null || selectedStatus === repair.status) return;

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: REPAIR_TAG_ABI,
      functionName: "updateRepairStatus",
      args: [repair.id, selectedStatus],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-charcoal-700 bg-charcoal-900 p-6 sm:p-7 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-charcoal-700/70 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brandGreen/20 text-brandGreen">
              <RefreshCw className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Update Status</h3>
              <p className="text-xs text-gray-400">Repair Order #{repair.id.toString()}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-charcoal-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        {!isConfirmed ? (
          <form onSubmit={handleUpdate} className="mt-5 space-y-4">
            {/* Current Status overview */}
            <div className="rounded-xl border border-charcoal-700 bg-charcoal-850 p-4">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-gray-400">Current Status:</span>
                <StatusBadge status={repair.status} size="sm" />
              </div>
              <div className="text-xs text-gray-300 font-medium truncate">
                Description: &quot;{repair.description}&quot;
              </div>
            </div>

            {isFinalized ? (
              <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 text-xs text-amber-300">
                This repair is already marked as{" "}
                <strong>{STATUS_META[repair.status].label}</strong>. Finalized orders cannot be
                updated further.
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Select New Status
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ALL_STATUSES.map((status) => {
                    const meta = STATUS_META[status];
                    const isCurrent = repair.status === status;
                    const isSelected = selectedStatus === status;

                    return (
                      <button
                        type="button"
                        key={status}
                        disabled={isCurrent || isWriting || isConfirming}
                        onClick={() => setSelectedStatus(status)}
                        className={`flex items-center gap-2.5 rounded-xl border p-3 text-left transition-all ${
                          isSelected
                            ? "border-brandGreen bg-brandGreen/10 text-white ring-2 ring-brandGreen/20"
                            : isCurrent
                            ? "border-charcoal-700/50 bg-charcoal-850/40 text-gray-500 cursor-not-allowed opacity-60"
                            : "border-charcoal-700 bg-charcoal-850 text-gray-300 hover:border-brandPurple/50 hover:bg-charcoal-800"
                        }`}
                      >
                        <span className={`h-2 w-2 rounded-full ${meta.dotClass}`} />
                        <div>
                          <div className="text-xs font-semibold">{meta.label}</div>
                          {isCurrent && <div className="text-[10px] text-gray-500">(Current)</div>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Error alerts */}
            {(writeError || receiptError) && (
              <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-950/30 p-3.5 text-xs text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
                <div className="break-all">
                  {writeError?.message || receiptError?.message || "Transaction failed."}
                </div>
              </div>
            )}

            {/* Pending states */}
            {isWriting && (
              <div className="flex items-center gap-3 rounded-xl border border-brandPurple/30 bg-brandPurple/10 p-3.5 text-xs text-brandPurple-light">
                <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                <span>Confirming transaction in wallet...</span>
              </div>
            )}

            {isConfirming && (
              <div className="flex items-center gap-3 rounded-xl border border-brandGreen/30 bg-brandGreen/10 p-3.5 text-xs text-brandGreen-light">
                <Loader2 className="h-4 w-4 animate-spin shrink-0 text-brandGreen" />
                <span>Recording status change on BOT Chain Mainnet block...</span>
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={isWriting || isConfirming}
                className="rounded-xl border border-charcoal-700 bg-charcoal-800 px-4 py-2.5 text-xs font-semibold text-gray-300 hover:bg-charcoal-700 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  isFinalized ||
                  selectedStatus === null ||
                  selectedStatus === repair.status ||
                  isWriting ||
                  isConfirming
                }
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brandPurple to-brandGreen px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-brandPurple/20 hover:opacity-95 transition-all disabled:opacity-50"
              >
                {isWriting || isConfirming ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <span>Confirm Status Update</span>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Success Screen */
          <div className="mt-5 space-y-5 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brandGreen/20 text-brandGreen">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-white">Status Updated!</h4>
              <p className="mt-1 text-xs text-gray-400">
                Repair #{repair.id.toString()} has been updated on BOT Chain Mainnet.
              </p>
            </div>

            {selectedStatus !== null && (
              <div className="inline-block">
                <StatusBadge status={selectedStatus} size="lg" />
              </div>
            )}

            {txHash && (
              <div>
                <a
                  href={`${activeChain.blockExplorers.default.url}/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-brandPurple-light hover:underline"
                >
                  <div className="h-3.5 w-3.5 shrink-0 overflow-hidden rounded bg-black">
                    <img
                      src="/botchain-logo.png"
                      alt="BOT Chain"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <span>View Transaction on BotchainScan</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            )}

            <button
              onClick={handleClose}
              className="w-full rounded-xl bg-charcoal-800 py-3 text-xs font-semibold text-white hover:bg-charcoal-700 transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

