import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";
import { NetworkBanner } from "@/components/NetworkBanner";

export const metadata: Metadata = {
  title: "RepairTag — Every repair, tracked.",
  description:
    "Decentralized on-chain repair tracking dApp for phone, laptop, and electronics repair businesses. Customers look up live repair status without a wallet.",
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
          <footer className="border-t border-charcoal-800 bg-charcoal-900/40 py-6 text-center text-xs text-gray-500">
            <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p>RepairTag &bull; Decentralized Repair Tracking on Botchain Mainnet (Chain ID 677)</p>
              <div className="flex items-center gap-4">
                <a
                  href="https://scan.botchain.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-300 transition-colors"
                >
                  BotchainScan Explorer
                </a>
                <span>&bull;</span>
                <a
                  href="https://rpc.botchain.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-300 transition-colors"
                >
                  RPC Node
                </a>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}

