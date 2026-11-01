import { expect } from "chai";
import hre from "hardhat";

const { ethers } = hre;

describe("RepairTag Smart Contract", function () {
  let repairTag: any;
  let owner: any;
  let technician1: any;
  let technician2: any;
  let customer: any;

  const Status = {
    Received: 0,
    Diagnosing: 1,
    InRepair: 2,
    ReadyForPickup: 3,
    Completed: 4,
    Cancelled: 5,
  };

  beforeEach(async function () {
    [owner, technician1, technician2, customer] = await ethers.getSigners();
    const RepairTagFactory = await ethers.getContractFactory("RepairTag");
    repairTag = await RepairTagFactory.deploy();
    await repairTag.waitForDeployment();
  });

  describe("Deployment", function () {
    it("should initialize total repairs to 0", async function () {
      expect(await repairTag.getTotalRepairs()).to.equal(0n);
    });
  });

  describe("Creating Repairs", function () {
    it("should allow a technician to create a repair record with initial status Received", async function () {
      const tx = await repairTag.connect(technician1).createRepair("iPhone 13 Screen Replacement");
      await tx.wait();

      expect(await repairTag.getTotalRepairs()).to.equal(1n);

      const repair = await repairTag.getRepair(1001);
      expect(repair.id).to.equal(1001n);
      expect(repair.technician).to.equal(technician1.address);
      expect(repair.description).to.equal("iPhone 13 Screen Replacement");
      expect(repair.status).to.equal(Status.Received);
      expect(repair.createdAt).to.be.greaterThan(0n);
      expect(repair.updatedAt).to.equal(repair.createdAt);
    });

    it("should emit RepairCreated event on creation", async function () {
      await expect(repairTag.connect(technician1).createRepair("Battery swap"))
        .to.emit(repairTag, "RepairCreated")
        .withArgs(1001n, technician1.address, "Battery swap", (val: any) => typeof val === "bigint");
    });

    it("should generate sequential unique repair IDs", async function () {
      await repairTag.connect(technician1).createRepair("Device 1");
      await repairTag.connect(technician2).createRepair("Device 2");
      await repairTag.connect(technician1).createRepair("Device 3");

      const r1 = await repairTag.getRepair(1001);
      const r2 = await repairTag.getRepair(1002);
      const r3 = await repairTag.getRepair(1003);

      expect(r1.id).to.equal(1001n);
      expect(r2.id).to.equal(1002n);
      expect(r3.id).to.equal(1003n);
      expect(await repairTag.getTotalRepairs()).to.equal(3n);
    });

    it("should reject empty repair descriptions", async function () {
      await expect(
        repairTag.connect(technician1).createRepair("")
      ).to.be.revertedWithCustomError(repairTag, "EmptyDescription");
    });
  });

  describe("Updating Repair Status", function () {
    beforeEach(async function () {
      await repairTag.connect(technician1).createRepair("MacBook Air Water Damage");
    });

    it("should allow the technician to update repair status", async function () {
      await expect(
        repairTag.connect(technician1).updateRepairStatus(1001, Status.Diagnosing)
      )
        .to.emit(repairTag, "RepairStatusUpdated")
        .withArgs(1001n, Status.Received, Status.Diagnosing, (val: any) => typeof val === "bigint");

      const repair = await repairTag.getRepair(1001);
      expect(repair.status).to.equal(Status.Diagnosing);
    });

    it("should prevent non-technicians from updating status", async function () {
      await expect(
        repairTag.connect(technician2).updateRepairStatus(1001, Status.Diagnosing)
      ).to.be.revertedWithCustomError(repairTag, "NotTechnician");

      await expect(
        repairTag.connect(customer).updateRepairStatus(1001, Status.Diagnosing)
      ).to.be.revertedWithCustomError(repairTag, "NotTechnician");
    });

    it("should prevent updating a non-existent repair", async function () {
      await expect(
        repairTag.connect(technician1).updateRepairStatus(9999, Status.Diagnosing)
      ).to.be.revertedWithCustomError(repairTag, "RepairNotFound");
    });

    it("should prevent updating to the same status", async function () {
      await expect(
        repairTag.connect(technician1).updateRepairStatus(1001, Status.Received)
      ).to.be.revertedWithCustomError(repairTag, "SameStatus");
    });

    it("should prevent status updates once marked Completed", async function () {
      await repairTag.connect(technician1).updateRepairStatus(1001, Status.Completed);
      
      await expect(
        repairTag.connect(technician1).updateRepairStatus(1001, Status.ReadyForPickup)
      ).to.be.revertedWithCustomError(repairTag, "RepairFinalized");
    });

    it("should prevent status updates once marked Cancelled", async function () {
      await repairTag.connect(technician1).updateRepairStatus(1001, Status.Cancelled);
      
      await expect(
        repairTag.connect(technician1).updateRepairStatus(1001, Status.InRepair)
      ).to.be.revertedWithCustomError(repairTag, "RepairFinalized");
    });
  });

  describe("Retrieving Repairs", function () {
    it("should return repair details for customers and technicians alike without auth", async function () {
      await repairTag.connect(technician1).createRepair("iPad Pro USB-C Port");

      // Calling from customer account
      const repair = await repairTag.connect(customer).getRepair(1001);
      expect(repair.id).to.equal(1001n);
      expect(repair.description).to.equal("iPad Pro USB-C Port");
      expect(repair.technician).to.equal(technician1.address);
    });

    it("should revert if repair does not exist", async function () {
      await expect(repairTag.getRepair(404)).to.be.revertedWithCustomError(
        repairTag,
        "RepairNotFound"
      );
    });

    it("should return only repairs created by the calling technician via getMyRepairs()", async function () {
      await repairTag.connect(technician1).createRepair("Tech1 Job 1");
      await repairTag.connect(technician2).createRepair("Tech2 Job 1");
      await repairTag.connect(technician1).createRepair("Tech1 Job 2");

      const tech1Repairs = await repairTag.connect(technician1).getMyRepairs();
      expect(tech1Repairs.length).to.equal(2);
      expect(tech1Repairs[0].description).to.equal("Tech1 Job 1");
      expect(tech1Repairs[1].description).to.equal("Tech1 Job 2");

      const tech2Repairs = await repairTag.connect(technician2).getMyRepairs();
      expect(tech2Repairs.length).to.equal(1);
      expect(tech2Repairs[0].description).to.equal("Tech2 Job 1");

      const customerRepairs = await repairTag.connect(customer).getMyRepairs();
      expect(customerRepairs.length).to.equal(0);
    });
  });
});
