# RepairTag — Whitepaper & Pitch Deck

**Decentralized, Trustless Repair Tracking for Modern Workshops**  
*Built on Botchain Testnet (Chain ID: 968)*  

* **Contract Address:** `0x1aE4071fba5659870C0bA001DfaF029BB85e8F61`  
* **Explorer Verification:** [BohrScan Verification](https://scan.bohr.life/address/0x1aE4071fba5659870C0bA001DfaF029BB85e8F61#code)  
* **Repository:** [github.com/liljhnxn/repairtag](https://github.com/liljhnxn/repairtag)  

---

# PART 1: THE PITCH DECK (Slide-by-Slide)

### Slide 1: Title & Vision
* **Project Name:** RepairTag
* **Tagline:** Every repair, tracked.
* **Mission:** Bringing transparency and trust to independent electronics repair shops worldwide through lightweight, tamper-proof blockchain records.

### Slide 2: The Problem
1. **Endless Customer Status Inquiries:** Repair technicians spend up to 25% of their working day answering phone calls and messages asking: *"Is my device ready yet?"*
2. **Paper & Fragmented Records:** Small shops rely on paper receipts, sticky notes, or spreadsheets that get misplaced, destroyed, or tampered with.
3. **Disputes & Lost Trust:** Disagreements arise over when a device was received, what stage repairs reached, or whether parts were serviced.
4. **Web3 Onboarding Barrier:** Most Web3 dApps require customers to own crypto and download a wallet just to read data, making consumer adoption impossible.

### Slide 3: The Solution
* **Frictionless On-Chain Records:** Technicians log repair tickets directly onto Botchain with one click.
* **Zero-Wallet Customer Experience:** Customers enter a simple Repair ID (e.g. `#1001`) into the portal and see live updates immediately—no wallet, no tokens, and no fees for the customer.
* **Tamper-Proof Audit Trail:** Timestamped status updates are permanent and cryptographically verified on-chain.
* **Strict Privacy by Design:** Zero customer Personally Identifiable Information (PII) is ever recorded on-chain.

### Slide 4: 5-Stage Lifecycle
1. **Received (0):** Device officially logged in with unique sequential on-chain ID.
2. **Diagnosing (1):** Technician tests components and faults.
3. **In Repair (2):** Active servicing and parts replacement.
4. **Ready for Pickup (3):** Completed, tested, and waiting for customer collection.
5. **Completed (4) / Cancelled (5):** Finalized ticket state (locked against future edits).

### Slide 5: Market Opportunity
* The global consumer electronics repair market is valued at **over $20 billion annually** and growing with Right-to-Repair legislation worldwide.
* Millions of independent phone, laptop, drone, and electronics repair shops need simple SaaS tools without expensive monthly enterprise software fees.

### Slide 6: Technology Architecture
* **Blockchain:** Botchain Testnet (EVM, Chain ID 968)
* **Smart Contracts:** Solidity ^0.8.20 with custom gas-optimized errors and events
* **Frontend:** Next.js 14 App Router, TypeScript, Tailwind CSS
* **Web3 Integration:** Wagmi v2, Viem v2, MetaMask / Injected connectors
* **Direct RPC Client:** Customers read contract state directly through public RPC (`https://rpc.bohr.life`) with zero gas and zero wallet friction.

### Slide 7: Traction & Milestones
* [x] Smart contract written, tested (14 unit tests passing), and deployed on Botchain Testnet.
* [x] Source code verified on BohrScan.
* [x] Production Next.js web application built with responsive mobile/desktop dashboard.
* [x] GitHub repository published and open source.

### Slide 8: Roadmap
* **Phase 1 (Current):** Core on-chain tracking protocol, technician workspace, zero-wallet lookup portal.
* **Phase 2:** Printable QR code generator for device sticker tagging; printable physical repair claims.
* **Phase 3:** Opt-in decentralized notification relay (SMS / Webhooks) for status transitions.
* **Phase 4:** Mainnet deployment & shop reputation registry.

---

# PART 2: THE WHITEPAPER

## 1. Abstract
RepairTag is a decentralized repair order tracking protocol built on the Botchain EVM network. It eliminates communication bottlenecks between electronics repair businesses and their customers by introducing public, verifiable, and immutable on-chain repair lifecycles. By architecting a zero-wallet reading layer, RepairTag achieves complete consumer accessibility without sacrificing decentralized trust guarantees.

## 2. Introduction & Industry Background
Independent repair shops—servicing smartphones, computers, appliances, and drones—form the backbone of consumer hardware maintenance. Despite technological advances in consumer electronics, the operational workflow of small workshops remains heavily manual. Technicians frequently manage customer communications through unsynchronized channels, leading to misunderstandings, lost intake tags, and wasted labor on status inquiries.

Existing enterprise repair ERP solutions present significant drawbacks:
* Prohibitive monthly SaaS subscription costs for independent technicians.
* Vulnerability to centralized database loss or tampering.
* Fragmented, proprietary customer portals requiring account creation.

RepairTag leverages public smart contract infrastructure to deliver an open, permanent, and accessible tracking ledger.

## 3. Core Architecture

### 3.1 Dual-Actor Interaction Model
RepairTag separates platform interactions into two distinct operational roles:

1. **Technicians (Authenticated On-Chain Actors):**
   * Authenticate via EVM wallet (e.g. MetaMask).
   * Pay micro-gas fees to execute state-changing transactions (`createRepair`, `updateRepairStatus`).
   * Retain exclusive cryptographic authority over the repair records they create.

2. **Customers (Read-Only Public Observers):**
   * Do not require a wallet, private key, or cryptocurrency.
   * Query the verified contract directly via Viem public client calls to Botchain RPC (`https://rpc.bohr.life`).
   * Retrieve immutable status updates instantly via a human-readable Repair ID.

### 3.2 State Machine & Lifecycle Rules
Each repair follows a deterministic status transition path:

```
[ Intake ] ──> Received (0)
                   │
                   ▼
              Diagnosing (1)
                   │
                   ▼
              In Repair (2)
                   │
                   ▼
          Ready for Pickup (3)
              │          │
              ▼          ▼
        Completed (4)  Cancelled (5)  <-- [ Finalized State Lock ]
```

#### Finalized State Integrity
Once a repair transitions to `Completed` or `Cancelled`, the smart contract prevents further modifications through the `RepairFinalized` custom error. This prevents retroactive tampering after a device has left the shop.

## 4. Smart Contract Specifications (`RepairTag.sol`)

### 4.1 Data Structure
```solidity
enum Status { Received, Diagnosing, InRepair, ReadyForPickup, Completed, Cancelled }

struct Repair {
    uint256 id;
    address technician;
    string description;
    Status status;
    uint256 createdAt;
    uint256 updatedAt;
}
```

### 4.2 Security & Access Controls
* **`createRepair(string calldata description)`**:
  * Enforces non-empty descriptions via `EmptyDescription()`.
  * Increments sequential ID starting at `1001` for human usability.
  * Emits `RepairCreated(repairId, technician, description, timestamp)`.

* **`updateRepairStatus(uint256 repairId, Status newStatus)`**:
  * Enforces technician identity match: `msg.sender == repair.technician`, reverting with `NotTechnician()` on unauthorized attempts.
  * Reverts with `RepairNotFound()` for non-existent IDs.
  * Reverts with `RepairFinalized()` if current status is `Completed` or `Cancelled`.
  * Reverts with `SameStatus()` if attempting redundant state updates.
  * Updates `updatedAt` to `block.timestamp` and emits `RepairStatusUpdated`.

## 5. Privacy & Data Protection Model
Blockchain immutability presents privacy challenges if sensitive consumer data is stored carelessly. RepairTag strictly adheres to a **Privacy-by-Design** standard:

* **Zero PII on-chain:** Customer names, phone numbers, email addresses, and physical addresses are NEVER submitted to smart contract state.
* **Device Scoping:** On-chain repair descriptions are restricted to hardware descriptors (e.g., *"MacBook Air M1 Screen Replacement"*).
* **Identifier-Only Verification:** Repair order discovery requires knowledge of the unique Repair ID assigned at intake.

## 6. Deployment & Network Configuration

| Parameter | Configuration |
| :--- | :--- |
| **Network** | Botchain Testnet |
| **Chain ID** | `968` |
| **RPC Endpoint** | `https://rpc.bohr.life` |
| **Block Explorer** | `https://scan.bohr.life` |
| **Native Currency** | BOHR |
| **Contract Address** | `0x1aE4071fba5659870C0bA001DfaF029BB85e8F61` |
| **Verification Status** | Fully Verified on BohrScan |

---

## 7. Conclusion
RepairTag bridges real-world small business operations with EVM blockchain utility. By combining immutable state transitions with a friction-free consumer portal, RepairTag demonstrates how decentralized ledgers can streamline everyday commercial workflows while preserving absolute customer privacy.
