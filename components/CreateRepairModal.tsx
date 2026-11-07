"use client";

import React, { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { decodeEventLog } from "viem";
import { X, Loader2, CheckCircle2, AlertCircle, ExternalLink, Plus, Copy, Check } from "lucide-react";
import { CONTRACT_ADDRESS, REPAIR_TAG_ABI } from "@/lib/contracts";
import { activeChain } from "@/lib/chains";

interface CreateRepairModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateRepairModal: React.FC<CreateRepairModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [description, setDescription] = useState("");
  const [newRepairId, setNewRepairId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { writeContract, data: txHash, isPending: isWriting, error: writeError, reset } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    data: receipt,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Extract generated repair ID from transaction logs once confirmed
  React.useEffect(() => {
    if (isConfirmed && receipt) {
      for (const log of receipt.logs) {
        try {
          const decoded = decodeEventLog({
            abi: REPAIR_TAG_ABI,
            data: log.data,
            topics: log.topics,
          });
          if (decoded.eventName === "RepairCreated") {
            const id = (decoded.args as any).repairId?.toString();
            if (id) {
              setNewRepairId(id);
              break;
            }
          }
        } catch {}
      }
      onSuccess();
    }
  }, [isConfirmed, receipt, onSuccess]);

  if (!isOpen) return null;

  const handleClose = () => {
    setDescription("");
    setNewRepairId(null);
    reset();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: REPAIR_TAG_ABI,
      functionName: "createRepair",
      args: [description.trim()],
    });
  };

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-charcoal-700 bg-charcoal-900 p-6 sm:p-7 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-charcoal-700/70 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brandPurple/20 text-brandPurple-light">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Create New Repair Order</h3>
              <p className="text-xs text-gray-400">Log a repair ticket permanently on-chain</p>
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
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Repair Description
              </label>
              <textarea
                rows={3}
                required
                maxLength={250}
                placeholder="e.g. Dell XPS 15 Battery replacement and thermal repaste"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isWriting || isConfirming}
                className="w-full rounded-xl border border-charcoal-700 bg-charcoal-850 p-3.5 text-sm text-white placeholder-gray-500 focus:border-brandPurple focus:outline-none focus:ring-2 focus:ring-brandPurple/20 transition-all disabled:opacity-50"
              />
              <div className="flex justify-between items-center mt-1.5 text-[11px] text-gray-400">
                <span>Do not include customer personal data (PII) on-chain.</span>
                <span>{description.length}/250</span>
              </div>
            </div>

            {/* Error alerts */}
            {(writeError || receiptError) && (
              <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-950/30 p-3.5 text-xs text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
                <div className="break-all">
                  {writeError?.message || receiptError?.message || "Transaction failed."}
                </div>
              </div>
            )}

            {/* Pending state */}
            {isWriting && (
              <div className="flex items-center gap-3 rounded-xl border border-brandPurple/30 bg-brandPurple/10 p-3.5 text-xs text-brandPurple-light">
                <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                <span>Please confirm transaction in your wallet...</span>
              </div>
            )}

            {isConfirming && (
              <div className="flex items-center gap-3 rounded-xl border border-brandGreen/30 bg-brandGreen/10 p-3.5 text-xs text-brandGreen-light">
                <Loader2 className="h-4 w-4 animate-spin shrink-0 text-brandGreen" />
                <span>Confirming on BOT Chain Mainnet block...</span>
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
                disabled={isWriting || isConfirming || !description.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brandPurple to-brandGreen px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-brandPurple/20 hover:opacity-95 transition-all disabled:opacity-50"
              >
                {isWriting || isConfirming ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Create Repair</span>
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
              <h4 className="text-lg font-bold text-white">Repair Successfully Created!</h4>
              <p className="mt-1 text-xs text-gray-400">
                The repair ticket is permanently recorded on BOT Chain Mainnet.
              </p>
            </div>

            {newRepairId && (
              <div className="rounded-xl border border-brandGreen/30 bg-charcoal-850 p-4">
                <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">
                  Customer Repair ID
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl font-extrabold text-brandGreen tracking-wider">
                    #{newRepairId}
                  </span>
                  <button
                    onClick={() => copyId(newRepairId)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    title="Copy Repair ID"
                  >
                    {copied ? <Check className="h-5 w-5 text-brandGreen" /> : <Copy className="h-5 w-5" />}
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-400">
                  Provide this ID to your customer for live status tracking.
                </p>
              </div>
            )}

            {txHash && (
              <a
                href={`${activeChain.blockExplorers.default.url}/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-brandPurple-light hover:underline"
              >
                <span>View Transaction on {activeChain.blockExplorers.default.name}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
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

