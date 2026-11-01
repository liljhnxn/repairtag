# RepairTag 🛠️

**RepairTag** is a decentralized, on-chain repair tracking dApp designed for phone repair shops, laptop technicians, and electronics repair businesses.

Technicians log repair orders directly onto the **Botchain Testnet** and update their status in real-time. Customers can enter their unique **Repair ID** to check the status of their repair without needing to connect a wallet or contact the technician.

---

## 🚀 Key Features

* **Zero-Wallet Customer Tracking**: Customers can check the exact stage of their repair (Received, Diagnosing, In Repair, Ready for Pickup, Completed, Cancelled) without needing MetaMask or a Web3 wallet.
* **Technician Management Dashboard**: Connect wallet to access a dedicated workspace for creating new repair tickets and updating statuses.
* **Tamper-Proof & Secure**: Only the technician who created the repair ticket has authorization to update its status.
* **Strict Privacy by Design**: No customer names, phone numbers, home addresses, or sensitive personal identifiable information (PII) are stored on-chain.
* **Visual Progress Tracker**: Clear graphical step-by-step progress tracking from shop intake to final pickup.
* **Botchain Testnet Native**: Configured for Botchain Testnet (Chain ID 968) with block explorer integration via [BohrScan](https://scan.bohr.life).

---

## ⛓️ Blockchain & Network Details

* **Network Name**: Botchain Testnet
* **Chain ID**: `968`
* **RPC URL**: `https://rpc.bohr.life`
* **Block Explorer**: `https://scan.bohr.life`
* **Currency Symbol**: `BOHR`

---

## 🛠️ Tech Stack

* **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
* **Web3 Integration**: Wagmi v2, Viem v2, MetaMask / Injected Wallets
* **Smart Contracts**: Solidity ^0.8.20, Hardhat 2.x / 3.x, Ethers v6, Chai

---

## 📂 Project Structure

```
├── app/                  # Next.js App Router pages and layouts
│   ├── globals.css       # Tailwind CSS and global styling
│   ├── layout.tsx        # Root layout with Wagmi & QueryClient providers
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
│   ├── chains.ts         # Botchain Testnet definition (Viem)
│   ├── contracts.ts      # Contract ABI, types, addresses & helpers
│   └── wagmi.ts          # Wagmi configuration
├── scripts/              # Hardhat scripts
│   └── deploy.ts         # Deployment script for Botchain Testnet
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

Set your configuration:

```env
# Botchain Testnet
BOTCHAIN_RPC_URL=https://rpc.bohr.life
NEXT_PUBLIC_BOTCHAIN_RPC_URL=https://rpc.bohr.life
NEXT_PUBLIC_BOTCHAIN_CHAIN_ID=968
NEXT_PUBLIC_BOTCHAIN_EXPLORER_URL=https://scan.bohr.life

# Technician / Deployer Private Key (without 0x prefix or with 0x)
PRIVATE_KEY=your_private_key_here

# Deployed Contract Address
NEXT_PUBLIC_CONTRACT_ADDRESS=
```

---

## 🧪 Testing

Run the full smart contract test suite covering ID generation, unauthorized updates, description validation, and lifecycle controls:

```bash
npm test
```

All 14 unit tests will execute against Hardhat's in-memory EVM.

---

## 🚢 Deployment to Botchain Testnet

1. Ensure your deployer account has testnet funds on Botchain Testnet (`https://rpc.bohr.life`).
2. Add your private key to `PRIVATE_KEY` in `.env`.
3. Run the deployment script:

```bash
npm run deploy:botchain
```

The script will deploy `RepairTag.sol` to Botchain Testnet and automatically save the deployment details to `lib/deployment.json`.

Then update `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env` with the deployed address.

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

