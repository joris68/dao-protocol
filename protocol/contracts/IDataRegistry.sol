// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

interface IDataRegistry {
    
    struct File {
        address owner;
        bytes32 rawDataHash;
        bytes32 fileCID;
        FileStatus status;
        string sourceUrl;
        uint256 tlstimestamp;
    }

    struct JournalData {
        bytes32 notaryKeyFingerprint;
        string  method;
        string  url;
        uint256 tlsTimestamp;
        bytes32 extractionHash;
    }


    struct TransformJob {
        address whatEver;
    }

    /// @notice Emitted when a contribution is successfully verified
    event ContributionVerified(
        address owner,
        uint256 timestamp,
        uint256 blockNumber
    );

    event ContributionSubmitted(
        address owner,
        uint256 timestamp,
        uint256 blockNumber
    );


    //enum PermissonMode {
   //     open,
    //    restricted
    //}

    enum FileStatus {
        success,
        failed,
        proven,
        aborted
    }

}