// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title RepairTag
 * @dev On-chain repair tracking application for repair businesses.
 * Technicians create repair records and update their progress.
 * Customers can look up repair status using their unique Repair ID without needing to connect a wallet.
 */
contract RepairTag {
    enum Status {
        Received,
        Diagnosing,
        InRepair,
        ReadyForPickup,
        Completed,
        Cancelled
    }

    struct Repair {
        uint256 id;
        address technician;
        string description;
        Status status;
        uint256 createdAt;
        uint256 updatedAt;
    }

    // Custom errors
    error EmptyDescription();
    error RepairNotFound(uint256 repairId);
    error NotTechnician();
    error RepairFinalized(uint256 repairId, Status status);
    error SameStatus(Status status);

    // Events
    event RepairCreated(
        uint256 indexed repairId,
        address indexed technician,
        string description,
        uint256 createdAt
    );

    event RepairStatusUpdated(
        uint256 indexed repairId,
        Status oldStatus,
        Status newStatus,
        uint256 updatedAt
    );

    // State variables
    uint256 private _totalRepairs;
    uint256 private _nextRepairId = 1001; // Start repair IDs at 1001 for clean, human-readable IDs
    mapping(uint256 => Repair) private _repairs;
    mapping(address => uint256[]) private _technicianRepairIds;

    /**
     * @notice Creates a new repair record.
     * @param description Short description of the repair task.
     * @return repairId The unique ID generated for this repair.
     */
    function createRepair(string calldata description) external returns (uint256) {
        if (bytes(description).length == 0) {
            revert EmptyDescription();
        }

        uint256 repairId = _nextRepairId++;
        _totalRepairs++;

        Repair memory newRepair = Repair({
            id: repairId,
            technician: msg.sender,
            description: description,
            status: Status.Received,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });

        _repairs[repairId] = newRepair;
        _technicianRepairIds[msg.sender].push(repairId);

        emit RepairCreated(repairId, msg.sender, description, block.timestamp);

        return repairId;
    }

    /**
     * @notice Updates the status of an existing repair record.
     * @param repairId The ID of the repair.
     * @param newStatus The new status to transition to.
     */
    function updateRepairStatus(uint256 repairId, Status newStatus) external {
        Repair storage repair = _repairs[repairId];

        if (repair.createdAt == 0) {
            revert RepairNotFound(repairId);
        }

        if (repair.technician != msg.sender) {
            revert NotTechnician();
        }

        if (repair.status == Status.Completed || repair.status == Status.Cancelled) {
            revert RepairFinalized(repairId, repair.status);
        }

        if (repair.status == newStatus) {
            revert SameStatus(newStatus);
        }

        Status oldStatus = repair.status;
        repair.status = newStatus;
        repair.updatedAt = block.timestamp;

        emit RepairStatusUpdated(repairId, oldStatus, newStatus, block.timestamp);
    }

    /**
     * @notice Gets the details of a single repair by ID.
     * @param repairId The unique ID of the repair.
     */
    function getRepair(uint256 repairId) external view returns (Repair memory) {
        Repair memory repair = _repairs[repairId];
        if (repair.createdAt == 0) {
            revert RepairNotFound(repairId);
        }
        return repair;
    }

    /**
     * @notice Gets all repair records created by the caller technician.
     */
    function getMyRepairs() external view returns (Repair[] memory) {
        uint256[] storage ids = _technicianRepairIds[msg.sender];
        uint256 count = ids.length;
        Repair[] memory repairs = new Repair[](count);

        for (uint256 i = 0; i < count; i++) {
            repairs[i] = _repairs[ids[i]];
        }

        return repairs;
    }

    /**
     * @notice Gets the total count of repairs created across the entire platform.
     */
    function getTotalRepairs() external view returns (uint256) {
        return _totalRepairs;
    }
}

