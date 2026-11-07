import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";
import { NetworkBanner } from "@/components/NetworkBanner";
import { Globe, ExternalLink, ShieldCheck, Cpu } from "lucide-react";

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
          <footer className="border-t border-charcoal-800 bg-charcoal-900/90 backdrop-blur-md py-8 text-xs text-gray-400">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
              
              {/* BOT Chain Ecosystem Branding */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brandPurple to-brandGreen p-0.5 shadow-md shadow-brandGreen/20">
                  <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-charcoal-900">
                    <Cpu className="h-4 w-4 text-brandGreen" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm tracking-tight">BOT Chain</span>
                    <span className="rounded bg-brandGreen/10 border border-brandGreen/30 px-1.5 py-0.5 text-[10px] font-semibold text-brandGreen">
                      Mainnet (Chain 677)
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500">Powering decentralized, trustless repair tracking</p>
                </div>
              </div>

              {/* Required BOT Chain Ecosystem Links */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
                <a
                  href="https://botchain.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-lg border border-charcoal-700 bg-charcoal-850 px-3 py-1.5 text-gray-300 hover:border-brandPurple hover:text-white transition-all shadow-sm"
                >
                  <Globe className="h-3.5 w-3.5 text-brandPurple-light" />
                  <span>BOT Chain website</span>
                  <ExternalLink className="h-3 w-3 text-gray-500" />
                </a>

                <a
                  href="https://scan.botchain.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-lg border border-charcoal-700 bg-charcoal-850 px-3 py-1.5 text-gray-300 hover:border-brandGreen hover:text-white transition-all shadow-sm"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-brandGreen" />
                  <span>BOT Chain explorer</span>
                  <ExternalLink className="h-3 w-3 text-gray-500" />
                </a>
              </div>

              {/* Copyright & Info */}
              <div className="text-center md:text-right text-[11px] text-gray-500">
                <p>RepairTag &bull; Zero-Wallet Customer Tracking</p>
                <p className="mt-0.5 font-mono text-[10px] text-gray-600">Contract: 0x33eD...F224</p>
              </div>

            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
