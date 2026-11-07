import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";
import { NetworkBanner } from "@/components/NetworkBanner";
import { ExternalLink, CheckCircle } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "RepairTag — Every repair, tracked | BOT Chain Mainnet",
  description:
    "Decentralized on-chain repair tracking dApp for phone, laptop, and electronics repair businesses. Built natively on BOT Chain Mainnet.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

const MAINNET_CONTRACT = "0x33eDC96eC0cF2A367Ea881970b95eF96B1d0F224";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-charcoal-950 text-gray-100 flex flex-col antialiased selection:bg-brandPurple/30 selection:text-white">
        <Providers>
          <Header />
          <NetworkBanner />
          <main className="flex-1">{children}</main>
          
          {/* Ecosystem Footer */}
          <footer className="border-t border-charcoal-800 bg-charcoal-900/95 backdrop-blur-md py-8 text-xs text-gray-400">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
              
              {/* BOT Chain Ecosystem Branding */}
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-brandGreen/40 bg-black p-1 shadow-lg shadow-brandGreen/10">
                  <Image
                    src="/botchain-logo.png"
                    alt="BOT Chain Logo"
                    width={40}
                    height={40}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm tracking-tight">BOT Chain</span>
                    <span className="rounded bg-brandGreen/10 border border-brandGreen/30 px-1.5 py-0.5 text-[10px] font-semibold text-brandGreen">
                      Mainnet (Chain 677)
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400">Powering decentralized, trustless repair tracking</p>
                </div>
              </div>

              {/* Required BOT Chain Ecosystem Links with Logo at front */}
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
                <a
                  href="https://botchain.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl border border-charcoal-700 bg-charcoal-850 px-3.5 py-2 text-gray-200 hover:border-brandPurple hover:bg-charcoal-800 hover:text-white transition-all shadow-sm"
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
                  <span className="font-medium">BOT Chain website</span>
                  <ExternalLink className="h-3 w-3 text-gray-400" />
                </a>

                <a
                  href="https://scan.botchain.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl border border-brandGreen/40 bg-charcoal-850 px-3.5 py-2 text-gray-200 hover:border-brandGreen hover:bg-charcoal-800 hover:text-white transition-all shadow-sm"
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
                  <span className="font-medium">BOT Chain explorer</span>
                  <ExternalLink className="h-3 w-3 text-brandGreen" />
                </a>
              </div>

              {/* Mainnet Verified Contract Info */}
              <div className="text-center md:text-right text-[11px] text-gray-400">
                <div className="flex items-center justify-center md:justify-end gap-1.5 text-brandGreen font-medium">
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>Mainnet Verified Contract</span>
                </div>
                <a
                  href={`https://scan.botchain.ai/address/${MAINNET_CONTRACT}#code`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 font-mono text-[11px] text-gray-300 hover:text-brandPurple-light hover:underline"
                >
                  <span>{MAINNET_CONTRACT.slice(0, 8)}...{MAINNET_CONTRACT.slice(-6)}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
