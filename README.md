# RepairTag 🛠️

**RepairTag** is a decentralized, on-chain repair tracking dApp designed for phone repair shops, laptop technicians, and electronics repair businesses.

Technicians log repair orders directly onto **BOT Chain Mainnet** and update their status in real-time. Customers can enter their unique **Repair ID** to check the status of their repair without needing to connect a wallet or contact the technician.

---

## 🚀 Key Features

* **Zero-Wallet Customer Tracking**: Customers can check the exact stage of their repair (Received, Diagnosing, In Repair, Ready for Pickup, Completed, Cancelled) without needing MetaMask or a Web3 wallet.
* **Technician Management Dashboard**: Connect wallet to access a dedicated workspace for creating new repair tickets and updating statuses.
* **Tamper-Proof & Secure**: Only the technician who created the repair ticket has authorization to update its status.
* **Strict Privacy by Design**: No customer names, phone numbers, home addresses, or sensitive personal identifiable information (PII) are stored on-chain.
* **Visual Progress Tracker**: Clear graphical step-by-step progress tracking from shop intake to final pickup.
* **BOT Chain Mainnet Native**: Built natively on BOT Chain Mainnet with block explorer verification via [BotchainScan](https://scan.botchain.ai).

---

## ⛓️ Blockchain & Network Details

* **Network Name**: BOT Chain Mainnet
* **Chain ID**: `677`
* **RPC URL**: `https://rpc.botchain.ai`
* **Block Explorer**: `https://scan.botchain.ai`
* **Native Currency**: `BOT`
* **Verified Contract**: [`0x33eDC96eC0cF2A367Ea881970b95eF96B1d0F224`](https://scan.botchain.ai/address/0x33eDC96eC0cF2A367Ea881970b95eF96B1d0F224#code)

---

## 🌐 Official BOT Chain Ecosystem Links

* **BOT Chain website**: [https://botchain.ai](https://botchain.ai)
* **BOT Chain explorer**: [https://scan.botchain.ai](https://scan.botchain.ai)

---

## 🛠️ Tech Stack

* **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
* **Web3 Integration**: Wagmi v2, Viem v2, MetaMask / Injected Wallets
* **Smart Contracts**: Solidity ^0.8.20, Hardhat, Ethers v6, Chai

---

## 📂 Project Structure

```
├── app/                  # Next.js App Router pages and layouts
│   ├── globals.css       # Tailwind CSS and global styling
│   ├── layout.tsx        # Root layout with Wagmi & QueryClient providers + BOT Chain ecosystem footer
│   └── page.tsx          # Main RepairTag dashboard
├── components/           # UI components
│   ├── CreateRepairModal.tsx  # Technician new repair modal
│   ├── Header.tsx             # Navbar with brand & wallet connect
│   ├── NetworkBanner.tsx      # Unsupported network switcher banner
│   ├── ProgressTracker.tsx    # Visual 5-stage progress indicator
│   ├── Providers.tsx          # Wagmi & React Query context
│   ├── RepairLookup.tsx       # Public zero-wallet lookup component
│   ├── StatusBadge.tsx        # Styled status tags
│   ├── TechnicianDashboard.tsx# Technician workspace & ticket list
│   └── UpdateStatusModal.tsx  # Status update modal
├── contracts/            # Smart contracts
│   └── RepairTag.sol     # Core repair tracking Solidity contract
├── lib/                  # Utilities and configs
│   ├── chains.ts         # BOT Chain Mainnet definition (Viem)
│   ├── contracts.ts      # Contract ABI, types, addresses & helpers
│   ├── deployment.json   # Active contract deployment metadata
│   └── wagmi.ts          # Wagmi configuration
├── scripts/              # Hardhat scripts
│   └── deploy.ts         # Deployment script for BOT Chain Mainnet
├── test/                 # Hardhat test suite
│   └── RepairTag.test.ts # 14 comprehensive unit tests
├── hardhat.config.ts     # Hardhat compiler & network config
└── package.json          # Project dependencies and npm scripts
```

---

## 📋 Smart Contract Specification (`RepairTag.sol`)

### Status Lifecycle

1. `Received` (0) — Device logged in at workshop
2. `Diagnosing` (1) — Hardware/software troubleshooting
3. `InRepair` (2) — Active repair & parts servicing
4. `ReadyForPickup` (3) — Repair complete and verified
5. `Completed` (4) — Device collected by customer (finalized)
6. `Cancelled` (5) — Repair process cancelled (finalized)

### Core Functions

* `createRepair(string description) -> uint256`: Creates an on-chain repair record and emits `RepairCreated`.
* `updateRepairStatus(uint256 repairId, Status newStatus)`: Restricted to the original technician. Emits `RepairStatusUpdated`.
* `getRepair(uint256 repairId) -> Repair`: Public read function to fetch repair record details.
* `getMyRepairs() -> Repair[]`: Returns all repairs created by the calling technician.
* `getTotalRepairs() -> uint256`: Returns total number of repairs created platform-wide.

---

## 💻 Getting Started

### 1. Installation

Clone or open the repository, then install dependencies:

```bash
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Configuration:

```env
BOTCHAIN_RPC_URL=https://rpc.botchain.ai
NEXT_PUBLIC_BOTCHAIN_RPC_URL=https://rpc.botchain.ai
NEXT_PUBLIC_BOTCHAIN_CHAIN_ID=677
NEXT_PUBLIC_BOTCHAIN_EXPLORER_URL=https://scan.botchain.ai
PRIVATE_KEY=your_private_key_here
NEXT_PUBLIC_CONTRACT_ADDRESS=0x33eDC96eC0cF2A367Ea881970b95eF96B1d0F224
```

---

## 🧪 Testing

Run the full smart contract test suite:

```bash
npm test
```

All 14 unit tests will execute against Hardhat's in-memory EVM.

---

## 🚢 Deployment to BOT Chain Mainnet

To deploy a fresh instance of the contract:

```bash
npm run deploy:mainnet
```

---

## 🖥️ Running the Frontend

To start the local Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

To create an optimized production build:

```bash
npm run build
npm start
```

---

## 🛡️ Security & Privacy Principles

1. **No PII**: RepairTag explicitly avoids storing names, emails, phone numbers, or physical addresses on-chain.
2. **Access Control**: Only the creator technician address can update a repair order's status.
3. **Immutability of Final States**: Once marked as `Completed` or `Cancelled`, repairs cannot be modified further.
